/**
 * 统一http请求服务
 */
(function () {
    "use strict";
    /**
     * getDownloadUrl           下载服务,获取下载地址。带token
     * httpServer               HTTP请求服务
     * httpServerFormData       FORM表单形式的http请求
     */
    angular.module('app').service('httpService', httpService);

    httpService.$inject = ['$http', '$q', '$state', '$window', "$rootScope"];

    function httpService($http, $q, $state, $window, $rootScope) {
        return {
            httpServer: function (url, params, type) {
                var deferred = $q.defer();
                handlePost(url, params, type, false, false).then(function (data) {
                    deferred.resolve(data);
                }, function (data) {
                    deferred.reject(data);
                });
                return deferred.promise;
            },
            httpServerFormData: function (url, params, type) {
                var deferred = $q.defer();
                handlePost(url, params, type, true, false).then(function (data) {
                    deferred.resolve(data);
                }, function (data) {
                    deferred.reject(data);
                });
                return deferred.promise;
            },
            httpServerNoContentType: function (url, params, type) {
                var deferred = $q.defer();
                handlePost(url, params, type, false, true).then(function (data) {
                    deferred.resolve(data);
                }, function (data) {
                    deferred.reject(data);
                });
                return deferred.promise;
            }
        };

        /**
         *
         * @param url
         * @param params
         * @param type
         * @param isFormData 是否已form表单形式提交
         * @param isEmptyContentType  是否需要将conent-type设置为空
         * @returns {Function}
         */
        function handlePost(url, params, type, isFormData, isEmptyContentType) {
            type = angular.uppercase(type);
            var deferred = $q.defer();

            if (angular.isUndefined(type)) {
                deferred.reject("所需参数type没有传入！");
                return deferred.promise;
            }
            if (type != 'POST' && type != 'GET' && type != 'DELETE' && type != 'PUT') {
                deferred.reject("参数【" + type + "】错误！");
                return deferred.promise;
            }

            var httpParams = {
                method: type,
                url: url,
                data: (type == 'POST' || 'PUT') ? params : "",
                params: type == 'GET' ? params : ""
            };

            var formDataParams = {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    var str = [];
                    for (var key in obj) {
                        str.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
                    }
                    return str.join("&");
                }
            };

            if (isFormData) {
                angular.extend(httpParams, formDataParams);
            }
            if (isEmptyContentType) {
                httpParams.headers = {
                    "Content-Type": undefined
                }
            }

            $http(httpParams).then(function (data, status, headers, config) {
                try {
                    if (angular.isString(data)) {
                        data = JSON.parse(data);
                    }
                } catch (error) {
                    deferred.reject("json转换错误！");
                }
                deferred.resolve(data);
            }).catch(function errorCallback(data, status, headers, config) {
                deferred.reject(data);
            });

            return deferred.promise;
        }
    }
})();