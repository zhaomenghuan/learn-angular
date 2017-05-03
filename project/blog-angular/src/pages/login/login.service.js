(function () {
    "use strict";

    var app = angular.module("app").factory("loginService", loginService);

    loginService.$inject = ['$rootScope', '$http', '$q', 'httpService', '$stateParams', '$window'];

    function loginService($rootScope, $http, $q, httpService, $stateParams, $window) {
        return {
            qqLogin: function () {
                var url = 'https://graph.qq.com/oauth2.0/authorize?response_type=token&client_id=1105504716&redirect_uri=http%3A%2F%2Fzhaomenghuan.github.io%2F';
                $window.location.href = url;
            },
            githubLogin: function () {
                var url = 'https://github.com/login/oauth/authorize?client_id=825bf6cbedda6f09a9aa&redirect_uri=http%3A%2F%2Fzhaomenghuan.github.io%2F';
                $window.location.href = url;
            }
        }
    }
})();