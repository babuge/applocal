angular.module('starter.controllers')
.controller('IMRongCloudCtrl', function($scope, $http, Utils, cryptService, urlBaseService, rongCloudService,hintService) {
    $scope.$on("$ionicView.enter", function() {
        
        $scope.clickPool = {
            initItem:true,
            showList:false,
        };
        $scope.initData();
    })
    // init Data
    $scope.initData = function(){
        $scope.hasUser = localStorage.getItem('userInfo');
        if (!$scope.hasUser) {
            $scope.initUserList();            
            $scope.clickPool.showList = true;
        } else {
            console.log($scope.hasUser);
            $scope.checkIMtaken(JSON.parse($scope.hasUser),function(result){
                if(result===false){
                    Utils.showAlert("通讯异常！");
                    return;
                }
                // 连接融云
                rongCloudService.init(function(ret){
                    if(ret){
                        rongCloudService.connect(result);
                    }
                })
            })
        }   
    };



    // user list init
    $scope.initUserList = function() {
        $scope.userList=[{
            userId:'1',
            userName:'zuk2',
            id:0,
            checked:false,
        },{
            userId:'2',
            userName:'AGM',
            id:1,
            checked:false,            
        },{
            userId:'3',
            userName:'iphone',
            id:2,
            checked:false,            
        },{
            userId:'4',
            userName:'ipad',
            id:3,
            checked:false,            
        }];
    };

    // select item
    $scope.selectItem = function(item) {
        if($scope.clickPool.initItem===true) {
            $scope.clickPool.initItem = false;
            item.checked = true;
            $scope.userList = [item];
            var item = angular.extend({type:'crypto'},item);
            var data = cryptService.encryption({
                userId:0,
                userName:'',
                type:'',
            },item);
            $scope.reSaveTalen(data,function(result){
                $scope.clickPool.initItem = true;
                if(result){
                    $scope.clickPool.showList = false;
                }
            });
        }
        
    }

    // register resave taken
    $scope.reSaveTalen = function(data,back) {
        var userInfo = localStorage.getItem('userInfo');
        if(!!userInfo){
            userInfo = JSON.parse(userInfo);
            var timeDifference = Math.abs( Number(userInfo.date) - Number(new Date()) );
            if( timeDifference < 1000*60*60*23){
               return back(userInfo); // 23小时内不请求
            }
        }
        $http.post(urlBaseService.maps(1)+'/api/IMRongCloudToken',data).then(function(result){
            if (result.data.code === 200) {
                var IMUser = angular.extend({token:result.data.token},data,{date:Number(new Date())});
                localStorage.setItem('userInfo',JSON.stringify(IMUser));
                return back(IMUser);
            }
            return back(null);
        },function(error){
            console.log(error);
            hintService.shortBottom(error.status);
            return back(null);
        })
    };

    // check register taken
    $scope.checkIMtaken = function(data,back) {
        var req = cryptService.filter({
            userId:0,
            userName:'',
            type:'',
        },data);
        $scope.reSaveTalen(req,function(result){
            if(result){
                return back(true);
            }
            return back(false);
        });
    };
})