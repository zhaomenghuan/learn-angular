window.APP = angular.module('myApp', []);

APP.directive('pagination', function() {
    return {
        restrict: 'E',

        transclude: true,

        template: [
            '<div class="ng-pagination">',
            '    <nav ng-show="pageNums.length > 1">',
            '        <ul class="pagination">',
            '            <li ng-click="goToPage(1)">',
            '                <a href="javascript:;" aria-label="Previous">',
            '                    {{ pgHomeText }}',
            '                </a>',
            '            </li>',
            '            <li ng-click="goToPage(pgCurrent - 1)">',
            '                <a href="javascript:;" aria-label="Previous">',
            '                    <span aria-hidden="true">&laquo;</span>',
            '                </a>',
            '            </li>',
            '            <li ng-repeat="num in pageNums" ng-class="{\'active\': pgCurrent == num}" ng-click="goToPage(num)">',
            '                <a href="javascript:;">{{ num }}</a>',
            '            </li>',
            '            <li ng-click="goToPage(pgCurrent + 1)">',
            '                <a href="javascript:;" aria-label="Next">',
            '                    <span aria-hidden="true">&raquo;</span>',
            '                </a>',
            '            </li>',
            '            <li ng-click="goToPage(pgCnt)">',
            '                <a href="javascript:;" aria-label="Previous">',
            '                    {{ pgEndText }}',
            '                </a>',
            '            </li>',
            '        </ul>',
            '       <form class="form form-inline">',
            '           <input type="text" class="text-center form-control pag-input" ng-model="jumpToPage"><label>&nbsp;&nbsp;/{{ pgCnt }}</label>',
            '           <button class="btn btn-primary" ng-click="goToPage(jumpToPage)" ng-disabled="!jumpToPage || jumpToPage <= 0 || jumpToPage > pgCnt">Go</button>',
            '       </form>',
            '    </nav>',
            '<div>',
        ].join(''),

        scope: {
            pgItemCnt: '<',      // item count
            pgCurrent: '=',     // current page
            pgItemCntEachPage: '<?', // item count each page
            pgMaxBtnCnt: '<?', // max display button count
            pgOnChange: '&?',
            pgHomeText: '@?',
            pgEndText: '@?',
        },
        
        link: function(scope, element, attrs) {
            /* init */
            (function() {
                scope.pgItemCnt         = angular.isDefined(scope.pgItemCnt)         ? parseInt(scope.pgItemCnt)         : 0;
                scope.pgItemCntEachPage = angular.isDefined(scope.pgItemCntEachPage) ? parseInt(scope.pgItemCntEachPage) : 10;
                scope.pgCurrent         = angular.isDefined(scope.pgCurrent)         ? parseInt(scope.pgCurrent)         : 1;
                scope.pgMaxBtnCnt       = angular.isDefined(scope.pgMaxBtnCnt)       ? parseInt(scope.pgMaxBtnCnt)       : 7;
                scope.pgOnChange        = angular.isDefined(scope.pgOnChange)        ? scope.pgOnChange                  : function() {};
                scope.pgHomeText        = angular.isDefined(scope.pgHomeText)        ? scope.pgHomeText                  : 'home';
                scope.pgEndText         = angular.isDefined(scope.pgEndText)         ? scope.pgEndText                   : 'End';
                
                /* other */
                scope.pageNums = [];
            })();

            scope.$watch('pgItemCnt', function(newVal) {
                scope.pgCnt = Math.ceil(scope.pgItemCnt / scope.pgItemCntEachPage);
                scope._refresh();
            });

            scope.$watch('pgCurrent', function(newVal) {
                scope.pgOnChange();
            });

            scope.$watch('pgItemCntEachPage', function(newVal) {
                var cnt = parseInt(newVal);
                if(isNaN(newVal) || newVal == 0) {
                    return;
                }
                scope.pgCnt = Math.ceil(scope.pgItemCnt / scope.pgItemCntEachPage);
                scope.btnCenterIndex = Math.ceil(scope.pgMaxBtnCnt / 2);
                scope._refresh();
            });

            scope.goToPage = function(num) {
                scope.pgCurrent = parseInt(num);
                scope._refresh();
            };

            scope._refresh = function() {
                /* 越界检测 */
                scope.pgCurrent = (scope.pgCurrent < 1) ? 1 : scope.pgCurrent;
                scope.pgCurrent = (scope.pgCurrent > scope.pgCnt) ? scope.pgCnt : scope.pgCurrent;

                scope.pageNums = [];

                if(scope.pgCnt <= scope.pgMaxBtnCnt) { /* 显示所有按钮 */
                    for(var i = 0; i < scope.pgCnt; i++) {
                        scope.pageNums.push(i + 1); 
                    }
                }
                else { /* 显示部分按钮 */
                    /* start */
                    var indexStart = scope.pgCurrent - scope.btnCenterIndex;
                    indexStart = (indexStart < 0) ? 0 : indexStart;

                    /* end */
                    var indexEnd = scope.pgCurrent + scope.pgMaxBtnCnt - scope.btnCenterIndex;
                    indexStart = (indexEnd >= scope.pgCnt) ? (scope.pgCnt - scope.pgMaxBtnCnt) : indexStart;

                    for(var i = 0; i < scope.pgMaxBtnCnt; i++) {
                        scope.pageNums.push(indexStart + i + 1); 
                    }
                }
            };
        },
    };
});



