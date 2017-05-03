/**
 * Created by zhaomenghuan on 2017/3/30.
 */

/**
 * Created by zhaomenghuan on 2017/3/26.
 */

(function () {
    "use strict";

    var app = angular.module("app").factory("blogService", blogService);

    blogService.$inject = ['$rootScope', '$http', '$q', 'httpService', '$stateParams'];

    function blogService($rootScope, $http, $q, httpService, $stateParams) {
        return {
            queryBlogList: function () {
                var deferred = $q.defer();
                var url = '/api/blog.json';
                httpService.httpServer(url, {}, "GET").then(function (data) {
                    deferred.resolve(data);
                });
                return deferred.promise;
            },
            queryCommentList: function (pageId) {
                var deferred = $q.defer();
                var query = new AV.Query('Comment');
                query.equalTo('pageId', pageId);
                query.find().then(function (results) {
                    deferred.resolve(results);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            addComment: function (params) {
                var deferred = $q.defer();
                var avComment = new AVComment();
                avComment.set('pageId', $stateParams.id);
                params.forEach(function (item) {

                });

                // avComment.set('msg', params.message);
                avComment.save().then(function (result) {
                    deferred.resolve(result);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            }
        }
    }
})();