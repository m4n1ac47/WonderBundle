let gulp              = require('gulp'),
    del               = require('del'),
    gutil             = require('gulp-util'),
    rename            = require('gulp-rename'),
    notify            = require("gulp-notify"),
    browserSync       = require('browser-sync'),
    sourcemaps        = require('gulp-sourcemaps'),
    postcss           = require('gulp-postcss'),
    cssimport         = require('postcss-import'),
    nested            = require('postcss-nested'),
    short             = require('postcss-short'),
    assets            = require('postcss-assets'), 
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
            loadPaths: ['app/assets/fonts/**/*', 'app/assets/img/', 'app/assets/img/**/*'],
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

function browser() {
    browserSync({
        server: {
            baseDir: 'app'
        },
        // proxy: 'gulp',
        notify: false,
        open: true,
        // online: false, // Work Offline Without Internet Connection
        // tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
    })
}

function styles() {
    return gulp.src('./app/assets/postcss/*.css')
        .pipe(gutil.env.type === 'production' ? gutil.noop() : sourcemaps.init())
        .pipe(postcss(plugins).on("error", notify.onError()))
        .pipe(rename('styles.min.css'))
        .pipe(gutil.env.type === 'production' ? gutil.noop() : sourcemaps.write('.'))
        .pipe(gulp.dest('./app/assets/css/'))
        .pipe(browserSync.stream())
};

function serve() {
    gulp.watch('app/assets/postcss/**/*.css', styles);
    gulp.watch('app/**/*.php', browserSync.reload);
    gulp.watch('app/*.html', browserSync.reload);
}

function clean(end) {
    del.sync('dist');
    end();
};

function build(end) {
    let css = gulp.src('app/assets/css/**/*.css')
    .pipe(gulp.dest('dist/assets/css'))
    end();
};

gulp.task('styles', styles);
gulp.task('browser', browser);
gulp.task('serve', serve);
gulp.task('watch', gulp.parallel('styles', 'browser', 'serve'));
gulp.task('clean', clean);
gulp.task('build', build);
gulp.task('default', gulp.series('watch')); // gulp --type production