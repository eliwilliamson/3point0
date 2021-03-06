'use strict';

var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    browserSync = require('browser-sync'),
    runSequence = require('run-sequence'),
    less = require('gulp-less'),
    del = require('del');

var production = false,
    paths = {
      app:     'app',
      html:    'app/**/*.{html,md}',
      styles:  'app/styles/**/*.{scss,less,css,sass}',
      scripts: 'app/scripts/**/*.js',
      images:  'app/images/**/*.{png,gif,jpg,jpeg,svg}',
      fonts:   'app/fonts/**/*.{eot*,otf,svg,ttf,woff,woff2,css}',
      vendor:  'vendor',
      cname:   'app/CNAME'
    };

gulp.task('html', function (cb) {
  var config = (production) ? '_config.yml,_config.build.yml' : '_config.yml',
      dest   = (production) ? 'dist' : '.tmp';

  var spawn  = require('child_process').spawn,
      jekyll = spawn('jekyll', ['build', '-q', '--config', config, '-s', paths.app, '-d', dest], { stdio: 'inherit' });

  jekyll.on('exit', function (code) {
    cb(code === 0 ? null : 'ERROR: Jekyll process exited with code: ' + code);
    browserSync.reload();
  });
});

gulp.task('styles', function () {
  return gulp.src(paths.styles)
    .pipe($.sass({
      style: 'nested',
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe(less())
    .pipe($.autoprefixer('last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('scripts', function () {
  return gulp.src(paths.scripts)
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('images', function () {
  return gulp.src(paths.images)
    .pipe($.imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: []
    }))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function () {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('clean', function (cb) {
  del(['.tmp', 'dist'], cb);
});

gulp.task('optimize', ['html', 'styles', 'scripts', 'images', 'fonts'], function () {
  var assets = $.useref.assets({ searchPath: ['.tmp', 'dist', '.'] });

  return gulp.src('dist/**/*.html')
    .pipe(assets)
    .pipe($.if('*.css', $.minifyCss()))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.rev())
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest('dist'));
});

// Update absolute asset paths for production
gulp.task('replace', ['optimize', 'cname'], function () {
  var prodURL = '$1http://justdusk.com';

  return gulp.src('dist/**/*.{html,css}')
    .pipe($.replace(/("|'?)\/?styles\//g,  prodURL + '/styles/'))
    .pipe($.replace(/("|'?)\/?scripts\//g, prodURL + '/scripts/'))
    .pipe($.replace(/("|'?)\/?images\//g, prodURL + '/images/'))
    .pipe($.replace(/("|'?)\/?fonts\//g, prodURL + '/fonts/'))
    .pipe($.replace(/(<a[^>]*href=")(\/)/g, prodURL + '/'))
    .pipe(gulp.dest('dist'));
});

gulp.task('cname', function () {
  return gulp.src(paths.cname)
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['replace'], function () {
  return gulp.src('dist/**/*')
    .pipe($.size({
      title: 'build',
      gzip: true
    }));
});

gulp.task('production-prep', function () {
  return gulp.src('dist/**/*')
    .pipe($.ghPages())
});

gulp.task('watch', function () {
  gulp.watch(paths.html,    ['html']);
  gulp.watch(paths.styles,  ['styles']);
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.images,  ['images']);
  gulp.watch(paths.fonts,   ['fonts']);
});

gulp.task('browser-sync', ['html', 'styles', 'scripts'], function () {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', paths.app],
      routes: {
        '/vendor': 'vendor'
      }
    }
  });
});

gulp.task('serve', function () {
  runSequence('clean', ['browser-sync', 'watch']);
});

gulp.task('deploy', function () {
  production = true;
  runSequence('clean', 'build', 'production-prep');
});

gulp.task('default', function () {
  production = true;
  runSequence('clean', 'build');
});
