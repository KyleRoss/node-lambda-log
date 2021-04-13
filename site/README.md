# Lambda Log Website

Since Lambda Log has become more widely used and is growing, it was time to upgrade the documentation and web presence of this package. This website provides a brief overview of the package along with much more extensive documentation than previously with just a README file. Here's an overview of the website:

- Statically-generated using [Gatsby](https://www.gatsbyjs.com/).
- Hosted on Github Pages, deployed to the [gh-pages](https://github.com/KyleRoss/node-lambda-log/tree/gh-pages) branch.
- CNAME'd as [lambdalog.js.org](https://lambdalog.js.org).
- All content and documentation is manually managed (for now).
- Custom design; does not use any UI framework.



**Future Plans**

When time allows or if the community is able to assist, these are the future plans for the website:

- Automatic generation of API documentation.
- UI/UX fixes.
- Desktop browser support testing.
- Mobile browser support testing.
- Cleanup of code, styles, and markup.



## Files and Content

All files for the website lives inside of this directory (`/site`) and is a separate entity from the Lambda Log NPM package itself.

```
.
└── site/
    ├── src/
    │   ├── components/
    │   │   ├── docs/
    │   │   ├── ui/
    │   │   ├── hero.js
    │   │   └── inject.js
    │   ├── data/
    │   ├── layouts/
    │   │   ├── elements/
    │   │   │   ├── footer.js
    │   │   │   ├── head.js
    │   │   │   └── header.js
    │   │   └── index.js
    │   ├── pages/
    │   │   ├── docs/
    │   │   │   └── index.js
    │   │   └── index.js
    │   ├── styles/
    │   │   ├── global/
    │   │   ├── components.js
    │   │   ├── prism.js
    │   │   ├── theme.js
    │   │   └── typography.js
    │   ├── templates/
    │   │   └── docPage.js
    │   └── utils.js
    ├── static/
    ├── gatsby-config.js
    └── gatsby-node.js
```

_Important files/directories only shown above._



- `src/` — The source files for the Gatsby site.

  - `src/components/` — All the reusable components used on the website.

    - `src/components/docs/` — Contains reusable components for the documentation pages.
    - `src/components/ui/` — Contains reusable components used throughout the site.
    - `src/components/hero.js` — Hero component used on the home page.
    - `src/components/inject.js` — React injector component to use with rehype-react.

  - `src/data/` — Contains all of the content for the documentation pages.

    - `src/data/*.md` — Each markdown file is automatically parsed by Gatsby. The files are named using:

      ```
      00-name.md
      ```

      Where `00` is the priority/order of the file and `name` is a friendly name for the file.

  - `src/layouts/` — Contains the layouts and elements for the layouts of the website. Every page utilizes a layout.

    - `src/layouts/elements/` — Specific elements used by a layout. This includes a header, footer, and tags to be added to the `<head>` of the page.
    - `src/layouts/index.js` — The main layout used for the entire site.

  - `src/pages/` — Where all the pages for the site are defined.

    - `src/pages/docs/index.js` — The main documentation page. This is simply a redirect to the first documentation page.
    - `src/pages/index.js` — The home page.

  - `src/styles/` — Styles used throughout the site. Uses styled-components.

    - `src/styles/global/*.js` — Global site styles. Which includes styles for various HTML tags, links, etc.
    - `src/styles/components.js` — Generic styles that are used with various components throughout the site.
    - `src/styles/prism.js` — Styles for prism.js (code block highlighting).
    - `src/styles/theme.js` — The styled-components theme for the site. See [Branding](#branding) below.
    - `src/styles/typography.js` — Configuration for typography.js.

  - `src/templates/` — Templates for dynamically-created pages.

    - `src/templates/docPage.js` — Template/layout used for all documentation pages generated from the markdown files.

  - `src/utils.js` — Utility functions used throughout the site.

- `static/` — Static files and folder to be outputted to the root on build.

- `gatsby-config.js` — Configuration file for Gatsby.

- `gatsby-node.js` — Functions for Gatsby. Used to dynamically create doc pages from the markdown files.



### Content

The content for the homepage is hardcoded into the page itself within `src/pages/index.js`. The documentation pages are dynamically generated from markdown files within `src/data/`. If additional markdown files are added within that directory, they will automatically be added to the site.

#### Markdown Files

The markdown files are named as `ORDER-NAME.md` where `ORDER` is a 2-digit number and `NAME` is a friendly name for the page. Each of the files **must** contain the following front matter:

```
---
title: Title of Page
slug: title-of-page
order: 10
---

# Title of Page
Content...
```

- `title` — The title of the page. Used to generate the navigation and `<title>`.
- `slug` — A url-friendly slug for the page.
- `order` — The order of the page. Should be the same number that is prefixed on the file name.



HTML and all markdown syntax is supported within the files. In addition, rehype-react is used to take the AST that is generated by remark and use it directly within a React component without needing to use `dangerouslySetInnerHTML`. This also allows us to use React components within the markdown itself.

#### Custom Components in Markdown

Using rehype-react, we are able to specify HTML tags and map them to a custom React component. The following components are implemented:

##### `<a>` or `[text](link)` — CustomLink

All links added within the markdown files are mapped to the CustomLink component (`src/components/ui/link.js`). This handles adding `rel` attributes to external links, analytics tracking, etc.

##### `<h>` — Header

This is used exclusively for formatting a heading for API documentation by rendering the `src/components/docs/ui/header.js` component. This will generate a type badge, format/style the content, and add a returns if applicable. The available props/attributes are:

| Prop/Attribute | Type   | Required? | Description                                                  |
| -------------- | ------ | --------- | ------------------------------------------------------------ |
| `type`         | String | No        | The type of the header. Must be one of `class`, `property`, `event`, `function`, `module`, `getter`, or `setter`. |
| `scope`        | String | No        | The scope of the particular API element. Must be one of `static` or `instance`. |
| `text`         | String | Yes       | The text to display in the header.                           |
| `returns`      | String | No        | The returns for the API element. Prepend a `#` to automatically link. |
| `link`         | String | No        | Override the link for the returns.                           |

```markdown
## <h type="function" text="obj.myFunction(arg1, [arg2], [arg3])" returns="Boolean">
```

##### `<alert>` — Alert

A simple colored box on the page to highlight specific information that may be important. Renders `src/components/docs/ui/alert.js`. The props/attributes are:

| Prop/Attribute | Type   | Required? | Description                                                  |
| -------------- | ------ | --------- | ------------------------------------------------------------ |
| `type`         | String | Yes       | The type of the alert. Must be one of `info`, `warn`, `success`, or `plain`. |
| `children`     | Node   | Yes       | The content of the alert.                                    |

```markdown
<alert type="info">This is an info alert.</alert>
```

##### `<h*>` — Heading

Applies to all heading tags (`<h1>` - `<h6>`). Renders the `src/components/docs/ui/heading.js` component. Adds an `id` attribute to the HTML tag for URL fragments.



## Local Development

It easy to get the site running locally for development.

1. Clone this repo locally.
2. `cd` to `path/to/node-lambda-log/site`.
3. Install dependencies with: `npm i`.
4. Run `npm run develop`. The site will build and a dev server will be started on port `8000`.



## Build and Deployment

This site is built and deployed every time there is a push or merge to the `master` branch. This happens through Github Actions, particularly the [site workflow](https://github.com/KyleRoss/node-lambda-log/blob/master/.github/workflows/site.yml). Once the site is built, it will be automatically deployed to the [gh-pages](https://github.com/KyleRoss/node-lambda-log/tree/gh-pages) branch.



## Branding

While the branding is not the most important aspect of a documentation site, this outlines the current branding/styles of the website:

### Fonts

The site uses 2 web fonts for all of the fonts on the page; one sans-serif, the other is monospace. Instead of loading these fonts from Google Fonts, they are imported locally from the `@fontsource` repo.

**Sans-Serif:** [Fira Sans](https://fonts.google.com/specimen/Fira+Sans) — Used for all text throughout the site.

**Monospace:** [Fira Code](https://fonts.google.com/specimen/Fira+Code) — Used for inline code and code blocks throughout the site.

### Colors

**Note:** Not all colors are used on the site and are available for future use.

| Color                                                        | Hex Code  | Name      | Description                                                  |
| ------------------------------------------------------------ | --------- | --------- | ------------------------------------------------------------ |
| ![Black](https://via.placeholder.com/50.png/2e3135?text=+)   | `#2e3135` | black     | The color used for text on the site.                         |
| ![White](https://via.placeholder.com/50.png/fff?text=+)      | `#ffffff` | white     |                                                              |
| ![Primary](https://via.placeholder.com/50.png/eb6125?text=+) | `#eb6125` | primary   | The primary color. Used in the logo, links, and various elements. |
| ![Secondary](https://via.placeholder.com/50.png/4f5d75?text=+) | `#4f5d75` | secondary |                                                              |
| ![Red](https://via.placeholder.com/50.png/E84855?text=+)     | `#e84855` | red       |                                                              |
| ![Green](https://via.placeholder.com/50.png/70AE6E?text=+)   | `#70ae6e` | green     |                                                              |
| ![Blue](https://via.placeholder.com/50.png/2b9dd4?text=+)    | `#2b9dd4` | blue      |                                                              |
| ![Yellow](https://via.placeholder.com/50.png/FDCA40?text=+)  | `#fdca40` | yellow    |                                                              |
| ![Purple](https://via.placeholder.com/50.png/6247AA?text=+)  | `#6247aa` | purple    |                                                              |
| ![Pink](https://via.placeholder.com/50.png/ce2389?text=+)    | `#ce2389` | pink      |                                                              |
| ![Gray](https://via.placeholder.com/50.png/bfc0c0?text=+)    | `#bfc0c0` | gray      | Used for different accents and separators. Variations of this gray is used throughout the site. |
| ![Dark](https://via.placeholder.com/50.png/2d3142?text=+)    | `#2d3142` | dark      | Dark blue used as the header and footer background.          |

#### Color Variations

Currently, all colors variations are generated in-place where needed based off of the theme colors above. [Polished.js](https://polished.js.org/) is used for creating the variations.

### Icons

All the icons being used on the site is imported from [react-icons](https://react-icons.github.io/react-icons/).

