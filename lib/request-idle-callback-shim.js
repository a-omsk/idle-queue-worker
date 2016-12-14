"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});


var requestIdleCallbackShim = function requestIdleCallbackShim(cb) {
    var start = Date.now();

    return setTimeout(function () {
        cb({
            didTimeout: false,
            timeRemaining: function timeRemaining() {
                return Math.max(0, 50 - (Date.now() - start));
            }
        });
    }, 1);
};

var cancelIdleCallbackShim = function cancelIdleCallbackShim(id) {
    return clearTimeout(id);
};

window.requestIdleCallback = window.requestIdleCallback || requestIdleCallbackShim;
window.cancelIdleCallback = window.cancelIdleCallback || cancelIdleCallbackShim;

var requestIdleCallback = exports.requestIdleCallback = window.requestIdleCallback;
var cancelIdleCallback = exports.cancelIdleCallback = window.cancelIdleCallback;