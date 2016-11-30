'use strict';

import del from 'del';
import gulp from 'gulp';
import sync from 'browser-sync';
import loader from 'gulp-load-plugins';

const $ = loader();

const production = process.argv.indexOf('--production') !== -1;

gulp.task('default', ['clean', 'sync'], () => gulp.start(
  'pages',
  'images',
  'scripts',
  'styles',
  'watch'
));

gulp.task('watch', () => {
  gulp.watch('src/**/*.html', ['pages']);
  gulp.watch('src/**/*.{jpg,png,webp}', ['images']);
  gulp.watch('src/assets/scripts/*.js', ['scripts']);
  gulp.watch('src/assets/styles/*.less', ['styles']);
});

gulp.task('sync', () => {
  sync.init({
    server: {
      baseDir: 'public/'
    }
  });

  gulp.watch('src/**/*.html', ['pages-watch']);
  gulp.watch('src/**/*.{jpg,png,webp}', ['images-watch']);
  gulp.watch('src/assets/scripts/*.js', ['scripts-watch']);
  gulp.watch('src/assets/styles/*.less', ['styles-watch']);
});

let reload = (done) => {
  sync.reload();
  done();
};

gulp.task('pages-watch', ['pages'], reload);
gulp.task('images-watch', ['images'], reload);
gulp.task('scripts-watch', ['scripts'], reload);
gulp.task('styles-watch', ['styles'], reload);

gulp.task('clean', () => del([
  'public'
]));

gulp.task('pages', () =>
  gulp.src('src/**/*.html')
    .pipe($.if(production, $.minifyInline({
      jsSelector: 'script[type!="application/ld+json"]'
    })))
    .pipe($.if(production, $.htmlmin({
      removeComments: true,
      collapseWhitespace: true
    })))
    .pipe(gulp.dest('public/'))
);

gulp.task('images', () =>
  gulp.src('src/**/*.{jpg,png,webp}')
    .pipe(gulp.dest('public/'))
);

gulp.task('scripts', () =>
  gulp.src('src/assets/scripts/*.js')
    .pipe($.sourcemaps.init())
      .pipe($.babel())
      .pipe($.if(production, $.uglify()))
      .pipe($.concat('all.js'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('public/assets/scripts/'))
);

gulp.task('styles', () =>
  gulp.src('src/assets/styles/*.less')
    .pipe($.less())
    .pipe($.autoprefixer())
    .pipe($.if(production, $.cssnano()))
    .pipe($.concat('all.css'))
    .pipe(gulp.dest('public/assets/styles/'))
);
