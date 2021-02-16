/* eslint-disable @typescript-eslint/no-unused-vars */
const chokidar = require(`chokidar`);
const fs = require(`fs`);
const path = require(`path`);
const { createMachine, interpret } = require(`xstate`);
const matter = require(`gray-matter`);
const unified = require(`unified`);
const markdown = require(`remark-parse`);
const util = require(`util`);

const linkify = require(`./utils/linkify`);
const generatePreviewMarkdown = require(`./utils/generate-preview-markdown`);

/**
 * Create a state machine to manage Chokidar's not-ready/ready states.
 */
const createFSMachine = (api, pluginOptions) => {
  const { reporter } = api;

  // For every path that is reported before the 'ready' event, we throw them
  // into a queue and then flush the queue when 'ready' event arrives.
  // After 'ready', we handle the 'add' event without putting it into a queue.
  let pathQueue = [];
  const flushPathQueue = () => {
    const queue = pathQueue.slice();
    pathQueue = null;
    return generateThoughts(api, pluginOptions);
  };

  const log = (expr) => (ctx, action, meta) => {
    if (meta.state.matches(`BOOTSTRAP.BOOTSTRAPPED`)) {
      reporter.info(expr(ctx, action, meta));
    }
  };

  const fsMachine = createMachine(
    {
      id: `fs`,
      type: `parallel`,
      states: {
        BOOTSTRAP: {
          initial: `BOOTSTRAPPING`,
          states: {
            BOOTSTRAPPING: {
              on: {
                BOOTSTRAP_FINISHED: `BOOTSTRAPPED`,
              },
            },
            BOOTSTRAPPED: {
              type: `final`,
            },
          },
        },
        CHOKIDAR: {
          initial: `NOT_READY`,
          states: {
            NOT_READY: {
              on: {
                CHOKIDAR_READY: `READY`,
                CHOKIDAR_ADD: { actions: `queueNodeProcessing` },
                CHOKIDAR_CHANGE: { actions: `queueNodeProcessing` },
                CHOKIDAR_UNLINK: { actions: `queueNodeDeleting` },
              },
              exit: `flushPathQueue`,
            },
            READY: {
              on: {
                CHOKIDAR_ADD: {
                  actions: [`createAndProcessNode`, log((_, { pathType, path }) => `added ${pathType} at ${path}`)],
                },
                CHOKIDAR_CHANGE: {
                  actions: [`createAndProcessNode`, log((_, { pathType, path }) => `changed ${pathType} at ${path}`)],
                },
                CHOKIDAR_UNLINK: {
                  actions: [`createAndProcessNode`, log((_, { pathType, path }) => `deleted ${pathType} at ${path}`)],
                },
              },
            },
          },
        },
      },
    },
    {
      actions: {
        createAndProcessNode(_, { pathType, path }) {
          generateThoughts(api, pluginOptions);
        },
        flushPathQueue(_, { resolve, reject }) {
          flushPathQueue();
          resolve();
        },
        queueNodeDeleting(_, { path }) {
          pathQueue.push({ op: `delete`, path });
        },
        queueNodeProcessing(_, { path }) {
          pathQueue.push({ op: `upsert`, path });
        },
      },
    },
  );
  return interpret(fsMachine).start();
};

