/**
 * 时间过滤器，将日期格式过滤为今天，昨天，前天等格式
 * 使用方法：{{column |iToday| date:'yyyy-MM-dd'}}
 */
(function () {
    "use strict";

    angular.module('app').filter('daysAgo', ['$filter', function ($filter) {
        return function (dateTimeStamp) {
            var minute = 1000 * 60;
            var hour = minute * 60;
            var day = hour * 24;
            var halfamonth = day * 15;
            var month = day * 30;

            var now = new Date().getTime();
            var diffValue = now - dateTimeStamp;
            if(diffValue < 0){return;}
            var monthC =diffValue/month;
            var weekC =diffValue/(7*day);
            var dayC =diffValue/day;
            var hourC =diffValue/hour;
            var minC =diffValue/minute;

            var result;

            if(monthC>=1){
                result="" + parseInt(monthC) + "月前";
            }
            else if(weekC>=1){
                result="" + parseInt(weekC) + "周前";
            }
            else if(dayC>=1){
                result=""+ parseInt(dayC) +"天前";
            }
            else if(hourC>=1){
                result=""+ parseInt(hourC) +"小时前";
            }
            else if(minC>=1){
                result=""+ parseInt(minC) +"分钟前";
            }else
                result="刚刚";

            return result;

            // if (angular.isUndefined(input))return input;
            // var inputDate = new Date(input);
            // var now = new Date();
            // var date3 = now.getTime() - inputDate.getTime();  // 时间差的毫秒数;
            // // 计算出相差天数
            // var days = Math.floor(date3 / (24 * 3600 * 1000));
            //
            // // 计算出小时数
            // var leave1 = date3 % (24 * 3600 * 1000);    // 计算天数后剩余的毫秒数
            // var hours = Math.floor(leave1 / (3600 * 1000));
            // // 计算相差分钟数
            // var leave2 = leave1 % (3600 * 1000);        // 计算小时数后剩余的毫秒数
            // var minutes = Math.floor(leave2 / (60 * 1000));
            //
            // // 计算相差秒数
            // var leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数
            // var seconds = Math.round(leave3 / 1000);
            // var param = "";
            // param = days>1?days+"天":hours>1?hours+"小时":minutes>1?minutes+'分钟':seconds>1?seconds+"秒":1+"秒";
            // return  "更新于"+param+"前";
        }
    }])
})();