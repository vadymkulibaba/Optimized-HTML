var gulp 			  = require('gulp'),
    sass 			  = require('gulp-sass'),       
    uglify            = require('gulp-uglify'),      
    concat            = require('gulp-concat'),       
    browserSync 	  = require('browser-sync'),     
    imagemin          = require('gulp-imagemin'),
    cache             = require('gulp-cache'),
    autoprefixer      = require('gulp-autoprefixer'),
    del               = require('del'),
    rename            = require('gulp-rename'),
    cssnano           = require('gulp-cssnano');



gulp.task('sass', function () {
	  return gulp.src('app/sass/**/*.sass')
		  .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer(['last 15 versions']))
    	.pipe(gulp.dest('app/css/'));  
});


gulp.task('cssnano', ['sass'], function() {
    return gulp.src([
      'app/css/main.css'
      ])
        .pipe(cssnano())
        .pipe(rename(function (path) {
            path.basename += ".min"
  }))
        .pipe(gulp.dest('app/css/'))
        .pipe(browserSync.reload({stream: true}));  
});

gulp.task('common-js', function () {
    return gulp.src('app/js/common.js')
      .pipe(concat('common.min.js'))
      .pipe(uglify())      
      .pipe(gulp.dest('app/js/'))
      .pipe(browserSync.reload({stream: true})); 
});

gulp.task('js', ['common-js'], function() {
  return gulp.src([
    'app/libs/jquery-3.2.1.min.js', // Перша
    'app/libs/bootstrap.min.js',
    'app/js/common.min.js' // Остання
    ])
  .pipe(concat('scripts.min.js'))
  .pipe(uglify()) 
  .pipe(gulp.dest('app/js'))
  .pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "app"
        },
        notify: false                                   // Відключає повідомлення
    });
});

gulp.task('watch', ['cssnano', 'common-js', 'browser-sync'], function() {
  gulp.watch('app/sass/**/*.sass', ['cssnano']);   
  gulp.watch('app/js/**/*.js', ['js']);
  gulp.watch("app/*.html").on('change', browserSync.reload);
});

gulp.task('imagemin', function() {
  return gulp.src('app/img/**/*')
  .pipe(cache(imagemin()))
  .pipe(gulp.dest('dist/img')); 
});

gulp.task('build', ['removedist', 'imagemin', 'cssnano', 'js'], function() {

  var buildFiles = gulp.src([
    'app/*.html',
    'app/.htaccess',
    ]).pipe(gulp.dest('dist'));

  var buildCss = gulp.src([
    'app/css/main.all.min.css',
    ]).pipe(gulp.dest('dist/css'));

  var buildJs = gulp.src([
    'app/js/scripts.min.js',
    ]).pipe(gulp.dest('dist/js'));

  var buildFonts = gulp.src([
    'app/fonts/**/*',
    ]).pipe(gulp.dest('dist/fonts'));

});


gulp.task('removedist', function() { return del.sync('dist'); });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['watch']);