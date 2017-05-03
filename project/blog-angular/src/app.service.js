/**
 * Created by zhaomenghuan on 2017/3/26.
 */

(function () {
    "use strict";

    angular.module("app").factory("appService", appService);
    appService.$inject = ['$rootScope', '$timeout', '$mdSidenav', '$log'];

    function appService($rootScope, $timeout, $mdSidenav, $log) {
        function debounce (func, wait, context) {
            var timer;

            return function debounced() {
                var context = $scope,
                    args = Array.prototype.slice.call(arguments);
                $timeout.cancel(timer);
                timer = $timeout(function() {
                    timer = undefined;
                    func.apply(context, args);
                }, wait || 10);
            };
        }

        return {
            buildDelayedToggler: function (navID) {
                return debounce(function() {
                    $mdSidenav(navID)
                        .toggle()
                        .then(function () {
                            $log.debug("toggle " + navID + " is done");
                        });
                }, 200);
            }
        }
    }
})();