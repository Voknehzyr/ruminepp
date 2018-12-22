const SRC = "./src/**/*.js";
const SRC_OTHER = "./src/html/*.html"
const BUILD = "./build/";

const VERSION = require("./package.json").version;

const gulp = require("gulp");
const zip = require("gulp-zip");
const concat = require("gulp-concat");

gulp.task("scripts", function() {
	return gulp.src(SRC)
		.pipe(concat("content.js"))
		.pipe(gulp.dest(BUILD)); 
});

gulp.task("html", function() {
	return gulp.src(SRC_OTHER).pipe(gulp.dest(BUILD + "html"));
});

gulp.task("zip", function() {
	return gulp.src([BUILD + "content.js", "icon.png", "inject.js", "manifest.json", BUILD + "html/*.html"], { base: "." })
		.pipe(zip("RuMinePP v" + VERSION + ".zip"))
		.pipe(gulp.dest("./"));
});

gulp.task("watch", function() {
	gulp.watch(SRC, ['scripts']);
	gulp.watch(SRC_OTHER, ['html']);
});

gulp.task("default", ["scripts", "html"]);
