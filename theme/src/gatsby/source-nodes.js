const path = require("path");

const chokidar = require("chokidar");
const {
  createMachine,
  interpret,
  // actions: { log },
} = require(`xstate`);

function generateNodes(actions, createNodeId, createContentDigest, pluginOptions) {
  console.log("generateNodes called");
}

function createStateMachine({ actions, createNodeId, createContentDigest, reporter }, themeOptions) {
  let processingQueue = [];
  const flushProcessingQueue = () => {
    let queue = processingQueue.slice();
    processingQueue = null;
    return Promise.all(
      queue.map(({ op, path }) => {
        switch (op) {
          case `delete`:
          case `upsert`:
            return generateNodes(actions, createNodeId, createContentDigest, themeOptions);
        }
      }),
    );
  };

  const log = (expr) => (ctx, action, meta) => {
    if (meta.state.matches(`BOOTSTRAP.BOOTSTRAPPED`)) {
      if (typeof expr == "function") {
        reporter.info(expr(ctx, action, meta));
      } else {
        reporter.info(expr);
      }
    }
  };

  const stateMachine = createMachine(
    {
      id: `digitalGardenStateMachine`,
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
        WATCHING: {
          initial: `NOT_READY`,
          states: {
            NOT_READY: {
              on: {
                WATCHER_READY: `READY`,
                WATCHER_ADD: { actions: `queueNodeProcessing` },
                WATCHER_CHANGE: { actions: `queueNodeProcessing` },
                WATCHER_UNLINK: { actions: `queueNodeDeleting` },
              },
              exit: `flushProcessingQueue`,
            },
            READY: {
              on: {
                WATCHER_ADD: {
                  actions: [log((_, { pathType, path }) => `added ${pathType} at ${path}`), `generateNodes`],
                },
                WATCHER_CHANGE: {
                  actions: [log((_, { pathType, path }) => `changed ${pathType} at ${path}`), `generateNodes`],
                },
                WATCHER_UNLINK: {
                  actions: [log((_, { pathType, path }) => `deleted ${pathType} at ${path}`), `generateNodes`],
                },
              },
            },
          },
        },
      },
    },
    {
      actions: {
        generateNodes() {
          generateNodes(actions, createNodeId, createContentDigest, themeOptions);
        },
        flushProcessingQueue(_, { resolve, reject }) {
          flushProcessingQueue().then(resolve, reject);
        },
        queueNodeDeleting(_, { path }) {
          processingQueue.push({ op: `delete`, path });
        },
        queueNodeProcessing(_, { path }) {
          processingQueue.push({ op: `upsert`, path });
        },
      },
    },
  );

  return interpret(stateMachine)
    .onTransition((state) =>
      reporter.info(`Digital Garden: state transition to (${state.value.BOOTSTRAP}, ${state.value.WATCHING})`),
    )
    .start();
}

module.exports = async (gatsbyApi, themeOptions) => {
  const { notesDirectory = "content/garden/" } = themeOptions;

  gatsbyApi.emitter.on(`BOOTSTRAP_FINISHED`, () => {
    machine.send(`BOOTSTRAP_FINISHED`);
  });

  const machine = createStateMachine(gatsbyApi, themeOptions);

  const watchPath = path.resolve(process.cwd(), notesDirectory);
  const watcher = chokidar.watch(watchPath);

  watcher.on(`add`, (path) => {
    machine.send({ type: `WATCHER_ADD`, pathType: `file`, path });
  });

  watcher.on(`change`, (path) => {
    machine.send({
      type: `WATCHER_CHANGE`,
      pathType: `file`,
      path,
    });
  });

  watcher.on(`unlink`, (path) => {
    machine.send({
      type: `WATCHER_UNLINK`,
      pathType: `file`,
      path,
    });
  });

  return new Promise((resolve, reject) => {
    watcher.on(`ready`, () => {
      machine.send({ type: `WATCHER_READY`, resolve, reject });
    });
  });
};
