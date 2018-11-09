// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services', 'starter.directives', 'starter.values','angularCSS'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        try{
            navigator.splashscreen.hide();
        }catch(e){
            console.log(e.message)
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})
.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.tabs.style('standard');
    $ionicConfigProvider.platform.ios.navBar.alignTitle('center'); 
    $ionicConfigProvider.platform.android.navBar.alignTitle('center');
    $ionicConfigProvider.views.maxCache(10);
    $ionicConfigProvider.views.forwardCache(true);
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider
    // setup an abstract state for the tabs directive
    .state('tab', {
        url: '/tab',
        abstract: true,
        cache:true,
        templateUrl: 'pages/tabs.html',
        controller: 'mainCtrl',
    })
    // Each tab has its own nav history stack:
    .state('tab.home', {
        url: '/home',
        cache:false,
        views: {
            'tab-home': {
                templateUrl: 'pages/home/home.html',
                controller: 'HomeCtrl',
                css: 'pages/home/home.css'
            }
        }
    })
    .state('tab.baiduMap',{
        url: '/baiduMap',
        cache:true,
        views: {
            'tab-home':{
                templateUrl: 'pages/home/baiduMap/baidumap.html',
                controller: 'BaiduMapCtrl',
                css: 'pages/home/baiduMap/baidumap.css'
            }
        }
    })
    .state('tab.amap',{
        url:'/amap',
        views:{
            'tab-home':{
                templateUrl:'pages/home/amap/amap.html',
                controller:'AMapCtrl',
                css:'pages/home/amap/amap.css'
            }
        }
    })
    .state('tab.faceContrast',{
        url: '/faceContrast',
        cache:true,        
        views: {
            'tab-home':{
                templateUrl: 'pages/home/faceContrast/faceContrast.html',
                controller: 'FaceContrast',
                css: 'pages/home/faceContrast/faceContrast.css'
            }
        }
    })
    .state('tab.rongCloud',{
        url:'/rongCloud',
        cache:true,
        views: {
            'tab-home':{
                templateUrl:'pages/home/IMRongCloud/IMRongCloud.html',
                controller:'IMRongCloudCtrl',
                css:'pages/home/IMRongCloud/IMRongCloud.css'
            }
        }
    })
    .state('tab.chats', {
        url: '/chats',
        cache:true,        
        views: {
            'tab-chats': {
                templateUrl: 'pages/chats/tab-chats.html',
                controller: 'ChatsCtrl',
                css: 'pages/chats/tab-chats.css'
            }
        }
    })
    .state('tab.chat-detail', {
        url: '/chats/:chatId',
        cache:true,        
        views: {
            'tab-chats': {
                templateUrl: 'pages/chats/detail/chat-detail.html',
                controller: 'ChatDetailCtrl',
                css: 'pages/chats/detail/chat-detail.css'
            }
        }
    })
    .state('tab.account', {
        url: '/account',
        cache:true,        
        views: {
            'tab-account': {
                templateUrl: 'pages/account/tab-account.html',
                controller: 'AccountCtrl',
                css: 'pages/account/tab-account.css'
            }
        }
    })
    .state('tab.popup', {
        url: '/popup',
        cache:true,        
        views: {
            'tab-home': {
                templateUrl: 'pages/home/popup/popup.html',
                controller: 'PopupCtrl',
                css: 'pages/home/popup/popup.css'
            }
        }
    })
    .state('tab.echarts',{
        url: '/echarts',
        cache:true,
        views: {
            'tab-home': {
                templateUrl: 'pages/home/echarts/echarts.html',
                controller: 'EchartsCtrl',
                css: 'pages/home/echarts/echarts.css'
            }
        }
    })
    .state('tab.ipAddress',{
        url:'/ipAddress',
        cache:'true',
        views: {
            'tab-home':{
                templateUrl: 'pages/home/ipAddress/ipAddress.html',
                controller: 'IpAddressCtrl',
                css: 'pages/home/ipAddress/ipAddress.css'
            }
        }
    })
    .state('tab.openlayer',{
        url:'/openlayer',
        cache:'true',
        views: {
            'tab-home':{
                templateUrl: 'pages/home/openlayer/openlayer.html',
                controller: 'openlayerCtrl',
                css: 'pages/home/openlayer/openlayer.css'
            }
        }
    })
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/home');
});