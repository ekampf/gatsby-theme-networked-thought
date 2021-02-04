module.exports = ({
  notesDirectory = "content/garden/", // Directory containing your digital garden notes
  rootPath = "/",
  rootNode = "about",
  hideDoubleBrackets = true,
  rssTitle = "gatsby-theme-ekampf-digital-garden generated rss feed",
}) => ({
  plugins: [
    `gatsby-plugin-theme-ui`,
    {
      resolve: "gatsby-plugin-mdx",
      options: {
        extensions: [".mdx", ".md"],
        defaultLayouts: {
          default: require.resolve("./src/templates/page.tsx"),
        },
        gatsbyRemarkPlugins: [
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 800,
            },
          },
        ],
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "content",
        path: "content",
      },
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
  ],
});
