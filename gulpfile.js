let gulp              = require('gulp'),
    notify            = require("gulp-notify"),
    postcss           = require('gulp-postcss'),
    cssimport         = require('postcss-import'),
    nested            = require('postcss-nested'),
    short             = require('postcss-short'),
    assets            = require('postcss-assets'),
    rename            = require('gulp-rename'),
    cssnano           = require('cssnano'),
    autoprefixer      = require('autoprefixer'),
    postcssPresetEnv  = require('postcss-preset-env'),
    postcssMixins     = require('postcss-mixins'),
    mqpacker          = require('css-mqpacker'),
    sortCSSmq         = require('sort-css-media-queries'),
    postcssStripUnits = require('postcss-strip-units'),
    postcssSimpleVars = require('postcss-simple-vars');    

let plugins = [
        cssimport,
        postcssPresetEnv({
            stage: 3,
            preserve: false
        }),
        postcssSimpleVars({silent: true}),
        postcssMixins,
        nested,
        assets({
            loadPaths: ['app/assets/**/*'],
            relativeTo: 'app/assets/css/'
        }),
        short,
        postcssStripUnits,
        mqpacker({
            sort: sortCSSmq
        }),
        autoprefixer({browsers: ['last 2 version']}),
        cssnano()
    ];

gulp.task('css', function () {
    return gulp.src('./app/assets/postcss/*.css')
        .pipe(postcss(plugins).on("error", notify.onError()))
        .pipe(rename('styles.min.css'))
        .pipe(gulp.dest('./app/assets/css/'));
});


gulp.task('watch', ['css'], function() {
    gulp.watch('app/assets/postcss/**/*.css', ['css']);
});