module.exports = ({ actions, reporter }) => {
  const { createTypes } = actions;

  const typeDefs = `
    type Thought implements Node @infer {
      title: String!
      slug: String!
      aliases: [String]
      childMdx: Mdx
    }
  `;

  reporter.info("Digital Garden: setting up schema");
  createTypes(typeDefs);
};
