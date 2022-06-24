# Data Engineering notes

### Installation and setup

Prerequisites

- [NodeJS](https://nodejs.org/en/)
- [Node Version Manager](https://github.com/nvm-sh/nvm)

Node Version Manager is recommended.

Installation guide [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

The following are to be run in your terminal.

Install dependencies

```bash
npm i 
```

Build the project

```bash
npm run build
```

Start the development server

```bash
npm run dev
```

Run the project locally

```bash
npm start
```
#### Contents
- AWS
- SQL learning log (SQLHabit)
- NoSQL notes (MongoDB)
- Talend Data Integration
- SCRUM
- Quizzes
- Jenkins
- PechaKucha
- HMRC (Brexit and GVMS)

#### How these notes were made

1. Take notes in markdown 
2. Use [Markdown Preview Enhanced](https://shd101wyy.github.io/markdown-preview-enhanced/#/) VSCode plugin to export markdown files to static HTML files
3. Stitch together static html files and serve them using [NextJS](https://nextjs.org/) for Static Site Generation (SSG)

> **Update**
Instead of using Markdown Preview Enhanced, we now rely on NextJS with plugins for converting markdown to html.

2. Use `remark` and `remark-html` to convert markdown to html.
   - Use `remark` to convert markdown content into an Abstract Syntax Tree (AST)
   - Then use `remark-html` to convert the AST to a HTML string
3. Use `remark-prism` for syntax highlighting code fenced blocks within markdown.
4. We use NextJS's native support for pre-rendering dynamic routes at build time with `getStaticPaths` 
