1. index.html
    <script src="lib/time-pickerHq/dist/time-bbg.js"></script>
2. app.js
      angular.module('mainModuleName', ['ionic', 'time-hq']){
        //
        }

    .config(function (timeHqProvider) {
        timeHqProvider.setConfig({
            data:{
                year:[2012,2018],
                initTime:new Date(),
            };
        });
    })

3. .controller('HomeCtrl', function ($scope, timeBbg) {
        var data = {
            year:[2012,2018],
            initTime:new Date(),
        };
        timeHq.openTimeHq({
            data:data;
            callback:function(e){
                console.log(e);
            }
        });
    };