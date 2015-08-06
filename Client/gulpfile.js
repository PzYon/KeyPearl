(function (require) {
    "use strict";

    var gulp = require("gulp");
    var print = require("gulp-print");
    var concat = require("gulp-concat");
    var sass = require("gulp-sass");
    var watch = require("gulp-watch");
    var gulpif = require("gulp-if");
    var uglify = require("gulp-uglify");
    var sourcemaps = require("gulp-sourcemaps");
    var del = require("del");
    var runSequence = require("run-sequence");
    var args = require("yargs").argv;

    var isProduction = !!args.prod;

    var paths = {
        app: "./app/",
        appAllRecursive: "./app/**/*",
        target: "./bundled/"
    };

    var appDefinition = {
        srcs: [
            paths.app + "keyPearlApp.js",
            paths.app + "components/**/*.js",
            paths.app + "types/*.js"
        ],
        targetFile: "app.js"
    };

    var configDefinition = {
        srcs: [
            paths.app + "config.js"
        ],
        targetFile: "config.js"
    };

    var libDefinition = {
        srcs: [
            "./bower_components/angular/angular.js",
            "./bower_components/angular-route/angular-route.js"
        ],
        targetFile: "libs.js"
    };

    var concatAndCopyScripts = function (definition, targetFolder) {
        gulp.src(definition.srcs)
            .pipe(print())
            .pipe(sourcemaps.init())
            .pipe(gulpif(isProduction, uglify()))
            .pipe(concat(definition.targetFile))
            .pipe(sourcemaps.write("./"))
            .pipe(gulp.dest(targetFolder));
    };

    gulp.task("clean", function () {
        del.sync(paths.target);
    });

    gulp.task("scripts", function () {
        concatAndCopyScripts(configDefinition, paths.target);
        concatAndCopyScripts(appDefinition, paths.target);
        concatAndCopyScripts(libDefinition, paths.target);
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