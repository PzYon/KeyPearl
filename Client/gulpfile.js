(function (require) {
    "use strict";

    var gulp = require("gulp");
    var print = require("gulp-print");
    var concat = require("gulp-concat");
    var sass = require("gulp-sass");
    var watch = require("gulp-watch");
    var gulpif = require("gulp-if");
    var uglify = require("gulp-uglify");
    var del = require("del");
    var sourcemaps = require('gulp-sourcemaps');
    var runSequence = require("run-sequence");
    var args = require("yargs").argv;

    var isProduction = !!args.prod;

    var paths = {
        app: "./app/",
        appAllRecursive: "./app/**/*",
        target: "./bundled/"
    };

    var appConfig = {
        srcs: [
            paths.app + "keyPearlApp.js",
            paths.app + "config.js",
            paths.app + "components/**/*.js",
            paths.app + "types/*.js"
        ],
        targetFile: "app.js"
    };

    var libConfig = {
        srcs: [
            "./bower_components/angular/angular.js",
            "./bower_components/angular-route/angular-route.js"
        ],
        targetFile: "libs.js"
    };

    var concatAndCopyAppScripts = function (config, targetFolder) {
        if (isProduction) {
            console.log("running for production, will uglify.");
        }

        gulp.src(config.srcs)
            .pipe(print())
            .pipe(gulpif(isProduction, uglify()))
            .pipe(concat(config.targetFile))
            .pipe(gulp.dest(targetFolder));
    };

    var concatAndCopyLibScripts = function (config, targetFolder) {
        if (isProduction) {
            console.log("running for production, will use minified libraries.");
        }

        if (isProduction) {
            for (var i = 0; i < config.srcs.length; i++) {
                var src = config.srcs[i];
                var index = src.lastIndexOf(".");
                if (index > -1) {
                    config.srcs[i] = src.substring(0, index) + ".min" + src.substring(index);
                }
            }
        }

        gulp.src(config.srcs)
            .pipe(gulpif(isProduction, sourcemaps.init()))
            .pipe(print())
            .pipe(gulpif(isProduction, sourcemaps.write()))
            .pipe(concat(config.targetFile))
            .pipe(gulp.dest(targetFolder));
    };

    gulp.task("clean", function () {
        del.sync(paths.target);
    });

    gulp.task("scripts", function () {
        concatAndCopyAppScripts(appConfig, paths.target);
        concatAndCopyLibScripts(libConfig, paths.target);
    });

    gulp.task("scss", function () {
        gulp.src(paths.appAllRecursive + ".scss")
            .pipe(sass().on("error", sass.logError))
            .pipe(concat("styles.css"))
            .pipe(gulp.dest(paths.target));
    });

    gulp.task("html", function () {
        gulp.src(paths.appAllRecursive + ".html")
            .pipe(print())
            .pipe(gulp.dest(paths.target));
    });

    gulp.task("default", function () {
        runSequence("clean", ["scss", "html", "scripts"]);
    });

    gulp.task("watch", function () {
        gulp.watch(paths.appAllRecursive + ".html", ["html"]);
        gulp.watch(paths.appAllRecursive + ".scss", ["scss"]);
        gulp.watch(paths.appAllRecursive + ".js", ["scripts"]);
    });

})(require);