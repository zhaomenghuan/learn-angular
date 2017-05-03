/**
 * Created by zhaomenghuan on 2017/3/10.
 */
(function() {
    'use strict';

    angular.module('app').config(routesConfig);

    routesConfig.$inject = ['$stateProvider', '$urlRouterProvider', 'RouteHelpersProvider'];

    function routesConfig($stateProvider, $urlRouterProvider, helper) {
        $urlRouterProvider.rule(function ($injector, $location) {
            if ($location.path() === '/blog') {
                return '/blog/list';
            }
        });

        $stateProvider.state('blog', {
            url: '/blog',
            templateUrl: helper.basepath('pages/blog/blog.html'),
            controller: 'blogController'
        }).state('blog.list', {
            url: '/list',
            title: '博文',
            templateUrl: helper.basepath('pages/blog/list/list.html')
        }).state('blog.detail', {
            url: '/:id',
            templateUrl: helper.basepath('pages/blog/detail/detail.html'),
            resolve: helper.resolveFor('prism'),
            controller: 'blogDetailController'
        });
    }
})();