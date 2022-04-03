const { src, dest, parallel, series, watch } = require('gulp');
const gulpIF = require('gulp-if');
const htmlmin = require('gulp-htmlmin');
const scss = require('gulp-sass')(require('sass'));
const autoprefix = require('gulp-autoprefixer');
const sourcemap = require('gulp-sourcemaps');
const csso = require('gulp-csso');
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

const style = () => {
  return src('./src/sass/*.scss')
  .pipe(gulpIF(isDev, sourcemap.init()))
  .pipe(gulpIF(isProd, autoprefix()))
  .pipe(scss().on('error', scss.logError))
  .pipe(gulpIF(isProd, csso({
    forceMediaMerge: true
  })))
  .pipe(gulpIF(isDev, sourcemap.write()))
  .pipe(dest('./dist/'))
  .pipe(bSync.stream());
};

const watcher = () => {
  watch('./src/**/*.html', series(html));
  watch('./src/sass/**/*.scss', series(style));
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
  style,
  parallel(
    watcher,
    server
  )
);
