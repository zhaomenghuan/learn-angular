(function () {
    'use strict';

    angular.module('app', [
        'ui.router',
        'ngMaterial',
        'oc.lazyLoad',
        'app.settings',
        'app.route'
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
    }]).run(['$rootScope', '$state', '$mdSidenav', '$location',function($rootScope, $state, $mdSidenav, $location) {
        $rootScope.currentNavItem = $location.path().split('/')[1] || 'index';
        $rootScope.toggleLeftSidenav = function() {
            $mdSidenav('left').toggle();
        };
    }]);
})();

(function () {
    AV.init({
        appId: 'KR4nmqFkqpVieP85GOcy8BSw-gzGzoHsz',
        appKey: 'dujWGlGy2nuUOTnOnhNjyjRi'
    });

    window.AVComment = AV.Object.extend('Comment');
})();