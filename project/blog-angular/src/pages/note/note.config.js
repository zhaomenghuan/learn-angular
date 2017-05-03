/**
 * Created by zhaomenghuan on 2017/3/10.
 */

angular.module('app').config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('note', {
        url: "/note",
        controller: 'noteController',
        templateUrl: 'pages/note/note.html'
    })
}]);
