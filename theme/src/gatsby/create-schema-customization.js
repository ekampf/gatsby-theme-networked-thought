module.exports = ({ actions, reporter }) => {
  const { createTypes } = actions;

  const typeDefs = `
    type Thought implements Node @infer {
      title: String!
      slug: String!
      rawContent: String
      content: String
      noteTemplate: String
      aliases: [String]
      outboundReferences: [String]
      outboundReferenceThoughts: [Thought] @link(from: "outboundReferenceThoughts___NODE")
      inboundReferences: [String]
      inboundReferenceThoughts: [Thought] @link(from: "inboundReferenceThoughts___NODE")
      inboundReferencePreview: [InboundReferencePreview]
      childMdx: Mdx
    }

    type InboundReferencePreview @infer {
      source: String!
      previewHtml: String!
    }
  `;

  reporter.info("Digital Garder: setting up schema");
  createTypes(typeDefs);
};
