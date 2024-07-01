const gulp = require("gulp"),
  sass = require("gulp-sass"),
  browsersync = require("browser-sync").create(),
  prettify = require("gulp-prettify"),
  kit = require("gulp-kit");

function gulpSass() {
  return gulp.src("./scss/**/*.scss").pipe(sass()).pipe(gulp.dest("./css"));
}

function buildKit() {
  return gulp.src("./kit/*.kit").pipe(kit()).pipe(gulp.dest("./build"));
}

function serve(done) {
  browsersync.init(
    {
      server: {
        baseDir: "./"
      },
      notify: false
    },
    done
  );
}

function reload(done) {
  browsersync.reload();
  done();
}

function prettifyFunc() {
  return gulp
    .src("./build/**/*.html")
    .pipe(
      prettify({
        indent_size: 1
      })
    )
    .pipe(gulp.dest("./"));
}

const compile = gulp.series(
  gulp.parallel(gulp.series(prettifyFunc), gulpSass),
  serve
);

function watchFiles() {
  gulp.watch("./scss/**/*.scss", gulp.series(gulpSass, reload));
  gulp.watch("./kit/**/*.kit", gulp.series(buildKit, prettifyFunc, reload));
  gulp.watch("*.js", gulp.series(reload));
}

exports.watch = gulp.series(compile, watchFiles);
