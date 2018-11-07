angular.module('starter.controllers').controller('HomeCtrl', function($scope,$state, GPSService, $cordovaGeolocation) {

    $scope.$on("$ionicView.enter", function() {

    })

    $scope.homeItemInfo = [{
        show: true,
        items: [{
            show: true,
            title: '百度地图',
            cssClass: 'myIcon bbg-baidu',
            hasBubble: false,
            id:1,
        }, {
            show: true,
            title: '谷歌地图',
            cssClass: 'myIcon bbg-amap',
            hasBubble: false,
            id:2,
        }, {
            show: true,
            title: '人脸识别',
            cssClass: 'icon ion-happy',
            hasBubble: false,
            id:3,
        }, {
            show: true,
            title: '弹窗',
            cssClass: 'myIcon bbg-popup',
            hasBubble: false,
            id:4,
        }],
        pid: 1
    }, {
        show: true,
        items: [{
            show: true,
            title: '相机拍照',
            cssClass: 'icon ion-android-camera',
            hasBubble: false,
            id:5
        }, {
            show: true,
            title: 'RongCloud',
            cssClass: 'myIcon bbg-rongcloud',
            hasBubble: false,
            id:6,
        }, {
            show: true,
            title: 'ip地址',
            cssClass: 'myIcon bbg-ip',
            hasBubble: false,
            id:7,
        }, {
            show: true,
            title: 'echarts',
            cssClass: 'myIcon bbg-echarts',
            hasBubble: false,
            id:8,
        }],
        pid: 2,
    }, {
        show: false,
        items: [{
            show: true,
            title: '模块三',
            cssClass: 'icon icon-allow-update',
            hasBubble: false,
            id:9,
        }, {show: true,
            title: '模块三',
            cssClass: 'icon icon-allow-update',
            hasBubble: false,
            id:10,
        }, {show: true,
            title: '模块三',
            cssClass: 'icon icon-allow-update',
            hasBubble: false,
            id:11,
        }, {show: true,
            title: '模块三',
            cssClass: 'icon icon-allow-update',
            hasBubble: false,
            id:12,
        }],
        pid: 3
    }, {
        show: true,
        items: [{
                show: true,
                title: '模块四',
                cssClass: 'icon icon-allow-update',
                hasBubble: false,
                id:13,
            }, {
                show: true,
                title: '模块四',
                cssClass: 'icon icon-allow-update',
                hasBubble: false,
                id:14,
            },{
                show: true,
                title: '模块四',
                cssClass: 'icon icon-allow-update',
                hasBubble: false,
                id:15,
            },{
                show: true,
                title: '模块四',
                cssClass: 'icon icon-allow-update',
                hasBubble: false,
                id:16,
        }],
        pid: 4
    }, ];

    // 跳转事件集
    $scope.gotoModule = function(idx) {
        if(idx>8 || idx==5){
            console.log('该模块尚未开发！')
            return;
        }
        var goToFuntion = function(pathName){
            $state.go(pathName);
        };
        var eventMap = new Map();
        eventMap.set(1,"tab.baiduMap");
        eventMap.set(2,"tab.amap");
        eventMap.set(3,"tab.faceContrast");
        eventMap.set(4,"tab.popup");
        eventMap.set(6,"tab.rongCloud");
        eventMap.set(7,"tab.ipAddress");
        eventMap.set(8,"tab.echarts");
        angular.forEach(eventMap,function(item,index,map){
            if(index===idx){
                goToFuntion(item);
            }
        })
    }

})