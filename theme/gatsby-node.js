const fs = require("fs");

exports.createSchemaCustomization = require("./src/gatsby/create-schema-customization");

exports.pluginOptionsSchema = require("./src/gatsby/plugin-options-schema");
exports.sourceNodes = require("./src/gatsby/source-nodes");

exports.onPreBootstrap = ({ reporter }, themeOptions) => {
  const thoughtsDirectory = themeOptions.thoughtsDirectory || "content/garden/";
  if (!fs.existsSync(thoughtsDirectory)) {
    reporter.info(`Creating notes directory: ${thoughtsDirectory}`);
    fs.mkdirSync(thoughtsDirectory, { recursive: true });
  }
};
