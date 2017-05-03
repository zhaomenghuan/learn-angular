/**
 * Created by zhaomenghuan on 2017/4/14.
 */

(function () {
    "use strict";

    angular.module('app').directive('pageContent', pageContent);
    pageContent.$inject = ['$http', '$stateParams'];

    var baseURL = 'resource/blog/html/';

    function pageContent($http, $stateParams) {
        return {
            restrict: 'E',
            templateUrl: function (elem, attrs) {
                return baseURL+$stateParams.id+'.html'
            },
            controller: function () {
                Prism.highlightAll();
            }
        }
    }
})();
