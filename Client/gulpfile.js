(function (require) {
    "use strict";

    var gulp = require("gulp");
    var concat = require("gulp-concat");
    var sass = require("gulp-sass");
    var watch = require("gulp-watch");
    var del = require("del");

    var appFolder = "./app/";
    var appFolderAllRecursive = appFolder + "**/*";

    var targetFolder = "./bundled/";

    var appConfig = {
        srcs: [
            appFolder + "keyPearlApp.js",
            appFolder + "config.js",
            appFolder + "components/**/*.js",
            appFolder + "types/*.js"
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

    var concatAndCopy = function (config, targetFolder) {
        gulp.src(config.srcs)
            .pipe(concat(config.targetFile))
            .pipe(gulp.dest(targetFolder));
    };

    gulp.task("cleanTargetFolder", function () {
        del.sync(targetFolder);
    });

    gulp.task("concatJsFiles", function () {
        concatAndCopy(appConfig, targetFolder);
        concatAndCopy(libConfig, targetFolder);
    });

    gulp.task("compileSass", function () {
        gulp.src(appFolderAllRecursive + ".scss")
            .pipe(sass().on("error", sass.logError))
            .pipe(concat("styles.css"))
            .pipe(gulp.dest(targetFolder));
    });

    gulp.task("copyHtmlFiles", function () {
        gulp.src(appFolderAllRecursive + ".html").pipe(gulp.dest(targetFolder));
    });

    gulp.task("default", ["cleanTargetFolder", "compileSass", "copyHtmlFiles", "concatJsFiles"]);

    gulp.task("watch", function () {
        gulp.watch(appFolderAllRecursive + ".html", ["copyHtmlFiles"]);
        gulp.watch(appFolderAllRecursive + ".scss", ["compileSass"]);
        gulp.watch(appFolderAllRecursive + ".js", ["concatJsFiles"]);
    });

})(require);