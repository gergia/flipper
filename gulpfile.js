/* jshint node: true */
"use strict";

var gulp = require("gulp");
var purescript = require("gulp-purescript");
var less = require("gulp-less");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var rimraf = require("rimraf");
var webserver = require('gulp-webserver');
var requirejsOptimize = require('gulp-requirejs-optimize');

var sources = [
    "src/**/*.purs",
    "bower_components/purescript-*/src/**/*.purs"
];

var foreigns = [
    "src/Foreign/*.js",
    "bower_components/purescript-*/src/**/*.js"
];

var sourcesCli = [
    "bower_components/purescript-*/src/**/*.purs",
    "src/Types.purs",
    "src/Helper.purs",
    "src/Unsafe.purs"
];


gulp.task("clean-dist", function(cb) {
    rimraf("dist", cb);
});

gulp.task("clean", ["clean-dist"]);

gulp.task("psc", function() {
    return purescript.psc({
            src: sources,
            ffi: foreigns,
            output: "output/main"
        });
});

gulp.task("bundle", ["psc"], function() {
    return purescript.pscBundle({
            src: "output/main/**/*.js",
            output: "dist/mainps.js",
            module: "Main",
            main: "Main"
        });
});

gulp.task("psci", function () {
    return purescript.psci({
            src: sourcesCli,
            ffi: foreigns
        })
        .pipe(gulp.dest("."));
});

gulp.task("less", function() {
    return gulp.src("css/*.less")
        .pipe(less({}))
        .pipe(gulp.dest("dist"));
});

gulp.task("concat", ["bundle"], function() {
    return gulp.src([
        "bower_components/isomer/dist/isomer.min.js",
        "dist/mainps.js",
	"js/Util.js",
	"js/Config.js",
	"js/Sempre.js",
	"js/GameLogic.js",
	"js/GameSetup.js"
        ])
        .pipe(concat("main.js"))
        .pipe(gulp.dest("dist"));
});


gulp.task("concatturk", ["bundle"], function() {
    return gulp.src([
        "bower_components/isomer/dist/isomer.min.js",
        "dist/mainps.js",
	"js/underscore.js",
	"js/Util.js",
	"js/TurkConfig.js",
	"js/Sempre.js",
	"js/GameLogic.js",
	"js/Turk.js",
	"js/GameSetup.js",
        ])
        .pipe(concat("main.js"))
        .pipe(gulp.dest("dist"));
});

gulp.task("compress", ["concat"], function() {
    return gulp.src("dist/main.js")
        .pipe(uglify().on('error', function(e){
            console.log(e);
         }))
        .pipe(gulp.dest("dist"));
});

gulp.task("webserver", function() {
    return gulp.src('./')
    .pipe(webserver({
     livereload: {
        enable: false,
        filter: function(fileName) {
          return false;
        }
     },
     port: 8000,

    }));
});

gulp.task("turk", ["less", "psci", "bundle", "concatturk", "compress"]);
gulp.task("default", ["less", "psci", "bundle", "concat"]);
gulp.task("serve", ["default", "webserver"]);
