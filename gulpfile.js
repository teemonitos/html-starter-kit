const { src, dest, parallel, series, watch } = require('gulp');
const gulpIF = require('gulp-if');
const htmlmin = require('gulp-htmlmin');
const bSync = require('browser-sync');
const argv = require('yargs').argv;
const del = require('del');

let isProd = (argv.production === undefined) ? false : true;
let isDev = !isProd;

const html = () => {
  return src('./src/*.html')
  .pipe(gulpIF(isProd, htmlmin({
    useShortDoctype: true
  })))
  .pipe(dest('dist'))
  .pipe(bSync.stream());
};

const watcher = () => {
  watch('./src/**/*.html', series(html));
};

const server = () => {
  bSync.init({
    open: false,
    ui: false,
    notify: false,
    server: {
      baseDir: './dist'
    }
  })
};

const clean = () => {
  return del('./dist/');
};
exports.clean = clean;

exports.default = series(
  clean,
  html,
  parallel(
    watcher,
    server
  )
);
