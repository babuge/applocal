angular.module('starter.controllers')
.controller('AMapCtrl', function($scope, $ionicLoading, 
$timeout,GPSService, $cordovaGeolocation) {
    $scope.$on("$ionicView.beforEnter", function() {
        $scope.show();
    });
    $scope.$on("$ionicView.enter", function() {
         // 初始化谷歌地图
         $scope.amapInit = {
            init:{
                center:[104.06792346,30.67994285],
                zoom:6
            },
            addController:true,
        };
    });
    $scope.show = function() {
        $ionicLoading.show({
          template: 'Loading...'
        });
    };
    $scope.hide = function(){
    $ionicLoading.hide();
    };
})