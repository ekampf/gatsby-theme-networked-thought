import { PluginOptions } from "./plugin-options-schema";

const config = ({ thoughtsDirectory = "content/garden/" }: PluginOptions) => ({
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: thoughtsDirectory,
      },
    },
    `gatsby-plugin-theme-ui`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-remark-images`,
    {
      resolve: "gatsby-plugin-mdx",
      options: {
        extensions: [".mdx", ".md"],
        gatsbyRemarkPlugins: [
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-mermaid`,
          `gatsby-remark-code-titles`,
          `gatsby-remark-prismjs`,
          `gatsby-remark-smartypants`,
          `gatsby-remark-external-links`,
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 800,
            },
          },
        ],
      },
    },
  ],
});

export default config;
