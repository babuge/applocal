angular.module('starter.controllers').controller('FaceContrast', function($scope,$http,ConstFace,ImageServes) {

  $scope.$on("$ionicView.enter", function() {
      $scope.credentials=angular.extend({},ConstFace);
      console.log($scope.credentials);
      $scope.selectUsers = [
        {
          id:0,
          name:'周杰伦',
          url:'img/zhuojielun.jpg',
          url1:'img/zhuojielun1.jpg',
        },        {
          id:1,
          name:'杨幂',
          url:'img/yangmi.jpg',
          url1:'img/yangmi1.jpg',
        },        {
          id:2,
          name:'薛之谦',
          url:'img/xuezhiqian.jpg',
          url1:'img/xuezhiqian1.jpg',
        },        {
          id:3,
          name:'李沁',
          url:'img/liqin1.jpg',
          url1:'img/liqin.jpg',
        },{
          id:4,
          name:'李小璐',
          url:'img/lixiaolu.jpg',
          url1:'img/lixiaolu1.jpg',
        },{
          id:5,
          name:'范冰冰',
          url:'img/fanbingbing.jpg',
          url1:'img/fanbingbing1.jpg',
        },{
          id:6,
          name:'ben',
          url:'img/ben.jpg',
          url1:'img/ben1.jpg',
        },
      ];
      $scope.selectUsersEd = {
        id:0,
        name:'周杰伦',
        url:'img/zhuojielun.jpg',
        url1:'img/zhuojielun1.jpg',
      };
      initData();
  })
  function initData(){
    // 初始化
    $scope.newOringinal=null;
    $scope.updateImage=null;
  }
  // fetch image
  $scope.faceContrast = function(){
     // 获取本地图片
     $http({
      method: "get",
      url: 'img/babuge.jpg',
      responseType: 'arraybuffer'
    }).then(function(res){
     $scope.original = ImageServes.arrayBufferToBase64(res.data);
     var cameraOptions ={
      quality: 50,
      targetWidth:500,
      targetHeight:500,
      saveToPhotoAlbum: true,
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      destinationType: Camera.DestinationType.DATA_URL
    };
    navigator.camera.getPicture(cameraSuccess, cameraError, cameraOptions);
    },function(err){
      console.log('err',err);
    });
    function cameraSuccess(res){
      var data = res;
      $scope.updateImage = data;
      $scope.faceUpdate($scope.original,res);
    };
    function cameraError(err){
      // alert(JSON.stringify(err));
    };
  };

  //select img update 
  $scope.faceButton = function(){
    $http({
      method: "get",
      url: $scope.selectUsersEd.url,
      responseType: 'arraybuffer'
    }).then(function(res){
      $scope.original = ImageServes.arrayBufferToBase64(res.data);
      $http({
        method: "get",
        url: $scope.selectUsersEd.url1,
        responseType: 'arraybuffer'
      }).then(function(response){
          $scope.updateImage = ImageServes.arrayBufferToBase64(response.data);
          $scope.faceUpdate($scope.original,$scope.updateImage);
      })
    });
  }

  // change name
  $scope.changeName =function(a){
    $scope.selectUsersEd = a;
  }
  // question
  $scope.faceUpdate = function(oldImage,newImage){
    var data = {
      type: 1,
      content_1: oldImage,
      content_2: newImage,
    };
    $http.post('http://www.babuge.com/api/faceConstrat',data)
    .then(function(res){
      // console.log(res);
      if(res.data && res.data.responseCode==200){
        $scope.endData =JSON.parse(res.data.bodyData);
        console.log($scope.endData)
      };
    },function(err){
      // console.log(err);
    })
  };

})