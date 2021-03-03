const unified = require(`unified`);
const markdown = require(`remark-parse`);

const linkify = require(`./linkify`).default;
const { generatePreviewMarkdown, generatePreviewHtml } = require(`./generate-preview-markdown`);
const getMarkdownThoughts = require(`./get-markdown-thoughts`).default;

function getThoughtId(slug, createNodeId) {
  return createNodeId(`Thought::${slug}`);
}

function processMarkdownThoughts(markdownThoughts, pluginOptions, reporter) {
  const slugToThoughtMap = new Map();
  const nameToSlugMap = new Map();
  const allReferences = [];

  markdownThoughts.forEach(({ filename, fullPath, name, slug, rawContent, content, frontmatter, birthtime, mtime }) => {
    reporter.info(`processing thought ${filename}`);
    const tree = unified().use(markdown).parse(content);

    nameToSlugMap.set(slug, slug);
    nameToSlugMap.set(name.toLowerCase(), slug);
    if (frontmatter.title) {
      nameToSlugMap.set(frontmatter.title.toLowerCase(), slug);
    }

    const aliases = [];
    if (frontmatter.aliases != null) {
      frontmatter.aliases
        .map((a) => a.trim().toLowerCase())
        .forEach((a) => {
          nameToSlugMap.set(a, slug);
          aliases.push(a);
        });
    }

    const references = [];

    const regex = /(?<=\[\[).*?(?=\]\])/g;
    const referencesMatches = [...content.matchAll(regex)] || [];
    referencesMatches.forEach((match) => {
      const text = match[0];
      const start = match.index;

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
      content,
      rawContent,
      fullPath,
      birthtime,
      mtime,
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

function generateThoughts(api, pluginOptions) {
  const { actions } = api;
  const { reporter } = api;
  const markdownThoughts = getMarkdownThoughts(pluginOptions);
  const { slugToThoughtMap, nameToSlugMap, allReferences } = processMarkdownThoughts(
    markdownThoughts,
    pluginOptions,
    reporter,
  );

  // Calculate backlinks for every slug
  const backlinkMap = new Map();
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
    const nodeData = {
      slug,
      title: thought.title,
      aliases: thought.aliases,
      content: content,
      rawContent: content,
      absolutePath: thought.fullPath,
      birthtime: thought.birthtime,
      mtime: thought.mtime,
    };

    const outboundReferences = thought.references;
    nodeData.outboundReferences = outboundReferences
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
    const inboundReferences = (showInboundReferences && backlinkMap.get(slug)) || [];
    nodeData.inboundReferences = inboundReferences.map(({ source, previewMarkdown }) => {
      const linkifiedMarkdown = linkify(previewMarkdown, nameToSlugMap, pluginOptions);

      const previewHtml = generatePreviewHtml(linkifiedMarkdown);
      return {
        slug: source,
        thoughtId: getThoughtId(source, api.createNodeId),
        previewMarkdown: linkifiedMarkdown,
        previewHtml,
      };
    });

    const nodeContent = JSON.stringify(nodeData);

    const nodeMeta = {
      id: getThoughtId(slug, api.createNodeId),
      parent: fileNodes.find((fn) => fn.absolutePath == thought.fullPath).id,
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

module.exports = {
  generateThoughts,
};
