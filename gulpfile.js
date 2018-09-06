var gulp        = require('gulp'),
	browserSync = require('browser-sync').create();

// local server 
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "./app"
        }
    });
});

// watch (отслеживаем изменения файлов)  
gulp.task('watch', ['server'], function() {    
    gulp.watch('app/js/**/*.js', browserSync.reload),
    gulp.watch('app/css/**/*.css', browserSync.reload), 
    gulp.watch('app/**/*.html', browserSync.reload);
});

// альтернатиный запуск по-умолчанию.
gulp.task('default', ['watch']);