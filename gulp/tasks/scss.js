import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';

import cleanCss from 'gulp-clean-css';// Сжатие CSS файлов
import webpcss from 'gulp-webpcss'; //Вывод WEBP изображений
import autoprefixer from 'gulp-autoprefixer';// Добавление вендроных префиксов
import groupCssMediaQueries from 'gulp-group-css-media-queries';//Групировка медиа запросов

const sass = gulpSass(dartSass);

export const scss = () => {
    return app.gulp.src(app.path.src.scss, { sourcemaps: app.isDev /*было true */}) 
    .pipe(app.plugins.plumber(
        app.plugins.notify.onError({
            title: "SCSS",
            message: "Error: <%= error.message %>"
        })))
        .pipe(app.plugins.replace(/@img\//g, '../img/'))
    .pipe(sass({
        outputStyle: 'expanded'
    }))
 .pipe(
    app.plugins.if(
        app.isBuild,
        groupCssMediaQueries()
    )
 )
 .pipe(
    app.plugins.if(
        app.isBuild,
        autoprefixer({
        grid: true,
        overrideBrowserslist: ["last 3 versions"],
        cascade:true
        })
    )
 )
 .pipe(
    app.plugins.if(
        app.isBuild,
        webpcss(
            {
                webpClass: ".webp",
                noWebpClass: ".no-webp"  
            }
        )
    )
 )
    /* Код без разделения на версии без if  .pipe(groupCssMediaQueries())
    .pipe(webpcss(
        {
            webpClass: ".webp",
            noWebpClass: ".no-webp"
        }
    ))
    .pipe(autoprefixer({
        grid: true,
        overrideBrowserslist: ["last 3 versions"],
        cascade:true
    })) */
//Раскомментировать если нужен не сжатый дубль файла стилей
//.pipe(app.gulp.dest(app.path.build.css))
    .pipe(app.gulp.dest(app.path.build.css))
    .pipe(
        app.plugins.if(
            app.isBuild,
            cleanCss()
        )
    )
    .pipe(rename({
        extname: ".min.css"
    }))
    .pipe(app.gulp.dest(app.path.build.css))
    .pipe(app.plugins.browsersync.stream());
}