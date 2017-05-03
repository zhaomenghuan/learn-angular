/**
 * Created by zhaomenghuan on 2017/3/10.
 */

angular.module('app').config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('login', {
        url: "/login",
        controller: 'loginController',
        templateUrl: 'pages/login/login.html'
    }).state('oauth.qq', {
        url: '/oauth/qq'
    }).state('oauth.github', {
        url: '/oauth/github'
    })
}]);
