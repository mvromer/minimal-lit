export default {
  open: true,
  nodeResolve: false,
  watch: true,
  rootDir: 'dist',
  appIndex: 'index.html',
  // This isn't documented on the web-dev-server site, but it's documented in the source for
  // web-dev-server, and this does exactly what we want to make sure output of the dev server and
  // other build tasks (e.g., rollup and postcss) aren't wiped from the screen when a reload occurs.
  clearTerminalOnReload: false,
  debug: true,
}
