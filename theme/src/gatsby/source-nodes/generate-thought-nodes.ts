import type { NodePluginArgs, Reporter } from "gatsby";
import markdown from "remark-parse";
import unified from "unified";
import type { PluginOptions } from "../plugin-options-schema";
import { generatePreviewMarkdown, generatePreviewHtml } from "./generate-preview-markdown";
import getMarkdownThoughts from "./get-markdown-thoughts";
import type { MarkdownThought, ThoughtFrontmatter } from "./get-markdown-thoughts";
import linkify from "./linkify";

type BacklinkItem = {
  source: string;
  previewMarkdown: string;
};
type ReferenceItem = {
  text: string;
  previewMarkdown: string;
};
type Reference = {
  source: string;
  references: ReferenceItem[];
};

type Thought = {
  slug: string;
  name: string;
  title: string;
  birthtime: Date;
  mtime: Date;
  filename: string;
  fullPath: string;
  frontmatter: ThoughtFrontmatter;
  rawContent: string;
  content: string;
  aliases: string[];
  references: ReferenceItem[];
};

function getThoughtId(slug: string, createNodeId: NodePluginArgs["createNodeId"]) {
  return createNodeId(`Thought::${slug}`);
}

function processMarkdownThoughts(
  markdownThoughts: MarkdownThought[],
  pluginOptions: PluginOptions,
  reporter: Reporter,
) {
  const slugToThoughtMap = new Map<string, Thought>();
  const nameToSlugMap = new Map<string, string>();
  const allReferences: Reference[] = [];

  markdownThoughts.forEach(({ filename, fullPath, name, slug, rawContent, content, frontmatter, birthtime, mtime }) => {
    reporter.info(`processing thought ${filename}`);
    const tree = unified().use(markdown).parse(content);

    nameToSlugMap.set(slug, slug);
    nameToSlugMap.set(name.toLowerCase(), slug);
    if (frontmatter.title) {
      nameToSlugMap.set(frontmatter.title.toLowerCase(), slug);
    }

    const aliases: string[] = [];
    if (frontmatter.aliases != null) {
      frontmatter.aliases
        .map((a) => a.trim().toLowerCase())
        .forEach((a) => {
          nameToSlugMap.set(a, slug);
          aliases.push(a);
        });
    }

    const references: ReferenceItem[] = [];

    const regex = /(?<=\[\[).*?(?=\]\])/g;
    const referencesMatches = [...content.matchAll(regex)] || [];
    referencesMatches.forEach((match) => {
      const text = match[0];
      const start = match.index as number;

      // TODO: generate previewMarkdown
      const previewMarkdown = generatePreviewMarkdown(tree, start);

      references.push({
        text,
        previewMarkdown,
      });
    });

    allReferences.push({
      source: slug,
      references,
    });

    if (frontmatter.title == null) {
      frontmatter.title = name;
    }

    slugToThoughtMap.set(slug, {
      title: frontmatter.title,
      slug,
      name,
      content,
      rawContent,
      fullPath,
      birthtime,
      mtime,
      filename,
      frontmatter,
      aliases,
      references,
    });
  });

  return {
    slugToThoughtMap,
    nameToSlugMap,
    allReferences,
  };
}

export default function generateThoughts(api: NodePluginArgs, pluginOptions: PluginOptions) {
  const { actions, reporter } = api;
  const markdownThoughts = getMarkdownThoughts(pluginOptions);
  const { slugToThoughtMap, nameToSlugMap, allReferences } = processMarkdownThoughts(
    markdownThoughts,
    pluginOptions,
    reporter,
  );

  // Calculate backlinks for every slug
  const backlinkMap = new Map<string, BacklinkItem[]>();
  allReferences.forEach(({ source, references }) => {
    references.forEach((ref) => {
      const { text, previewMarkdown } = ref;
      const textLower = text.toLowerCase();
      const textLowerSlugified = pluginOptions.generateSlug(textLower);

      const backlinks = backlinkMap.get(textLowerSlugified) || [];
      backlinks.push({
        source: source,
        previewMarkdown: previewMarkdown,
      });
      backlinkMap.set(textLowerSlugified, backlinks);
    });
  });

  // Create nodes

  const fileNodes = api.getNodesByType("File");

  slugToThoughtMap.forEach((thought, slug) => {
    const { frontmatter } = thought;
    const content = linkify(thought.content, nameToSlugMap, pluginOptions);

    const outboundReferences = thought.references
      .map(({ text, previewMarkdown }) => {
        const slug = nameToSlugMap.get(text.toLowerCase());
        if (slug === undefined) {
          return null;
        }

        const linkifiedMarkdown = linkify(previewMarkdown, nameToSlugMap, pluginOptions);

        const previewHtml = generatePreviewHtml(linkifiedMarkdown);

        return {
          slug,
          thoughtId: getThoughtId(slug, api.createNodeId),
          previewMarkdown: linkifiedMarkdown,
          previewHtml,
        };
      })
      .filter((x) => x != null);

    const showInboundReferences = frontmatter.showReferences === undefined ? true : frontmatter.showReferences;
    const inboundReferencesData = (showInboundReferences && backlinkMap.get(slug)) || [];
    const inboundReferences = inboundReferencesData.map(({ source, previewMarkdown }) => {
      const linkifiedMarkdown = linkify(previewMarkdown, nameToSlugMap, pluginOptions);

      const previewHtml = generatePreviewHtml(linkifiedMarkdown);
      return {
        slug: source,
        thoughtId: getThoughtId(source, api.createNodeId),
        previewMarkdown: linkifiedMarkdown,
        previewHtml,
      };
    });

    const nodeData = {
      slug,
      title: thought.title,
      aliases: thought.aliases,
      content: content,
      rawContent: content,
      absolutePath: thought.fullPath,
      birthtime: thought.birthtime,
      mtime: thought.mtime,
      outboundReferences,
      inboundReferences,
    };

    const nodeContent = JSON.stringify(nodeData);

    const nodeMeta = {
      id: getThoughtId(slug, api.createNodeId),
      parent: fileNodes.find((fn) => fn.absolutePath == thought.fullPath)?.id,
      children: [],
      internal: {
        type: `Thought`,
        mediaType: `text/markdown`,
        content: content,
        contentDigest: api.createContentDigest(nodeContent),
      },
    };

    const node = Object.assign({}, nodeData, nodeMeta);
    actions.createNode(node);
  });
}
