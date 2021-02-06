module.exports = ({ Joi }) =>
  Joi.object({
    notesDirectory: Joi.string().default("content/garden/"),
    rootPath: Joi.string().default("/"),
    rootNode: Joi.string().default("about"),
    hideDoubleBrackets: Joi.boolean().default(true),
    rssTitle: Joi.string().default("gatsby-theme-ekampf-digital-garden generated rss feed"),
  });