module.exports = async (api, pluginOptions) => {
  // Validate that the path exists.
  if (!fs.existsSync(pluginOptions.thoughtsDirectory)) {
    api.reporter.panic(`
The path passed to gatsby-theme-networked-thought does not exist on your file system:
${pluginOptions.path}
Please pick a path to an existing directory.
      `);
  }

  // Validate that the path is absolute.
  // Absolute paths are required to resolve images correctly.
  if (!path.isAbsolute(pluginOptions.thoughtsDirectory)) {
    pluginOptions.thoughtsDirectory = path.resolve(process.cwd(), pluginOptions.thoughtsDirectory) + "/";
  }

  const fsMachine = createFSMachine(api, pluginOptions);

  // Once bootstrap is finished, we only let one File node update go through
  // the system at a time.
  api.emitter.on(`BOOTSTRAP_FINISHED`, () => {
    fsMachine.send(`BOOTSTRAP_FINISHED`);
  });

  const watcher = chokidar.watch(pluginOptions.thoughtsDirectory + "/**/*.md*");

  watcher.on(`add`, (path) => {
    fsMachine.send({ type: `CHOKIDAR_ADD`, pathType: `file`, path });
  });

  watcher.on(`change`, (path) => {
    fsMachine.send({ type: `CHOKIDAR_CHANGE`, pathType: `file`, path });
  });

  watcher.on(`unlink`, (path) => {
    fsMachine.send({ type: `CHOKIDAR_UNLINK`, pathType: `file`, path });
  });

  return new Promise((resolve, reject) => {
    watcher.on(`ready`, () => {
      fsMachine.send({ type: `CHOKIDAR_READY`, resolve, reject });
    });
  });
};

const getAllFiles = function (dirPath, arrayOfFiles) {
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
};

function getMarkdownThoughts({ thoughtsDirectory, generateSlug }) {
  // let filenames = fs.readdirSync(thoughtsDirectory);
  const filenames = getAllFiles(thoughtsDirectory).map((filename) => filename.slice(thoughtsDirectory.length));

  return filenames
    .filter((filename) => {
      return [".md", ".mdx"].includes(path.extname(filename).toLowerCase());
    })
    .map((filename) => {
      const { dir, name } = path.parse(filename);
      const noteName = path.join(dir, name);
      const slug = generateSlug(noteName);
      const fullPath = thoughtsDirectory + filename;
      const rawContent = fs.readFileSync(fullPath, "utf-8");
      const { birthtime, mtime } = fs.statSync(fullPath);
      return {
        birthtime,
        mtime,
        filename,
        fullPath,
        slug,
        name: noteName,
        rawContent,
      };
    });
}

function getThoughtId(slug, createNodeId) {
  return createNodeId(`Thought::${slug}`);
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
  let backlinkMap = new Map();
  allReferences.forEach(({ source, references }) => {
    references.forEach((ref) => {
      const { text, previewMarkdown } = ref;
      const textLower = text.toLowerCase();
      const textLowerSlugified = pluginOptions.generateSlug(textLower);

      let backlinks = backlinkMap.get(textLowerSlugified) || [];
      backlinks.push({
        source: source,
        previewMarkdown: previewMarkdown,
      });
      backlinkMap.set(textLowerSlugified, backlinks);
    });
  });

  // Create nodes

  const fileNodes = api.getNodesByType("File");

  console.log("backlinkMap", backlinkMap);

  slugToThoughtMap.forEach((thought, slug) => {
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

        return {
          slug,
          thoughtId: getThoughtId(slug, api.createNodeId),
          previewMarkdown,
        };
      })
      .filter((x) => x != null);

    const inboundReferences = backlinkMap.get(slug) || [];
    nodeData.inboundReferences = inboundReferences.map(({ source, previewMarkdown }) => {
      return {
        slug: source,
        thoughtId: getThoughtId(source, api.createNodeId),
        previewMarkdown,
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
        contentDigest: api.createContentDigest(nodeData),
      },
    };

    const node = Object.assign({}, nodeData, nodeMeta);
    actions.createNode(node);
  });
}

function processMarkdownThoughts(markdownThoughts, pluginOptions, reporter) {
  const slugToThoughtMap = new Map();
  const nameToSlugMap = new Map();
  const allReferences = [];

  markdownThoughts.forEach(({ filename, fullPath, name, slug, rawContent, birthtime, mtime }) => {
    reporter.info(`processing thought ${filename}`);
    const { content, data: frontmatter, excerpt } = matter(rawContent);
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
      content: content,
      rawContent: rawContent,
      fullPath: fullPath,
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
