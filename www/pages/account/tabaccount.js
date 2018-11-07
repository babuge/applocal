angular.module('starter.controllers').controller('AccountCtrl', function ($scope) {
  $scope.settings = {
    enableFriends: true
  };
  $scope.account = {
    seachByLonLatZoom: null,
    getLonLatByAddress: null,

  };
  $scope.account.getLonLatByAddress = function (str) {
    if (angular.isString(str)) {
      console.log("string", str);
      return [104.06, 32.00];
    }
    return false;
  }
  $scope.account.seachByLonLatZoom = function (arg, zoom) {
    if (arg == undefined) {
      return;
    }
    var view = $scope.gisMap.getView();
    if (angular.isArray(arg)) {
      view.setCenter(ol.proj.transform(arg, 'EPSG:4326', 'EPSG:3857'));
      $scope.gisMap.render();
    }
    if (angular.isString(arg)) {
      var getLonLat = $scope.account.getLonLatByAddress(arg);
      if (angular.isArray(getLonLat)) {
        view.setCenter(ol.proj.transform(getLonLat, 'EPSG:4326', 'EPSG:3857'));
        $scope.gisMap.render();
      }
    }
    if (angular.isNumber(zoom)) {
      view.setZoom(zoom);
    }
  }

  $scope.showItem = '';
  $scope.getInfo = function (code, affix,zoom) {
    if (code == 1) {
      var view = $scope.gisMap.getView();
      var center = [104.000000, 30.000000];
      view.setCenter(ol.proj.transform(center, 'EPSG:4326', 'EPSG:3857'));
      view.setZoom(5);
    } else if (code == 2) {
      $scope.account.seachByLonLatZoom([104.000000, 34.000000], 3.2);
    } else if (code == 3) {
      if (affix == undefined || affix == null) {
        return;
      }
      if(zoom){
        $scope.account.seachByLonLatZoom(affix, zoom);
        return;
      }
      $scope.account.seachByLonLatZoom(affix, 3.2);
    }
  }

  function initMap() {
    // 创建地图
    $scope.gisMap = new ol.Map({
      // 设置地图图层
      layers: [
        // 创建一个使用Open Street Map地图源的瓦片图层
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      // 设置显示地图的视图
      view: new ol.View({
        extent: [102, 29, 104, 31],
        center: ol.proj.transform([104.0, 30.67], 'EPSG:4326', 'EPSG:3857'),
        zoom: 10
      }),
      // 让id为map的div作为地图的容器
      target: 'map'
    });

  }
  initMap();

 
});
