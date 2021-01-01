const proc = require("../../config/constants");
const processors = require("../../config/postcss");
const extractmediaquery = require("postcss-extract-media-query");
const EXConfig = require("../../config/extractMediaQuery");
const ifmedia = require("../../config/media");
const postscss = require("postcss-scss");

module.exports = () => {
  $.gulp.task("build:css", () => {
    return (!$.gp.css || proc.css === "css") ? $.gulp.src([$.config.paths.styles.src, $.config.paths.styles.ignore])
      .pipe($.gulp.dest($.config.paths.styles.dist))
      .pipe($.browserSync.stream()) : $.gulp.src([$.config.paths.styles.src, $.config.paths.styles.ignore])
      .pipe($.plumberNotifier({
        errorHandler: function (error) {
          console.log(error.message);
          this.emit("end");
        }
      }))
      .pipe($.sourcemaps.init())
      .pipe($.postcss([ifmedia], { syntax: postscss }))
      .pipe($.cached(proc.css))
      .pipe($.dependents())
      .pipe($.gp.css({ importer: $.magicImporter() }))
      .pipe($.cssnano({
        autoprefixer: { browsers: ["last 15 versions", "> 1%", "ie 8", "ie 7"], add: true, cascade: false, grid: true },
        discardOverridden: { removeAll: false },
        // cssDeclarationSorter: { order: "smacss" },
        discardComments: false,
        cssDeclarationSorter: false,
        mergeIdents: true
      }))
      .pipe($.postcss(processors))
      .pipe($.csso({ restructure: true, sourceMap: true, debug: false }))
      .pipe($.gcmq())
      .pipe($.postcss([extractmediaquery(EXConfig)]))
      .pipe($.gulpif($.IS_PROD, $.rename({ suffix: ".min" })))
      .pipe($.gulpif($.IS_PROD, $.minifyCss({ compatibility: "ie8" })))
      .pipe($.gulpif($.IS_DEV, $.sourcemaps.write("./maps")))
      .pipe($.gulp.dest($.config.paths.styles.dist))
      .pipe($.browserSync.stream());
  });
};
