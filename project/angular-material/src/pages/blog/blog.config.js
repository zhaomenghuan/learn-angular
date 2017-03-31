/**
 * Created by zhaomenghuan on 2017/3/10.
 */

angular.module('app').config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('blog', {
        url: "/blog",
        controller: 'blogController',
        templateUrl: 'pages/blog/blog.html'
    });
}]);