module.exports = ({ actions, reporter }) => {
  const { createTypes } = actions;

  const typeDefs = `
    type Note implements Node @infer {
      title: String!
      slug: String!
      rawContent: String
      content: String
      noteTemplate: String
      aliases: [String]
      outboundReferences: [String]
      outboundReferenceNotes: [Note] @link(from: "outboundReferenceNotes___NODE")
      inboundReferences: [String]
      inboundReferenceNotes: [Note] @link(from: "inboundReferenceNotes___NODE")
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
