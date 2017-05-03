/**
 * Created by zhaomenghuan on 2017/3/10.
 */

angular.module('app').config(['$stateProvider', 'RouteHelpersProvider', function($stateProvider, helper) {
    $stateProvider.state('index', {
        url: "/",
        title: '首页',
        controller: 'indexController',
        templateUrl: helper.basepath('/pages/index/index.html')
    })
}]);