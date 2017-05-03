/**
 * Created by zhaomenghuan on 2017/3/10.
 */

angular.module('app').config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('recommend', {
        url: "/recommend",
        controller: 'recommendController',
        templateUrl: 'pages/recommend/recommend.html'
    })
}]);