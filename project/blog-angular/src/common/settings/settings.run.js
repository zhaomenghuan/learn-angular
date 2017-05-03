(function() {
    'use strict';

    angular.module('app.settings').run(settingsRun);

    settingsRun.$inject = ['$rootScope'];

    function settingsRun($rootScope) {
        $rootScope.app = {
            name: '小青年博客',
            slogan: '看似寻常最奇崛，成如容易却艰辛。',
            remoteApi: '',
            title: ''
        };
    }
})();
