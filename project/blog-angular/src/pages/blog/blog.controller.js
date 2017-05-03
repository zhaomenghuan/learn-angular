/**
 * Created by Administrator on 2017/2/27.
 */
(function () {
    'use strict';

    angular.module('app').controller('blogController', ['$rootScope', '$scope', '$state', '$stateParams', 'blogService', function ($rootScope, $scope, $state, $stateParams, blogService) {
        $scope.state = $state;

        blogService.queryBlogList().then(function (response) {
            $scope.blogs = response.data;
        });

        $scope.openBlogDetail = function (pageId, title) {
            $rootScope.app.title = title;
            $state.go('blog.detail', {id: pageId});
        }
    }]);
})();