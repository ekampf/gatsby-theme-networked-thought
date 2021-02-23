const fs = require(`fs`);
const path = require(`path`);
const matter = require(`gray-matter`);

const isProduction = process.env.NODE_ENV === "production";

function stringToRegExp(value) {
  if (typeof value === "string") {
    return new RegExp(`^${value}$`);
  }
  return value;
}

const matches = (filename) => (regExp) => regExp.test(filename);
const doesNotMatchAny = (regExps) => (filename) => !regExps.some(matches(filename));

function getAllFiles(dirPath, arrayOfFiles) {
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

function getMarkdownThoughts({
  thoughtsDirectory,
  generateSlug,
  exclude,
  private,
  privateMarkdown,
  showPrivateLocally,
  showHiddenLocally,
}) {
  const exclusions = (exclude && exclude.map(stringToRegExp)) || [];
  const privates = (private && private.map(stringToRegExp)) || [];
  const filenames = getAllFiles(thoughtsDirectory).map((filename) => filename.slice(thoughtsDirectory.length));

  const showPrivates = !isProduction && showPrivateLocally;
  const showHidden = !isProduction && showHiddenLocally;

  return filenames
    .filter((filename) => {
      return [".md", ".mdx"].includes(path.extname(filename).toLowerCase());
    })
    .filter(doesNotMatchAny(exclusions))
    .map((filename) => {
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
        frontmatter,
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
    .filter((x) => x);
}

module.exports = {
  getMarkdownThoughts,
};
