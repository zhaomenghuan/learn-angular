/**
 * 监测浏览器页面恢复可见状态，并发出事件通知
 */
(function() {
    'use strict';

    angular.module('app').run(notifyPageVisibled);

    notifyPageVisibled.$inject = ["$rootScope"];

    function notifyPageVisibled($rootScope) {
        listenVisible();

        function listenVisible() {
            // 各种浏览器兼容
            var hidden, state, visibilityChange;
            if (typeof document.hidden !== "undefined") {
                hidden = "hidden";
                visibilityChange = "visibilitychange";
                state = "visibilityState";
            } else if (typeof document.mozHidden !== "undefined") {
                hidden = "mozHidden";
                visibilityChange = "mozvisibilitychange";
                state = "mozVisibilityState";
            } else if (typeof document.msHidden !== "undefined") {
                hidden = "msHidden";
                visibilityChange = "msvisibilitychange";
                state = "msVisibilityState";
            } else if (typeof document.webkitHidden !== "undefined") {
                hidden = "webkitHidden";
                visibilityChange = "webkitvisibilitychange";
                state = "webkitVisibilityState";
            }

            // 当前浏览器页面，恢复可见状态时，发出事件通知；
            // 如在恢复可见状态时重新请求一次计时，解决非激活状态下计时器不准确的问题
            angular.element(document).bind(visibilityChange, function() {
                var visibilityState = document[state];
                if (visibilityState == 'visible') {
                    console.log('app run');
                }
            })
        }
    }
})();
