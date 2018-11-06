//require('')对应 node_modules 文件夹下各工具的文件夹名
var gulp = require('gulp'); //--save-dev
var del = require('del'); //--save
var merge = merge = require('merge-stream');
var ngAnnotate = require('gulp-ng-annotate'); //--save-dev 后面皆是
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin'); // 图片的压缩
var  base64 = require('gulp-base64'); // 把小图片转成base64字符串
var cssmin = require('gulp-minify-css');
var Q = require('q');
var shell = require('gulp-shell');
var rmlog = require('gulp-removelogs');

var isRelease = false; //true=生产模式；false=开发模式
var paths = {
    src_path: 'src/**/*'
};
//清空www目录
var isFirstRun = {clean:true,copy:true,addWatch:true,shell:true,watch:true};
gulp.task('clear_www', function () {
   var deferred = Q.defer();
  if(isFirstRun.clean){
    console.log('delete www')
    isFirstRun.clean = false;
    del('www/**/*').then(function() {
      deferred.resolve();
   });
  } else {
    deferred.resolve();
  }
  // 做一些异步操作
 
  return deferred.promise;
});
//执行完 clear_www 才执行 copy_src
gulp.task('copy_src', ['clear_www'], function () {
  if(isFirstRun.copy){
    console.log('copy to www')
    isFirstRun.copy = false;
    return gulp.src(paths.src_path)//复制src到www
            .pipe(gulp.dest('www'));
  } else if(isFirstRun.watch){
    console.log('add watch');
    isFirstRun.watch = false;
    return gulp.watch(["src/**/*"]).on("change",function(event){
      console.log("watch running");
      var src_path = (event.path+'').replace(__dirname+"\\",'');
      var www_path = src_path.replace('src','www');
      del(www_path).then(function(){
        gulp.src(src_path,{base:'src'})//复制src到www
                .pipe(gulp.dest('www'));
      })
    });
  }else{
    console.log('nothing')
    return true;
  }
    
});
var minifyJs = function () {
    return gulp.src('www/pages/**/*.js')
        .pipe(rmlog())
        .pipe(ngAnnotate({
            single_quotes: true
        }))//ng-angularJS添加依赖注入
        
        .pipe(uglify())//压缩js
        .pipe(gulp.dest('www/pages'));
};
gulp.task('minify-js', ['copy_src'], function () {
    if (isRelease) {
        minifyJs();
    }
    return true;
});
var minifyCss = function () {
    return gulp.src('www/pages/**/*.css')
        .pipe(cleanCSS())//压缩css
        .pipe(gulp.dest('www/pages'));
};
gulp.task('minify-css', ['minify-js'], function () {
    if (isRelease) {
        minifyCss();
    }
    return true;
});
var minifyHtml = function (cb) {
    var ab= gulp.src(['www/pages/*.html', 'www/pages/**/*.html','www/index.html'],{'base':'www'})//多个文件以数组形式传入
        .pipe(htmlmin({
            collapseWhitespace: true
        }))//压缩html
        .pipe(gulp.dest('www'));
      return cb(ab);
};
gulp.task('minify-html', ['minify-css'], function () {
    if (isRelease) {
        minifyHtml(function(a){
          return a;
        });
    }else {
      return true;
  }
    
});
var shellFn = function(){
  if(isFirstRun.shell){
    isFirstRun.shell = false;
    return gulp.src('www', {read: false})
    .pipe(shell([
      'echo',
      'ionic serve'
    ]));
  } else {
    return true;
  }
  
};
gulp.task('shell',function(){
  shellFn();
  return true;
});
 
gulp.task('default', ['minify-html','shell']);
//自动监测文件变化执行watch任务
gulp.task('watch',function () {
 gulp.watch(paths.src_path, ['default']);
});

// var minifyCss = function () {   
//   return gulp.src('www/pages/**/*.css')       
//         .pipe(base64())
//         // .pipe(rev())  // 文件名加md5后缀
//         .pipe(cssmin())
//         // .pipe(rev.manifest())　 // rev-mainfest.json文件，里面是压缩文件的信息
//         .pipe(cleanCSS()) //压缩css
//         .pipe(gulp.dest('www/css'));

// }
// gulp.task('minify-css', ['minify-js'], function () {   
//   if (isRelease) {       
//     minifyCss();   
//   }   
//   return true;
// });
// var minifyHtml = function () {   
//   return gulp.src(['www/pages/*.html', 'www/pages/**/*.html']) //多个文件以数组形式传入
//            .pipe(htmlmin({
//       removeComments: true, //清除HTML注释
//       collapseWhitespace: true, //压缩HTML
//       minifyJS: true, //压缩页面JS
//       minifyCSS: true //压缩页面CSS
//     })) //压缩html
//     .pipe(gulp.dest('www/templates'));
// }
// gulp.task('minify-html', ['minify-css'], function () {   
//   if (isRelease) {       
//     minifyHtml();   
//   }   
//   return true;
// });
// var minImage = function () {
//   gulp.src('www/img/*.{png,jpg,gif,ico}')
//     .pipe(imagemin({
//       optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
//       progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
//       interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
//       multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
//     }))
//     .pipe(gulp.dest('www/img'));
// }
