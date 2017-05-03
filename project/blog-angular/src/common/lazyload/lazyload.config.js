(function () {
    'use strict';

    angular.module('app').config(lazyloadConfig);

    lazyloadConfig.$inject = ['$ocLazyLoadProvider', 'Modules_Config'];

    function lazyloadConfig($ocLazyLoadProvider, Modules_Config) {
        $ocLazyLoadProvider.config({
            debug: false,
            events: true,
            modules: Modules_Config
        });
    }
})();