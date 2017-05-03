/**
 * Created by zhaomenghuan on 2017/3/13.
 */
(function () {
    'use strict';

    angular.module('app').controller('loginController', ['$scope', '$state', 'loginService',function ($scope, $state, loginService) {
        // http://wiki.open.qq.com/wiki/website/get_user_info
        $scope.qqLogin = function () {
            loginService.qqLogin();
        };
        // https://developer.github.com/v3/oauth/
        $scope.githubLogin = function () {
            loginService.githubLogin();
        };

        $scope.fileNameChanged = function(files) {
            $scope.registerForm.file = files[0];
        };

        $scope.register = function () {
            console.log($scope.registerForm)
            // var user = new AV.User();
            // user.setUsername(username);
            // user.setPassword(password);
            // user.setEmail(email);
            // user.signUp().then(function (loginedUser) {
            //     console.log(JSON.stringify(error));
            // }, (function (error) {
            //     console.log(JSON.stringify(error));
            // }));
        }
    }]);
})();
