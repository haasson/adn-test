const gulp         = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS     = require('gulp-clean-css');
const del          = require('del');
const browserSync  = require('browser-sync').create();
const babel        = require('gulp-babel');
const sourcemaps   = require('gulp-sourcemaps');
const uglify       = require('gulp-uglify');
const gulpif       = require('gulp-if');
const gcmq         = require('gulp-group-css-media-queries');
const tinypng      = require('gulp-tinypng-compress');
const sass         = require('gulp-sass');
const concat       = require('gulp-concat');
const svgmin       = require('gulp-svgmin');
const svgSprite    = require('gulp-svg-sprite');
const cheerio      = require('gulp-cheerio');
const replace      = require('gulp-replace');
const gulppug          = require('gulp-pug');

let isDev = process.argv.indexOf('--dev') !== -1;
let isSync = process.argv.indexOf('--unsync') !== -1;
let isProd = !isDev;

function styles() {
   return gulp.src('src/sass/style.sass')
              .pipe(gulpif(isDev, sourcemaps.init()))
              .pipe(sass().on('error', sass.logError))
              .pipe(gulpif(isProd, gcmq()))
              .pipe(autoprefixer({
                 overrideBrowserslist: ['> 0.1%'],
                 cascade: false
              }))
              .pipe(gulpif(isProd, cleanCSS({
                 level: 2
              })))
              .pipe(gulpif(isDev, sourcemaps.write()))
              .pipe(gulp.dest('build/css/'))
              .pipe(gulpif(!isSync, browserSync.stream()));
}

function img() {
   return gulp.src('src/img/**/*')
              .pipe(gulpif(isProd, tinypng({
                  key: 'ILGj6BYXCPvw7nOQJ2KZ3ufdgWdDQ3NS',
               })))
              .pipe(gulp.dest('build/img'))
              .pipe(gulpif(!isSync, browserSync.stream()));
}

function svg() {
   return gulp.src('./src/svg/**/*')
               .pipe(gulpif(isProd, svgmin()))
               .pipe(svgSprite({
                  mode: {
                     symbol: {
                        sprite: "../../svg/sprite.svg",
                        render: {
                           scss: {
                              dest: '../../../src/sass/_sprite.scss',
                              template: "./src/sass/templates/_svg-template.scss"
                           }
                        }
                     }
                  }
               }))
               .pipe(cheerio({
                  run: function ($) {
                     $('[fill]').removeAttr('fill');
                     $('[stroke]').removeAttr('stroke');
                     $('[style]').removeAttr('style');
                     $('svg').attr('style', 'display:none');
                  },
                  parserOptions: { xmlMode: true }
                }))
               .pipe(replace('&gt;', '>'))
               .pipe(gulp.dest('build/svg'))
               .pipe(gulpif(!isSync, browserSync.stream()));
}

function video() {
   return gulp.src('./src/video/*')
              .pipe(gulp.dest('build/video'))
              .pipe(gulpif(!isSync, browserSync.stream()));
}

function fonts() {
   return gulp.src('src/fonts/**/*')
              .pipe(gulp.dest('build/fonts'))
              .pipe(gulpif(!isSync, browserSync.stream()));
}

function html() {
   return gulp.src('src/**/*.html')
              .pipe(gulp.dest('build'))
              .pipe(gulpif(!isSync, browserSync.stream()));
}

function scripts() {
   return gulp.src([
               // Polyfills
               'node_modules/@babel/polyfill/dist/polyfill.js',
               'node_modules/object-fit-images/dist/ofi.js',
               'node_modules/smoothscroll-polyfill/dist/smoothscroll.js',
               'node_modules/svg4everybody/dist/svg4everybody.js',

               // Scripts
               'src/js/jquery-3.2.1.slim.min.js',
               'src/js/jquery.magnific-popup.js',
               'src/js/slick.js',
               'src/js/main.js',
            ])
              .pipe(gulpif(isDev, sourcemaps.init()))
              .pipe(concat('main.min.js'))
              .pipe(babel({
                  presets: ['@babel/env']
               }))
              .pipe(gulpif(isProd, uglify({
                 toplevel: true
              })))
              .pipe(gulpif(isDev, sourcemaps.write()))
              .pipe(gulp.dest('build/js'))
              .pipe(gulpif(!isSync, browserSync.stream()));
}

function pug() {
   return gulp.src('src/**/*.pug')
      .pipe(gulppug({
         pretty: true
      }))
      .pipe(gulp.dest('build'))
      .pipe(gulpif(!isSync, browserSync.stream()));
}

function json() {
   return gulp.src('src/json/**/*.json')
      .pipe(gulp.dest('build/json'))
      .pipe(gulpif(!isSync, browserSync.stream()));
}

function watch() {
   if(!isSync) {
      browserSync.init({
         server: {
            baseDir: './build'
         }
      })
   }

   gulp.watch('src/sass/**/*.+(sass|scss)', styles);
   gulp.watch('src/img/**/*', img);
   gulp.watch('src/svg/**/*', svg);
   gulp.watch('src/video/**/*', video);
   gulp.watch('src/js/**/*.js', scripts);
   gulp.watch('src/json/**/*.json', json);
   gulp.watch('src/*.html', html);
   gulp.watch('src/**/*.pug', pug);
   gulp.watch('src/fonts/**/*', fonts);
}

function clean() {
   return del(['build/*'])
}

let build = gulp.series(
   clean, 
   gulp.parallel(styles, img, svg, video, scripts, json, pug, html, fonts)
)
   
gulp.task('del', clean);
gulp.task('build', build);
gulp.task('watch', gulp.series(build, watch));
gulp.task('svg', svg);