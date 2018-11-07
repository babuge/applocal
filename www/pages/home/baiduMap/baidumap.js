angular.module('starter.controllers').controller('BaiduMapCtrl', function($scope, $timeout,GPSService, $cordovaGeolocation) {

    $scope.$on("$ionicView.enter", function() {
        //  // 初始化百度地图
         $scope.baiduInit = {
            init:{
                center:[104.06792346,30.67994285],
                zoom:6
            },
            addController:true,
        };
    })
   
})