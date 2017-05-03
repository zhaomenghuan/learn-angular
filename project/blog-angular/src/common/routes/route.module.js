/**
 * Created by Administrator on 2017/4/15.
 */

angular.module('app.route', []).run(['$location', '$rootScope', function ($location, $rootScope) {
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (toState.title) {
            $rootScope.app.title = toState.title;
        }
    });
}]);