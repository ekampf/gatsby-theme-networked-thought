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

✨ Gatsby v3 and gatsby-plugin-image

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

| Option               | Default Value                     | Description                                                                                             |
| -------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `thoughtsDirectory`  | "content/garden/"                 | Directory containing your digital garden notes.                                                         |
| `exclude`            | []                                | List of strings or regular expressions. Notes files whose names match these will be ignored.            |
| `excludeAsPrivate`   | []                                | List of strings or regular expressions. Notes files whose names match these will be considered private. |
| `privateMarkdown`    | "This note is a [[private note]]" | The markdown text to show on private notes when instead of their content.                               |
| `showPrivateLocally` | true                              | Boolean. Determines whether to show private notes when not running in production.                       |
| `showHiddenLocally`  | true                              | Boolean. Determines whether to show hidden notes when not running in production.                        |
| `rootPath`           | "/"                               | Set the root url for the brain on your site (e.g. in this case <https://example.com/>)                  |
| `rootThought`        | "about"                           | Name of the 'index' note. So in this case about.md would generate the root page.                        |
| `generateSlug`       | `(filename) => slugify(filename)` | Function used to turn the filename of a note into its resulting slug (path)                             |

## Feature Details

### Double square-bracket linking

The core feature of taking networked thoughts notes - any piece of text wrapped in double square-brackets (ex: [[some thought]]) will turn into a link to
a page on that topic. If the page already exists it will link to that, if not it will create a new empty page.
When generating that page, a reference is created back to the linking page.

This means that you can create new topics without any content backing them and start linking to them from different pages on your networked thought graph.
These "empty thoughts" will still be backlinked to wherever you linked to them from.
This makes it easy to start linking together future-notes without having to write them at that moment.

Links are:

- Case Insensitive - so for example [[Apple]] and [apple] lead to the same page.
- Support folder hierarchies - So for example, [[Company/Apple]] would link to `<root content folder>/company/apple.md`

### Frontmatter Support

Frontmatter properties allow you to customize the page generation from the given markdown.
For example `Evergreen Notes.md` could contain:

```
---
title: "Evergreen Notes"
aliases: ["evergreen", ""]
---
```

Frontmatter supported properties:

- **title** - By default the page's `title` is its slug unless given a value.
- **aliases** - Allows adding aliases to a given page. In the example above, because there's an alias you could use `[[evergreen]]` to link to the page `Evergreen Notes.md` represents.
- **private** - Boolean. Whether the note is private or not.
- **hidden** - Boolean. Whether the note is hidden or not.
- **showReferences** - Boolean. Whether we want to show references to this note.

### Run example

```shell
gatsby new my-theme https://github.com/gatsbyjs/gatsby-starter-theme-workspace
cd my-theme
yarn workspace example develop
```
