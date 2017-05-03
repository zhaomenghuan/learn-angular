(function () {
    'use strict';

    angular.module('app').constant('Modules_Config', [
        {
            name: 'prism',
            files: ['./components/prism/prism.js', './components/prism/prism.css']
        },{
            name: 'pagination',
            files: ['./components/pagination/pagination.js', './components/pagination/pagination.css']
        }
    ]);
})();
