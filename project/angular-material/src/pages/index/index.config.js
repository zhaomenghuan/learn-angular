/**
 * Created by zhaomenghuan on 2017/3/10.
 */

angular.module('app').config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('index', {
        url: "/",
        controller: 'indexController',
        templateUrl: 'pages/index/index.html'
    })
}]);