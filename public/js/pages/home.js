define(function (require, exports, module) {
    //'图片懒加载'模块
    if($('#J_ImgLazyLoad').length){
        var ImgLazyLoad  = require('imgLazyLoad');

        $('.J_ImgLazyLoadItem').imglazyload();
    }
});