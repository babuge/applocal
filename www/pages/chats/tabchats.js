angular.module('starter.controllers').controller('ChatsCtrl', function($scope,$timeout, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    $scope.showEndMessage=false;
    $scope.myList=[];
    for(var i=0;i<3;i++){
      $scope.myList.push(i);
    }
    $scope.pageId=1;
    $scope.doRefresh = function(){
      $scope.myList=[];
      $scope.pageId=1;
      for(var i=0;i<4;i++){
        $scope.myList.push(i);
      }
      $timeout(function(){
        $scope.$broadcast('scroll.refreshComplete');      
      },4000);
    }
    $scope.hasMoreDateLoad=true;

    var i = 10;
    $scope.loadMore =function(event){
      // event.stopPropagation()
      console.dir(arguments)
      console.log(i);
      $scope.pageId=i;      
      $timeout(function(){
        var arry = [];
        for(;i<$scope.pageId+6;++i){
          arry.push(
            {
              id: i,
              name: 'Mike Harrington8'+i,
              lastText: 'This is wicked good ice cream.',
              face: 'img/mike.png'
            }
          );
        }
        console.log(arry,$scope.chats)
        $scope.chats=$scope.chats.concat(arry);
        console.log($scope.chats)
        
        // angular.concat($scope.myList,arry);
        $scope.$broadcast('scroll.infiniteScrollComplete');
        if($scope.pageId===5){
          $scope.hasMoreDateLoad=false;
          $scope.domissMessage();
        }        
      },4000);
      
    }
    $scope.moreDataCanBeLoaded =function(){
      return $scope.hasMoreDateLoad;
    }
    $scope.domissMessage = function(){
      $scope.showEndMessage=true;
      $timeout(function(){
        $scope.showEndMessage=false;    
      },4000);    
    }



    
    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
      Chats.remove(chat);
    };

  })