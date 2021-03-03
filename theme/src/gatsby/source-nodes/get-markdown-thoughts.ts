import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { PluginOptions } from "../plugin-options-schema";

const isProduction = process.env.NODE_ENV === "production";

function stringToRegExp(value: string): RegExp {
  if (typeof value === "string") {
    return new RegExp(`^${value}$`);
  }
  return value;
}

const matches = (filename: string) => (regExp:RegExp) => regExp.test(filename);
const doesNotMatchAny = (regExps: RegExp[]) => (filename:string) => !regExps.some(matches(filename));

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

export type ThoughtFrontmatter = {
  title?: string;
  aliases?: string[];
  private?: boolean;
  hidden?: boolean;
}

export type Thought = {
  birthtime: Date;
  mtime: Date;
  filename: string;
  fullPath: string;
  slug: string;
  name: string,
  frontmatter: ThoughtFrontmatter;
  rawContent: string;
  content: string;
}

// See https://stackoverflow.com/questions/43118692/typescript-filter-out-nulls-from-an-array
function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  if (value === null || value === undefined) return false;
  const testDummy: TValue = value;
  return true;
}

export default function getMarkdownThoughts({
  thoughtsDirectory,
  generateSlug,
  exclude,
  excludeAsPrivate,
  privateMarkdown,
  showPrivateLocally,
  showHiddenLocally,
}: PluginOptions): Thought[] {
  const exclusions = (exclude && exclude.map(stringToRegExp)) || [];
  const privates = (excludeAsPrivate && excludeAsPrivate.map(stringToRegExp)) || [];
  const filenames = getAllFiles(thoughtsDirectory).map((filename) => filename.slice(thoughtsDirectory.length));

  const showPrivates = !isProduction && showPrivateLocally;
  const showHidden = !isProduction && showHiddenLocally;

  return filenames
    .filter((filename) => {
      return [".md", ".mdx"].includes(path.extname(filename).toLowerCase());
    })
    .filter(doesNotMatchAny(exclusions))
    .map<Thought | null>((filename) => {
      const { dir, name } = path.parse(filename);
      const noteName = path.join(dir, name);
      const slug = generateSlug(noteName);
      const fullPath = thoughtsDirectory + filename;
      const { birthtime, mtime } = fs.statSync(fullPath);
      let rawContent = fs.readFileSync(fullPath, "utf-8");
      const { content, data: frontmatter } = matter(rawContent);
      if (frontmatter.hidden && !showHidden) {
        return null;
      }

      const thoughtProps = {
        birthtime,
        mtime,
        filename,
        fullPath,
        slug,
        name: noteName,
        frontmatter: frontmatter as any as ThoughtFrontmatter,
      };

      const isPrivate = frontmatter.private == true || privates.some(matches(filename));
      if (isPrivate && !showPrivates) {
        return {
          ...thoughtProps,
          rawContent: privateMarkdown,
          content: privateMarkdown,
        };
      }

      return {
        ...thoughtProps,
        rawContent,
        content,
      };
    })
    .filter(notEmpty)
}
