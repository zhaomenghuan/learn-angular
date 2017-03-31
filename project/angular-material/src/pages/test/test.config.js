/**
 * Created by zhaomenghuan on 2017/3/10.
 */

angular.module('app').config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('test', {
        url: "/test",
        controller: 'indexController',
        templateUrl: 'pages/test/test.html'
    })
}]);
