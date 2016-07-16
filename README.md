# About gulp-sass-globi

This started off as a fork of [gulp-sass-glob](https://www.npmjs.com/package/gulp-sass-glob).
As some long-standing bugs and feature requests haven't been addressed, I decided to fork the repository and try to develop the plugin further.

# Overview

[Gulp](http://gulpjs.com/) plugin for [gulp-sass](https://github.com/dlmanning/gulp-sass) to use glob imports.

# Install

```
npm install gulp-sass-glob --save-dev
```

# Basic Usage

main.scss

```scss
@import "vars/**/*.scss";
@import "mixins/**/*.scss";
@import "generic/**/*.scss";
@import "../components/**/*.scss";
@import "../views/**/*.scss";
@import "../views/**/*something.scss";
@import "../views/**/all.scss";
```

*NOTE*: Also support using `'` (single quotes) for example: `@import 'vars/**/*.scss';`

gulpfile.js

```javascript
var gulp = require('gulp');
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');

gulp.task('styles', function () {
    return gulp
        .src('src/styles/main.scss')
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(gulp.dest('dist/styles'));
});
```

# Troubleshooting

# Planned features

- Add support for nested globbing
- Add support for [includePaths](https://github.com/sass/node-sass#includepaths)

# Why _globi_?

![alt tag](https://raw.githubusercontent.com/Nirazul/gulp-sass-globi/master/globi.png)

Globi is a [Swiss cartoon character](https://en.wikipedia.org/wiki/Globi) chosen for this project because of his name's remarkable resemblance to the term _glob_. 
...And because almost all sensible name choices for such a plugin are gone. 
