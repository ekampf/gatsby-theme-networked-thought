module.exports = ({ thoughtsDirectory = "content/garden/" }) => ({
  plugins: [
    `gatsby-plugin-theme-ui`,
    `gatsby-plugin-sharp`,
    `gatsby-remark-images`,
    {
      resolve: "gatsby-plugin-mdx",
      options: {
        extensions: [".mdx", ".md"],
        gatsbyRemarkPlugins: [
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 800,
            },
          },
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-mermaid`,
          `gatsby-remark-code-titles`,
          `gatsby-remark-prismjs`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: thoughtsDirectory,
      },
    },
  ],
});
