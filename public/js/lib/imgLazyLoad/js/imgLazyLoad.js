var throttle=function(e,t,n){function i(){function i(){r=Date.now(),t.apply(a,c)}function d(){o=void 0}var a=this,l=Date.now()-r,c=arguments;n&&!o&&i(),o&&clearTimeout(o),void 0===n&&l>e?i():o=setTimeout(n?d:i,void 0===n?e-l:e)}var o,r=0;return"function"!=typeof t&&(n=t,t=e,e=250),i._zid=t._zid=t._zid||$.proxy(t)._zid,i},debounce=function(e,t,n){return void 0===t?throttle(250,e,!1):throttle(e,t,void 0===n?!1:n!==!1)};$(window).on("scroll",debounce(80,function(){$(window).trigger("scrollStop")},!1));var pedding=[];$.fn.imglazyload=function(e){function t(t){var n=l?window:d.offset(),i=n[c.win[0]],o=n[c.win[1]];return i>=t[c.img[0]]-e.threshold-o&&i<=t[c.img[0]]+t[c.img[1]]}function n(t){var n=$(t),i={},o=n;f||($.each(n.get(0).attributes,function(){~this.name.indexOf("data-")&&(i[this.name]=this.value)}),o=$("<img />").attr(i)),n.trigger("startload"),o.on("load",function(){!f&&n.replaceWith(o),n.trigger("loadcomplete"),o.off("load")}).on("error",function(){var e=$.Event("error");n.trigger(e),e.defaultPrevented||pedding.push(t),o.off("error").remove()}).attr("src",n.attr(e.urlName))}function i(){var e,i,o,d;for(e=pedding.length;e--;)i=$(d=pedding[e]),o=i.offset(),t(o)&&(r.call(pedding,e,1),n(d))}function o(){!f&&u&&$(pedding).append(u)}var r=Array.prototype.splice,e=$.extend({threshold:0,container:window,urlName:"data-url",placeHolder:"",eventName:"scrollStop",innerScroll:!1,isVertical:!0},e),d=$(e.container),a=e.isVertical,l=$.isWindow(d.get(0)),c={win:[a?"scrollY":"scrollX",a?"innerHeight":"innerWidth"],img:[a?"top":"left",a?"height":"width"]},u=$(e.placeHolder).length?$(e.placeHolder):null,f=$(this).is("img");return!l&&(c.win=c.img),pedding=Array.prototype.slice.call($(pedding.reverse()).add(this),0).reverse(),$.isFunction($.fn.imglazyload.detect)?(o(),this):($(document).ready(function(){o(),i()}),!e.innerScroll&&$(window).on(e.eventName,function(){i()}),void($.fn.imglazyload.detect=i))};