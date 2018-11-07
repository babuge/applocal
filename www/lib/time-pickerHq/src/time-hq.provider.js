
angular.module('time-hq.provider',[])
.provider('timeHq',function(){
    var config = {
        data:{
            year:[2012,2018],
            initTime:new Date(),
        },
    };
    this.setConfig = function(inObj) {
        angular.extend(config,inObj);
    }

    this.$get = ['$rootScope','$ionicPopup',function($rootScope,$ionicPopup){
        var provider = {};
        var $scope = $rootScope.$new();
        $scope.message={};
        $scope.setDateMessege = function(msg){
            $scope.message = msg;
        }
        // init scope、funtion
        provider.openTimeHq = function(inpObj){
            var buttons=[];
            // dosomthing;
            $scope.mainObj = angular.extend({},config,inpObj);
            buttons.push({
                text: '取消',
                type: 'button-light'
            });
            buttons.push({
                text: "确定",
                type: 'button-light',
                onTap: function (e) {
                   $scope.mainObj.callback($scope.message);
                }
            });
            $scope.popup= $ionicPopup.show({
                template: '<hq-timedirective></hq-timedirective>',
                scope: $scope,
                cssClass: 'time-hq',
                buttons: buttons
            })
        }
        return provider;
    }];


});