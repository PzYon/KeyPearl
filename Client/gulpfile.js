(function (require) {
    "use strict";

    var gulp = require("gulp");
    var concat = require("gulp-concat");
    var sass = require("gulp-sass");
    var watch = require("gulp-watch");
    var gulpif = require("gulp-if");
    var uglify = require("gulp-uglify");
    var sourcemaps = require("gulp-sourcemaps");
    var inline = require("gulp-inline");
    var replace = require("gulp-replace");
    var templateCache = require("gulp-angular-templatecache");
    var minifyHTML = require("gulp-minify-html");
    var del = require("del");
    var runSequence = require("run-sequence");
    var args = require("yargs").argv;

    var isPublish = false;

    var paths = {
        app: "./app/",
        appAllRecursive: "./app/**/*",
        target: "./bundled/",
        targetAllRecursive: "./bundled/**/*"
    };

    paths.indexHtml = paths.app + "index.html";
    paths.allHtmlButIndex = [paths.appAllRecursive + ".html", "!" + paths.indexHtml];

    var appDefinition = {
        srcs: [
            paths.app + "keyPearlApp.js",
            paths.app + "config.js",
            paths.app + "components/**/*.js",
            paths.app + "types/*.js"
        ],
        targetFile: "app.js"
    };

    var libDefinition = {
        srcs: [
            "./bower_components/angular/angular.js",
            "./bower_components/angular-route/angular-route.js",
            "./bower_components/angular-touch/angular-touch.js",
            "./bower_components/angular-animate/angular-animate.js"
        ],
        targetFile: "libs.js"
    };

    var concatAndCopyScripts = function (definition, targetFolder) {
        // todo: consider using/passing an object for replacements (i.e. {serverApiBaseUrl: "http://localhost:61345"}
        // otherwise use a default config object - for the moment it works the way it is, but there's room for
        // improvement here

        // todo: make sure source maps still work

        return gulp.src(definition.srcs)
            .pipe(sourcemaps.init())
            .pipe(replace("$build:serverApiBaseUrl$", args.serverApiBaseUrl || "http://localhost:61345/"))
            .pipe(gulpif(isPublish, uglify()))
            .pipe(concat(definition.targetFile))
            .pipe(sourcemaps.write("./"))
            .pipe(gulp.dest(targetFolder));
    };

    gulp.task("clean", function () {
        return del.sync(paths.targetAllRecursive);
    });

    gulp.task("scriptsApp", function () {
        return concatAndCopyScripts(appDefinition, paths.target);
    });

    gulp.task("scriptsLib", function () {
        return concatAndCopyScripts(libDefinition, paths.target);
    });

    gulp.task("scss", function () {
        return gulp.src(paths.appAllRecursive + ".scss")
            .pipe(sass({outputStyle: "compressed"}).on("error", sass.logError))
            .pipe(concat("styles.css"))
            .pipe(gulp.dest(paths.target));
    });

    gulp.task("index.html", function () {
        return gulp.src(paths.indexHtml)
            .pipe(gulpif(isPublish, minifyHTML({conditionals: true, spare: true})))
            .pipe(gulp.dest(paths.target));
    });

    gulp.task("templates", function () {
        return gulp.src(paths.allHtmlButIndex)
            .pipe(gulpif(isPublish, minifyHTML({conditionals: true, spare: true})))
            .pipe(templateCache({module: "keyPearl"}))
            .pipe(gulp.dest(paths.target));
    });

    gulp.task("inline", function () {
        return gulp.src(paths.target + "index.html")
            .pipe(inline({base: paths.target}))
            .pipe(gulp.dest(paths.target));
    });

    gulp.task("default", function (callback) {
        return runSequence("clean", ["scss", "scriptsLib", "scriptsApp", "index.html", "templates"], callback);
    });

    gulp.task("deleteInlined", function () {
        return del.sync([paths.target + "*.js", paths.target + "*.css"]);
    });

    gulp.task("publish", function (callback) {
        isPublish = true;
        return runSequence("default", "inline", "deleteInlined", callback);
    });

    gulp.task("watch", function () {
        gulp.watch(paths.allHtmlButIndex, ["templates"]);
        gulp.watch(paths.indexHtml, ["index.html"]);
        gulp.watch(paths.appAllRecursive + ".scss", ["scss"]);
        gulp.watch(paths.appAllRecursive + ".js", ["scripts"]);
    });

})(require);