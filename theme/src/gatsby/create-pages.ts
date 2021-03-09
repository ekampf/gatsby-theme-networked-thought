import path from "path";
import type { GatsbyNode } from "gatsby";
import type { PluginOptions } from "./plugin-options-schema";

interface CreatePagesQuery {
  thoughts: {
    nodes: {
      id: string;
      title: string;
      slug: string;
      aliases: string[];
      content: string;
      absolutePath: string;
    }[];
  };
}

const createPages: GatsbyNode["createPages"] = async ({ graphql, actions, reporter }, options) => {
  if (!options) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pluginOptions = (options as any) as PluginOptions;

  const { createPage } = actions;
  const template = path.resolve(path.join(__dirname, `../src/templates/thought.tsx`));
  const result = await graphql<CreatePagesQuery>(`
    {
      thoughts: allThought {
        nodes {
          id
          title
          slug
          aliases
          content
          absolutePath
        }
      }
    }
  `);
  if (result.errors) throw result.errors;

  const { rootThought, rootPath } = pluginOptions;

  const nodes = (result.data?.thoughts || {}).nodes || [];
  nodes.forEach((node) => {
    const { id, slug, title, absolutePath } = node;
    if (slug == rootThought || title == rootThought) {
      reporter.info(`Creating root ${rootPath} thought page: ${slug}`);
      createPage({
        path: rootPath,
        component: template,
        context: { id, title, slug, absolutePath },
      });
    }

    reporter.info(`Creating thought page: ${slug}`);
    createPage({
      path: slug,
      component: template,
      context: { id, title, slug, absolutePath },
    });
  });
};

export default createPages;
