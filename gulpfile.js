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

var paths = {
  src: { root: 'app' },
  dist: { root: 'app/dist' },
  init: function() {
    this.src.sass        = this.src.root + '/_scss/app.scss';
    this.src.patterns    = this.src.root + '/_html/**/*.hbs';
    this.src.javascript  = [this.src.root + '/_scripts/_libs/*.js', this.src.root + '/_scripts/_plugins/*.js', this.src.root + '/_scripts/*.js'];
    this.src.libs        = this.src.root + '/_scripts/_libs/*.js';
    this.src.js_plugins  = this.src.root + '/_scripts/_plugins/*.js';
    this.src.images      = this.src.root + '/_assets/**/*.{jpg,jpeg,svg,png,gif}';

    this.dist.css        = this.dist.root + '/css';
    this.dist.images     = this.dist.root + '/assets';
    this.dist.javascript = this.dist.root + '/scripts';

    return this;
  },
}.init();

gulp.task('serve', ['watch'], () => {
  browserSync.init({
    server: paths.dist.root,
    open: true,
    notify: false,
    // Whether to listen on external
    online: false,
  });
});

gulp.task('styles', () => {
  gulp.src([paths.src.sass])
    .pipe(sassGlob())
    .on('error', util.log)
    .pipe(sass({
      includePaths: ['app/_scss'],
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
    .pipe(gulp.dest(paths.dist.css))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('images', () =>
  gulp.src([paths.src.images])
    .pipe(imagemin())
    .on('error', util.log)
    .pipe(gulp.dest(paths.dist.images))
    .on('error', util.log)
    .pipe(browserSync.reload({stream: true}))
);

/*
* Compile handlebars/partials into html
*/
gulp.task('templates', () => {

  var opts = {
    ignorePartials: true,
    batch: ['./app/_html'],
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

  gulp.src([paths.src.root + '/_html/templates/*.hbs'])
    .pipe(handlebars(null, opts))
    .on('error', util.log)
    .pipe(rename({
      extname: '.html',
    }))
    .on('error', util.log)
    .pipe(gulp.dest(paths.dist.root))
    .pipe(browserSync.reload({stream: true}));
});

/*
* Bundle all javascript files
*/
gulp.task('scripts', () => {
  gulp.src(paths.src.javascript)
    .pipe(concat('app.js'))
    .on('error', util.log)
    .pipe(uglify())
    .on('error', util.log)
    .pipe(rename({
      suffix: '.min',
    }))
    .on('error', util.log)
    .pipe(gulp.dest(paths.dist.javascript))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', () => {
  gulp.watch('app/_scss/**/*.scss', ['styles']);
  gulp.watch(paths.src.javascript, ['scripts']);
  gulp.watch(paths.src.images, ['images']);
  gulp.watch(paths.src.patterns, ['templates']);
});


gulp.task('default', ['serve', 'styles', 'scripts', 'templates','images']);
