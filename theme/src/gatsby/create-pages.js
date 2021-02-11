const path = require(`path`);

module.exports = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;
  const template = path.resolve(path.join(__dirname, `../templates/thought.tsx`));
  const result = await graphql(`
    {
      thoughts: allThought {
        nodes {
          id
          title
          slug
          aliases
          content
        }
      }
    }
  `);
  if (result.errors) throw result.errors;

  const nodes = (result.data.thoughts || {}).nodes || [];
  nodes.forEach((node) => {
    const { id, slug, title } = node;
    reporter.info(`Creating thought page: ${slug}`);
    createPage({
      path: slug,
      component: template,
      context: { id, title },
    });
  });
};
