angular.module('starter.controllers').controller('IpAddressCtrl', function($scope,$http, cryptService,urlBaseService , $cordovaGeolocation) {

    $scope.$on("$ionicView.enter", function() {
        initData();
    })

    function initData() {
        
        $http({
            url:'http://whois.pconline.com.cn/ipJson.jsp',
            mothed: 'get',
        }).then(function(ret){
            var str = JSON.stringify(ret).split('\(\{')[1].split('\}\)')[0];
            str = ('\{'+str+'\}').replace(/\\/g,'');
            $scope.ipAddress =cryptService.filter({
                ip:null,
                pro:null,
                city:null,
                addr:null,
            },JSON.parse(str));
            lg($scope.ipAddress)
        },function(err){
            lg(err);
        });
    }


})
.filter('ipKeyName',function(){
    return function(name){
        var value = '';
        switch (name){
            case 'ip' : value = 'ip地址';break; 
            case 'pro' : value = '县';break; 
            case 'city' : value = '市';break; 
            case 'addr' : value = '位置';break; 
        }
        return value;
    }
})