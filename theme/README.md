<h1 align="center">
  gatsby-theme-networked-thought
</h1>

![lint](https://github.com/ekampf/gatsby-theme-networked-thought/actions/workflows/lint.yml/badge.svg?branch=main)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
![npm](https://img.shields.io/npm/v/gatsby-theme-networked-thought)
![Twitter URL](https://img.shields.io/twitter/url?label=Follow%20@ekampf&style=social&url=https%3A%2F%2Ftwitter.com%2Fekampf)

This theme is inspired by the work of [Andy](https://notes.andymatuschak.org/About_these_notes) and is based on on the work done by [gatsby-theme-brain](https://github.com/aengusmcmillin/gatsby-theme-brain), [gatsby-theme-andy](https://github.com/aravindballa/gatsby-theme-andy) and [react-stacked-pages-hook](https://github.com/mathieudutour/gatsby-n-roamresearch/tree/master/packages/react-stacked-pages-hook).

It also works very well with [Obsidian](http://obsidian.md/) as an authoring tool, which I am personally using.

## ✨ Features

🔗 Double square bracket linking (Case insensitive, Hierarchy support. ex: `[[Stocks/AAPL]]`)

📰 Frontmatter allows defining `title` and `aliases`

🌗 Light\Dark theme

## 🚀 Getting Started

- Start a new Gatsby website (manually or using a starter like the [default starter](https://github.com/gatsbyjs/gatsby-starter-default))
- Add the theme as dependency: `yarn add gatsby-theme-networked-thought`
- Edit `gatsby-config.js` and add ``gatsby-theme-networked-thought` as a plugin (see options documentation below). Also make sure `siteMetadata` has the following:

```
  siteMetadata: {
    title: `My Networked Thoughtsd`,
    description: `These are my thoughts...`,
    author: "John dow",
    twitter: `jdow`,
  },
```

- Create a `content/garden` folder at the and add `about.md`.
- Run your gatsby site and point the browser to the `rootPath` (which is `/` by default so `http://localhost:800/` should do it)

## 🎓 Usage

| Option              | Default Value                     | Description                                                                            |
| ------------------- | --------------------------------- | -------------------------------------------------------------------------------------- |
| `thoughtsDirectory` | "content/garden/"                 | Directory containing your digital garden notes.                                        |
| `rootPath`          | "/"                               | Set the root url for the brain on your site (e.g. in this case <https://example.com/>) |
| `rootThought`       | "about"                           | Name of the 'index' note. So in this case about.md would generate the root page.       |
| `generateSlug`      | `(filename) => slugify(filename)` | Function used to turn the filename of a note into its resulting slug (path)            |

### Run example

```shell
gatsby new my-theme https://github.com/gatsbyjs/gatsby-starter-theme-workspace
cd my-theme
yarn workspace example develop
```
