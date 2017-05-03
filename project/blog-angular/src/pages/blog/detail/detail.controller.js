/**
 * Created by Administrator on 2017/4/14.
 */

(function () {
    'use strict';

    angular.module('app').controller('blogDetailController', blogDetailController);

    blogDetailController.$inject = ['$rootScope', '$scope', '$http', '$state', '$stateParams', 'blogService', '$mdDialog'];

    function blogDetailController($rootScope, $scope, $http, $state, $stateParams, blogService, $mdDialog) {
        var pageId = angular.copy($stateParams.id);
        $scope.user = {};

        // 查询评论
        blogService.queryCommentList(pageId).then(function (data) {
            var comments = [];
            angular.forEach(data, function (item) {
                item.set('time', item.time || item.createdAt.valueOf());
                comments.push(item.attributes);
            });
            $scope.comments = comments;
        });

        $scope.submitComment = function () {
            if($scope.commentForm.$valid) {
                // 添加评论
                blogService.addComment(angular.copy($scope.user)).then(function (data) {
                    console.log(data);
                });
            }
        }
    }
})();