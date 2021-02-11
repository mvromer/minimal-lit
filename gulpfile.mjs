import fs from 'fs';
import path from 'path';
import gulp from 'gulp';
import postcss from 'gulp-postcss';
import sriHash from 'gulp-sri-hash';
import rollupResolve from '@rollup/plugin-node-resolve';
import rollupStream from '@rollup/stream';
import source from 'vinyl-source-stream';
import { startDevServer } from '@web/dev-server';

// Overview
//
// All build output ends up in the dist folder. When the dev server is run, it'll serve files out of
// this directory. The default gulp task will automatically run the build task if it believes that
// the project hasn't been previously built (by scanning for a dist/index.html file), start the dev
// server in watch mode, and start a set of file system watchers that will rebuild the HTML/CSS/JS
// if any of its sources change.

// JavaScript using Rollup. Outputs ES module format by default, but that can be changed if desired.
function buildJavascript() {
  return rollupStream({
    input: './src/components/App.js',
    output: {
      format: 'es'
    },
    plugins: [
      rollupResolve()
    ]
  })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./dist/static'));
}

// Build CSS using PostCSS, which is configured (via postcss.config.js) to use Tailwind CSS (which
// is configured via tailwind.config.js).
function buildCss() {
  return gulp.src('./src/styles/main.css')
    .pipe(postcss())
    .pipe(gulp.dest('./dist/static'));
}

// Build HTML output, primarily the index.html file. Use gulp-sri-hash to compute the subresource
// integrity attributes on link and script tags that load our CSS and JS, respectively.
function buildHtml() {
  // NOTE: sri-hash expects to find asset files referenced by the source HTML files either relative
  // to the file's base Vinyl attribute (which is typically the glob base, see here:
  // https://gulpjs.com/docs/en/api/concepts#glob-base) or relative to the directory containing the
  // HTML file.
  //
  // Neither of these work if we're piping HTML files located in the src directory directly into
  // sri-hash because the assets (CSS and JS files) referenced by those HTML files aren't fully
  // realized until they have been built and written to the dist directory. No amount of config can
  // get sri-hash to load the built assets from the dist directory if the HTML file it's currently
  // processing has a Vinyl path located under the src directory.
  //
  // Instead, we pipe the HTML files directly to dest, which writes them to dist and updates their
  // path attributes. We then call sri-hash to update the HTML files with the add the integrity
  // attributes. Finally, we write the new HTML file contents to disk.
  return gulp.src('./src/index.html')
    .pipe(gulp.dest('./dist'))
    .pipe(sriHash())
    .pipe(gulp.dest('./dist'));
}

// Static assets -- TBD.

// Aggregate build command. This basically conveniently wraps the previous build* commands.
const build = gulp.series(gulp.parallel(buildJavascript, buildCss), buildHtml);

// Starts web-dev-server in watch mode. Configure it to ignore the CLI arguments but use the
// web-dev-server.config.mjs file to load the server configuration.
async function startServer() {
  await startDevServer({
    readCliArgs: false,
    readFileConfig: true
  });
}

// Start a set of file system watchers that look at the source for all HTML, CSS, JS, and other
// static assets. If any of them change, rerun their respective build task.
function watchSource(done) {
  gulp.watch('src/**/*.html', buildHtml);
  gulp.watch('src/**/*.css', gulp.series(buildCss, buildHtml));
  gulp.watch('src/**/*.js', gulp.series(buildJavascript, buildHtml));
  done();
}

// Export each of the previous tasks with terse task names.
export {
  buildJavascript as js,
  buildCss as css,
  buildHtml as html,
  build,
  startServer as serve,
  watchSource as watch
};

// Setup the default task. It will always start the dev server and run the file system watchers. If
// it thinks there isn't any build output, it'll automatically run the build task before starting
// the server and watchers.
const compiledIndexExists = fs.existsSync(path.join(process.cwd(), 'dist', 'index.html'));
const defaultTask = compiledIndexExists ?
  gulp.parallel(startServer, watchSource) :
  gulp.series(build, gulp.parallel(startServer, watchSource));

export default defaultTask;
