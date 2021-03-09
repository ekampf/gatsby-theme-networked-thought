import fs from "fs";
import createPages from "./create-pages";
import createSchemaCustomization from "./create-schema-customization";
import pluginOptionsSchema from "./plugin-options-schema";
import sourceNodes from "./source-nodes";

function onPreBootstrap({ reporter }, themeOptions) {
  const thoughtsDirectory = themeOptions.thoughtsDirectory || "content/thoughts/";
  if (!fs.existsSync(thoughtsDirectory)) {
    reporter.info(`Creating notes directory: ${thoughtsDirectory}`);
    fs.mkdirSync(thoughtsDirectory, { recursive: true });
  }
}

export default {
  createSchemaCustomization,
  pluginOptionsSchema,
  sourceNodes,
  createPages,
  onPreBootstrap,
};
