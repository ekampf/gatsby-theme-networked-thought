/* eslint-disable @typescript-eslint/no-unused-vars */
const chokidar = require(`chokidar`);
const fs = require(`fs`);
const path = require(`path`);
const { createMachine, interpret } = require(`xstate`);

const { generateThoughts } = require(`./generate-thought-nodes`);

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
