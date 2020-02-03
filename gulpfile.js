'use strict';

const gulp        = require('gulp');
const util        = require('gulp-util');
const sass        = require('gulp-sass');
const prefixer    = require('gulp-autoprefixer');
const uglify      = require('gulp-uglify');
const concat      = require('gulp-concat');
const rename      = require('gulp-rename');
const handlebars  = require('gulp-compile-handlebars');
const browserSync = require('browser-sync');
const sassGlob    = require('gulp-sass-bulk-import');
const csswring    = require('csswring');
const postcss     = require('gulp-postcss');
const sourcemaps  = require('gulp-sourcemaps');
const watch       = require('gulp-watch');
const history     = require('connect-history-api-fallback');
const imagemin    = require('gulp-imagemin');

const paths = {
  src: {
    root: 'src'
  },
  dist: {
    root: 'dist'
  },
  styles: {
    src: './src/_scss/app.scss',
    dist: './dist/css'
  },
  images: {
    src: './src/_assets/**/*.{jpg,jpeg,svg,png,gif}',
    dist: './dist/assets'
  },
  patterns: {
    src: './src/_html/**/*.hbs',
    dist: './dist/'
  },
  scripts: {
    src: './src/_scripts/*.js',
    libs: './src/_scripts/_libs/*.js',
    plugins: './src/_scripts/_plugins/*.js',
    dist: './dist/scripts'
  }
};

function server(done) {
  browserSync.init({
    server: paths.dist.root,
    open: true,
    notify: false,
    online: false
  });
  done();
}

function scripts() {
  return gulp
  .src([paths.scripts.libs, paths.scripts.plugins, paths.scripts.src])
    .pipe(concat('app.js'))
    .on('error', util.log)
    .pipe(uglify())
    .on('error', util.log)
    .pipe(rename({
      suffix: '.min',
    }))
    .on('error', util.log)
    .pipe(gulp.dest(paths.scripts.dist))
    .pipe(browserSync.reload({stream: true}));
}
function styles() {
  return gulp
    .src([paths.styles.src])
    .pipe(sassGlob())
    .on('error', util.log)
    .pipe(sass({
      includePaths: ['./src/_scss'],
    }))
    .on('error', util.log)
    .pipe(prefixer('last 2 versions'))
    .on('error', util.log)
    .pipe(sourcemaps.init())
    .on('error', util.log)
    .pipe(postcss([csswring]))
    .on('error', util.log)
    .pipe(rename({
      suffix: '.min',
    }))
    .on('error', util.log)
    .pipe(gulp.dest(paths.styles.dist))
    .pipe(browserSync.reload({stream: true}));
}
function images() {
  return gulp
    .src([paths.images.src])
    .pipe(imagemin())
    .on('error', util.log)
    .pipe(gulp.dest(paths.images.dist))
    .on('error', util.log)
    .pipe(browserSync.reload({stream: true}));
}
function templates() {
  var opts = {
    ignorePartials: true,
    batch: ['./src/_html'],
    helpers: {
      compare: function(lvalue, rvalue, options) {
        if (arguments.length < 3) {
          throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
        }
        var operator = options.hash.operator || "==";
        var operators = {
            '==':       function(l,r) { return l == r; },
            '===':      function(l,r) { return l === r; },
            '!=':       function(l,r) { return l != r; },
            '<':        function(l,r) { return l < r; },
            '>':        function(l,r) { return l > r; },
            '<=':       function(l,r) { return l <= r; },
            '>=':       function(l,r) { return l >= r; },
            'typeof':   function(l,r) { return typeof l == r; },
            'contains': function(l,r) { return l ? l.indexOf(r) !== -1 : false ; }
        };
        if (!operators[operator])
            throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);

        var result = operators[operator](lvalue,rvalue);

        if( result ) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
      },
      ifCond: function(v1, operator, v2, options) {
        switch (operator) {
          case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
          case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
          case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
          case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
          case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
          case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
          case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
          case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
          default:
            return options.inverse(this);
        }
      }
    }
  };

  return gulp
    .src(['./src/_html/templates/*.hbs'])
    .pipe(handlebars(null, opts))
    .on('error', util.log)
    .pipe(rename({
      extname: '.html',
    }))
    .on('error', util.log)
    .pipe(gulp.dest(paths.dist.root))
    .pipe(browserSync.reload({stream: true}));
}

function watchFiles() {
  gulp.watch(paths.patterns.src, templates);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch('./src/_scss/**/*.scss', styles);
  gulp.watch(paths.images.src, images);
}

const watchAll = gulp.parallel(watchFiles, server);

// export tasks
exports.images = images;
exports.styles = styles;
exports.scripts = scripts;
exports.templates = templates;
exports.watch = watchAll;
exports.default = watchAll;
