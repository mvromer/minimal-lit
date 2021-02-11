# Overview

This contains a minimal single page app project setup using [lit-html](https://lit-html.polymer-project.org/)
and [haunted](https://github.com/matthewp/haunted) for developing Web Components, and
[Tailwind](https://tailwindcss.com/) for the CSS framework. Dev server with live reloading support
is provided via [Web Dev Server](https://modern-web.dev/docs/dev-server/overview/). Build time
tooling is provided via [Gulp](https://gulpjs.com/), [Rollup](https://www.rollupjs.org/guide/en/),
[PostCSS](https://postcss.org/), and a whole host of plugins for each of them.

> **NOTE:** Support for testing in the works. I haven't settled on the testing framework I prefer
> that also meshes well with the current setup.

Ultimately, this little setup got me the tools I wanted to use and give me an environment where I
can feel pretty productive doing front-end development using what I guess is considered "modern
Javascript". Whether or not this is practical in the long run or others find useful remains to be
seen. If you have suggestions on how to improve this setup, feel free to send me a PR.

## Getting started

I put this together while working on the latest LTS release of Node.js at the time, which was
14.15.4. You'll first want to install that. Then go to the root of this project and run the
following:

```bash
npm run start
```

This will build the project, start the dev server, and enable file system watchers on the source
tree so that live reloading works.

## Future ideas

The following are other areas where I could see me potentially extending this minimal setup:

* Add testing support, ideally where I can continue using ES modules and not necessarily transpile
  back to something like CommonJS
* Add support for other static assets like images, fonts, etc. to the build process.
* Look at making a TypeScript variant of this project setup
