var controllers = window.controllers || angular.module('starter.controllers',['time-hq']);
controllers.controller('mainCtrl', function($scope,$ionicTabsDelegate) {
  //app -- tab(tabs切换运行mainCtrl及任何跳转)--

  $scope.$on("$ionicView.beforeEnter",function(){
    console.log('beforeEnter');//每次运行 先于 enter
    
  })
  $scope.$on("$ionicView.enter",function(){
    console.log('enter');//每次运行
  })
  $scope.$on("$ionicView.loaded",function(){

  })
  console.log('o');
})