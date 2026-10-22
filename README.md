# 2026-non_plastic_substitutes

**Live demo** https://unctad-infovis.github.io/2026-non_plastic_substitutes/

## About

A single-chart visualisation of the structure of global trade in non-plastic substitutes (raw materials vs. value-added products, broken down by product category), built from UNCTADstat data as a Highcharts treemap. Part of a short "non-plastic substitutes" story alongside two companion Datawrapper charts (global plastics vs. non-plastic substitutes trade, and the same trade split by level of development).

## Rights of usage

Contact Teemo Tebest.

## How to build and develop

This is a Vite + React project.

* `npm install`
* `npm run start`

Project should start at: http://localhost:8080

For developing please refer to `package.json`

## Files and folders

All public assets go to folder `public`.

All source code goes to folder `src`.

## Packages

The following packages are used in this project by default.

### Shared UNCTAD packages

* **@unctad-infovis/general-tools** — shared React components (`ButtonAnchor`, `ButtonShare`, `ChartDataWrapper`, `Image`, `ProgressBar`, `Quote`, `Select`, `Tooltip`, `UNCTADSiteHeader`, `BackToTop`, …), helpers (`BasePath`, `LoadFile`, `CsvToJson`, `FormatNr`, `RoundNr`, `UseIsVisible`, …) and base design-token styles
* **@unctad-infovis/minisite-tools** — report/minisite layout components (`Header`, `HeaderChapter`, `Footer`, `SideScrollingText`)

These packages are published from the [`un-init-project`](https://github.com/unctad-infovis/un-init-project) monorepo to GitHub Packages, so installing needs an `.npmrc` with `@unctad-infovis:registry=https://npm.pkg.github.com` and a `GITHUB_PACKAGES_TOKEN` environment variable.

### Project specific

* **highcharts** — is used to create the treemap chart

### Build & Dev Server

* **vite** — development server with hot module replacement and production bundler, replaces webpack
* **@vitejs/plugin-react** — adds React and JSX support to Vite

### React

* **react** — UI component library
* **react-dom** — renders React components to the DOM

### Formatter & Linter

* **@biomejs/biome** — formats and lints JS, JSX and CSS files on save, replaces ESLint + Prettier

### Minification

* **terser** — minifies the production JavaScript bundle, removes console.logs in production builds

### MDX

* **@mdx-js/rollup** — Vite/Rollup plugin that compiles MDX files into React components
* **@mdx-js/react** — provides React context for MDX components