/**
 * 图片懒加载组件模块
 * @author zym
 * @version 1.0
 * @since 2016-03-10
 */
var throttle = function(delay, fn, debounce_mode) {
    var last = 0,
        timeId;

    if (typeof fn !== 'function') {
        debounce_mode = fn;
        fn = delay;
        delay = 250;
    }

    function wrapper() {
        var that = this,
            period = Date.now() - last,
            args = arguments;

        function exec() {
            last = Date.now();
            fn.apply(that, args);
        };

        function clear() {
            timeId = undefined;
        };

        if (debounce_mode && !timeId) {
            exec();
        }

        timeId && clearTimeout(timeId);
        if (debounce_mode === undefined && period > delay) {
            exec();
        } else {
            timeId = setTimeout(debounce_mode ? clear : exec, debounce_mode === undefined ? delay - period : delay);
        }
    };

    wrapper._zid = fn._zid = fn._zid || $.proxy(fn)._zid;
    return wrapper;
};

var debounce = function(delay, fn, t) {
    return fn === undefined ? throttle(250, delay, false) : throttle(delay, fn, t === undefined ? false : t !== false);
};

$(window).on('scroll', debounce(80, function () {
    $(window).trigger('scrollStop');
}, false));

var pedding = [];

$.fn.imglazyload = function (opts) {
    var splice = Array.prototype.splice,
        opts = $.extend({
            threshold:0,
            container:window,
            urlName:'data-url',
            placeHolder:'',
            eventName:'scrollStop',
            innerScroll: false,
            isVertical: true
        }, opts),
        $viewPort = $(opts.container),
        isVertical = opts.isVertical,
        isWindow = $.isWindow($viewPort.get(0)),
        OFFSET = {
            win: [isVertical ? 'scrollY' : 'scrollX', isVertical ? 'innerHeight' : 'innerWidth'],
            img: [isVertical ? 'top' : 'left', isVertical ? 'height' : 'width']
        },
        $plsHolder = $(opts.placeHolder).length ? $(opts.placeHolder) : null,
        isImg = $(this).is('img');

    !isWindow && (OFFSET['win'] = OFFSET['img']);

    function isInViewport(offset) {
        var viewOffset = isWindow ? window : $viewPort.offset(),
            viewTop = viewOffset[OFFSET.win[0]],
            viewHeight = viewOffset[OFFSET.win[1]];
        return viewTop >= offset[OFFSET.img[0]] - opts.threshold - viewHeight && viewTop <= offset[OFFSET.img[0]] + offset[OFFSET.img[1]];
    }

    pedding = Array.prototype.slice.call($(pedding.reverse()).add(this), 0).reverse();
    if ($.isFunction($.fn.imglazyload.detect)) {
        _addPlsHolder();
        return this;
    };

    function _load(div) {
        var $div = $(div),
            attrObj = {},
            $img = $div;

        if (!isImg) {
            $.each($div.get(0).attributes, function () {
                ~this.name.indexOf('data-') && (attrObj[this.name] = this.value);
            });
            $img = $('<img />').attr(attrObj);
        }
        $div.trigger('startload');
        $img.on('load',function () {
            !isImg && $div.replaceWith($img);
            $div.trigger('loadcomplete');
            $img.off('load');
        }).on('error',function () {
            var errorEvent = $.Event('error');
            $div.trigger(errorEvent);
            errorEvent.defaultPrevented || pedding.push(div);
            $img.off('error').remove();
        }).attr('src', $div.attr(opts.urlName));
    }

    function _detect() {
        var i, $image, offset, div;
        for (i = pedding.length; i--;) {
            $image = $(div = pedding[i]);
            offset = $image.offset();
            isInViewport(offset) && (splice.call(pedding, i, 1), _load(div));
        }
    }

    function _addPlsHolder () {
        !isImg && $plsHolder && $(pedding).append($plsHolder);
    }

    $(document).ready(function () {
        _addPlsHolder();
        _detect();
    });

    !opts.innerScroll && $(window).on(opts.eventName, function(){
        _detect();
    });

    $.fn.imglazyload.detect = _detect;
};