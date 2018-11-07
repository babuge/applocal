angular.module('starter.controllers').controller('DashCtrl', function($scope,GPSService,$cordovaGeolocation) {

    $scope.$on("$ionicView.enter",function(){
    })
    //初始化变量
    $scope.title="bd09ll to gc";
    $scope.preLon='00.00';
    $scope.preLat='00.00';
    $scope.aftLon='00.11';
    $scope.aftlat='00.12';
    $scope.reLon='00.03';
    $scope.relat='00.04';
    $scope.getGps=function(){
        ionic.Platform.ready(function() {
            GPSService.runGps().then(function (data) {
                var data = JSON.parse(data);
                $scope.preLon=data.lon;
                $scope.preLat=data.lat;
                var coor=coordtransform.bd09togcj02($scope.preLon,$scope.preLat);
                $scope.aftLon=coor[0];
                $scope.aftlat=coor[1];
                var recoor=coordtransform.gcj02tobd09($scope.aftLon,$scope.aftlat);
                $scope.reLon=recoor[0];
                $scope.relat=recoor[1];
            });
        });
    }
})