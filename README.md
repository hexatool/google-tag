<h1 align="center">
  Google Tag
</h1>

<p align="center">
  Agnostic Google Tag library.
</p>

## Installation

```bash
npm install --save @hexatool/google-tag
```

**Using yarn**

```bash
yarn add @hexatool/google-tag
```

## What it does

- Lints JavaScript and TypeScript
  using [`eslint:recommended`](https://eslint.org/docs/latest/user-guide/configuring/configuration-files#using-eslintrecommended)
  and [Prettier](https://prettier.io/)
- Uses the following plugins:
  - [`@typescript-eslint`](https://github.com/typescript-eslint/typescript-eslint): TypeScript support
  - [`import`](https://github.com/import-js/eslint-plugin-import/): helps validate proper imports
  - [`simple-import-sort`](https://github.com/lydell/eslint-plugin-simple-import-sort/): sorts imports
  - [`unused-imports`](https://github.com/sweepline/eslint-plugin-unused-imports): finds and removes unused ES6 module
    imports

https://developers.google.com/tag-platform/gtagjs?hl=es
https://developers.google.com/tag-platform/gtagjs/reference?hl=es
https://developers.google.com/Tag/devguides/collection/ga4?hl=es

https://developers.google.com/Tag/devguides/collection/gtagjs?hl=es

## Hexatool Code Quality Standards

Publishing this package we are committing ourselves to the following code quality standards:

- Respect **Semantic Versioning**: No breaking changes in patch or minor versions
- No surprises in transitive dependencies: Use the **bare minimum dependencies** needed to meet the purpose
- **One specific purpose** to meet without having to carry a bunch of unnecessary other utilities
- **Tests** as documentation and usage examples
- **Well documented ReadMe** showing how to install and use
- **License favoring Open Source** and collaboration
