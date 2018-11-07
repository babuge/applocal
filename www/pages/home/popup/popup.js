angular.module('starter.controllers')
.controller('PopupCtrl', function($scope,$timeout,timeHq) {
    $scope.$on("$ionicView.enter", function() {
    
    })

    $scope.showPopup = function() {
        timeHq.openTimeHq({
            data:{
                year:[2012,2018],
                initTime:new Date(),
            },
            callback:function(e){
                console.log('timeBbgEnd',e);
            },
        })
    }

})