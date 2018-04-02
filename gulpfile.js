var gulp           = require('gulp'),
    browserSync    = require('browser-sync'),
    sass           = require('gulp-sass'),
    prefix         = require('gulp-autoprefixer'),
    image          = require('gulp-image');
    googleWebFonts = require('gulp-google-webfonts');
    concat         = require('gulp-concat');
    rename         = require('gulp-rename');
    uglify         = require('gulp-uglify');

    var paths = {
          'node': './node_modules',
          'assets': './assets',
          'sass': './assets/_scss',
          'html': './assets/html/**/**.*',
          'js': './assets/scripts',
          'img': './assets/images/**',
          'fonts': './assets/fonts',
          'forms': './assets/forms/**.*',
          'bourbon': './node_modules/bourbon/app/assets/stylesheets',
          'neat': './node_modules/bourbon-neat/core',
          'css': './css'
        }

    var dest = {
      'site': '_site',
      'js': '_site/js',
      'css': '_site/css',
      'img': '_site/images',
      'fonts': '_site/fonts',
      'forms': '_site/forms'
    }

// browserSync
gulp.task('browser-sync', ['sass'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

// compile SASS
gulp.task('sass', function () {
    return gulp.src(paths.sass + '/main.scss')
        .pipe(sass({
            includePaths: [
              'scss',
              paths.bourbon,
              paths.neat
            ],
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest(dest.css))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('css'));
});

// Scripts
gulp.task('scripts', function() {
  gulp.src([
    paths.js + '/jquery-3.2.1.min.js',
    paths.js + '/colo_calc/jquery-ui-1.12.1.custom/jquery-ui.min.js',
    paths.js + '/colo-calc.js',
    paths.js + '/jquery.flexnav.js',
    paths.js + '/acton-form.min.js',
    paths.js + '/slick.min.js',
    paths.js + '/lity.min.js',
    paths.js + '/app.js'
  ])
  .pipe(concat('app.js'))
  .pipe(rename('app.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest(dest.js));
});

// Watch
gulp.task('watch', function () {
    gulp.watch(paths.sass + '/*.scss', ['sass']);
    gulp.watch(paths.html, ['html']);
    gulp.watch(paths.js, ['scripts']);
});

// html move to build
gulp.task('html', function() {
  return gulp.src(paths.html)
    .pipe(gulp.dest(dest.site))
    .pipe(browserSync.reload({stream:true}));
});

// images
gulp.task('images', function() {
  return gulp.src([
    paths.img
  ])
  .pipe(image())
  .pipe(gulp.dest(dest.img));
});

// Fonts
var options = {
	cssDir: './css',
	cssFilename: '_myGoogleFonts.css'
};

gulp.task('fonts', function () {
    return gulp.src(paths.fonts + '/fonts.list')
        .pipe(googleWebFonts(options))
        .pipe(gulp.dest(dest.fonts));
});

// Deault task
gulp.task('default', ['browser-sync', 'watch', 'scripts', 'html', 'fonts']);
