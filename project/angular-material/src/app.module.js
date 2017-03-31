(function () {
    'use strict';

    var app = angular.module('app', [
        'ui.router',
        'ngMaterial'
    ]).config(['$urlRouterProvider', '$locationProvider', function($urlRouterProvider, $locationProvider) {
        // 设置路由模式
        $locationProvider.hashPrefix('!');
        // 设置默认路由
        $urlRouterProvider.otherwise('/');
        // 设置路由匹配规则
        $urlRouterProvider.rule(function ($injector, $location) {
            var path = $location.path(),
                normalized = path.toLowerCase();
            if (path !== normalized) {
                return normalized;
            }
        });
    }]).run(['$rootScope', '$state', function($rootScope, $state) {
        $rootScope.$on("$stateChangeError", console.log.bind(console));
    }]);
})();