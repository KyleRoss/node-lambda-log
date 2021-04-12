---
title: 'Development'
slug: 'development'
order: 30
---

# Development
If you are planning to do any development on Lambda Log, whether for testing or submitting a pull request, this will guide you through the steps.

## Cloning
Before you can start development on the code, you'll need to clone the repo.

**If you are planning to submit a pull request:**
- Fork the [node-lambda-log](https://github.com/KyleRoss/node-lambda-log) repo.
- Clone down the code from your fork to your machine.

**If you are just testing the code or want to play around:**
- Clone the [node-lambda-log](https://github.com/KyleRoss/node-lambda-log) repo to your machine.

## Setup
Now that you have the code cloned to your local machine, let's get everything set up for development.

<alert type="info">It's highly recommended to use [VSCode](https://code.visualstudio.com/) for development work on Lambda Log. This repo contains workspace settings and recommended extensions for VSCode to ensure that your environment is setup correctly and the code style/rules are enforced. If you are to use another editor, ensure that you setup your environment to match.</alert>

**Requirements:**<br>
Ensure that you have the following requirements before beginning:

- Install [git](https://git-scm.com/downloads) if you do not already have it.
- Install the latest LTS of [Node](https://nodejs.org/en/download/). I strongly recommend using [NVM](https://github.com/nvm-sh/nvm/blob/master/README.md) for this.


**Install Dependencies:**
- Open terminal and `cd` to the root of this repo you cloned.
- Run `npm i` to install the dependencies for Lambda Log.

**Setup VSCode:**
- Open the repo's folder in VSCode. You will be prompted to install a couple of extensions if you do not already have them installed. Ensure to accept each one.
- You may be prompted with another dialog to allow usage of the project installed version of ESLint. You should click "Allow" on this dialog. If you do not receive a dialog, follow the documentation [here](https://github.com/Microsoft/vscode-eslint#version-2110).

You are now able to start development!

## Other Information
### Structure
```
.
└── node-lamda-log/
    ├── lib/
    │   ├── LambdaLog.js
    │   ├── LambdaLog.test.js
    │   ├── LogMessage.js
    │   └── LogMessage.test.js
    ├── site/
    ├── index.js
    ├── index.test.js
    └── package.json
```

- The entrypoint for this module is `index.js`.
- The classes used by this module are defined in the `lib/` directory.
- Files that end with `.test.js` are the [Jest](https://jestjs.io/) unit tests for that file.
- All files in the `site/` directory are for this website. See [Website](#website) below for more information.

There are other files that are less important to the development of Lambda Log but have other purposes:
- `.github/workflows/` — Contains the workflow definitions for building and publishing this package and website on Github Actions.
- `.vscode/extensions.json` — The recommended VSCode extensions to prompt for installation when the workspace is opened.
- `.vscode/settings.json` — The VSCode settings for this workspace.
- `.eslintrc.yml` — The ESLint configuration for this project.
- `.gitignore` — Ignore patterns of files/folders that should not be committed to the repository.
- `.npmignore` — Ignore patterns of files/folders that are in git, but should not be packaged when publishing the package to NPM.
- `.releaserc` — Configuration for [Semantic Release](https://semantic-release.gitbook.io/semantic-release/).
- `CHANGELOG.md` — Changes between versions of LambdaLog. _Do not update this file, it is updated automatically by Semantic Release._
- `commitlint.config.js` — Configuration for [commitlint](https://commitlint.js.org/) to enforce [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).
- `jest.config.js` — Configuration for [Jest](https://jestjs.io/).
- `LICENSE` — The license for this project.
- `README.md` — The main readme for this project.

### Tests
Unit testing is important to ensure this module functions the way it was intended between changes and different versions of Node. Tests are written using [Jest](https://jestjs.io/) and executed on every pull request and merge into the `master` branch. Tests are separated by file and live alongside the main file with a `.test.js` file extension.

**There should always be 100% test coverage including branches.**

To run the tests, execute the following command in terminal within the root of this project:
```shell
npm test
```

If all of the tests pass, you will be presented with table that shows the test coverage. Ensure you have 100% coverage across the board prior to opening a pull request.

### Conventional Commits
This project uses [Semantic Release](https://semantic-release.gitbook.io/semantic-release/) to publish new versions to the NPM registry. Semantic Release is able to determine whether to release a new version and what the version number should be by evaluating the commit messages made since the prior release. This is why it's **extremely important** to use [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) messages for each of the commits made. While this information is available on their websites, here is a quick overview.

**The conventional commit message structure:**
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Semantic Release will only release a new version of the module if the `feat:` or `fix:` types are used. All other types will not trigger a release.
- `feat:` — A new feature or improvement. This will cause Semantic Release to bump the _minor_ version (`[major].[minor].[patch]`) of the module.
- `fix:` — A bug fix. This will cause Semantic Release to bump the _patch_ version (`[major].[minor].[patch]`) of the module.

If the change imposes a breaking change, `BREAKING CHANGE` should be included at the end of the commit message body. This will trigger Semantic Release to bump the _major_ version (`[major].[minor].[patch]`) of the module. This will work with any "type".

**Other types:**
- `build:` — A change that affects the build process of the module.
- `chore:` — Any change that does not fit with any other type.
- `ci:` — Used by the CI/CD to note a change that was committed during build.
- `docs:` — Updates to documentation or README.
- `style:` — A stylistic change to the code (ex. using semi-colons).
- `reactor:` — A refactor of the code that does not change the functionality.
- `perf:` — A change that increases the performance of a specific piece of functionality.
- `test:` — Any change or addition to the unit tests.

#### CommitLint
This module is setup with [Husky](https://typicode.github.io/) and [CommitLint](https://commitlint.js.org/) to help enforce the usage of Conventional Commit messages. While this should automatically prevent commit messages that are not in the proper format, there is, at times, issues on certain platforms, git versions, and configurations where this git hook will not run. This is why it's important to ensure you are writing proper commit messages.

#### Examples of proper commit messages
```
feat: add new option `dynamicMeta` to LambdaLog class
```
_Bumps the minor version of the module._

```
fix: remove extra space in error message
```
_Bumps the patch version of the module._

```
feat: remove existing log tags in favor of customizable tags

BREAKING CHANGE
```
_Bumps the mahor version of the module._


### Commiting and Pull Requests
First off, thank you for your contributions! Before you make any commits and open a pull request, please ensure you have completed the following:

**Before Committing:**
- Ensure there are no ESLint errors or warnings within the code and that it matches the style of the existing code.
- You are writing your commit messages using [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).

**Before opening a Pull Request:**
- Ensure you have written and/or updated the unit tests for your changes.
- Test and branch coverage remains at 100%.
- Documentation has been updated if applicable.


### CI/CD and Publishing
Lambda Log uses GitHub Actions to build and publish this module to the NPM registry. When a new pull request is opened, a subset of the build process will run to verify code coverage and ensure it meets the guidelines.

When a pull request is merged into `master`, the build process will:

- Run all tests to ensure they pass and meet 100% coverage.
- Use Semantic Release to:
  - Determine the new version number of the module.
  - Build out the changelog.
  - Package and publish the module to the NPM registry.
  - Update the changelog and package.json in the repository.
  - Create a new release on Github.
- Build the website and push the built site to the respository.

## Website
This website's source code is part of the [node-lambda-log](https://github.com/KyleRoss/node-lambda-log) repo and is hosted on Github pages. Here is some basic information about the website:

- The site is built using [Gatsby](https://www.gatsbyjs.com/).
- All the documentation lives in Markdown files within `site/src/data/`.
- The site will be deployed with every merge into `master`.
