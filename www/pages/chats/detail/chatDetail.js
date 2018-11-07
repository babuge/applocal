
angular.module('starter.controllers').controller('ChatDetailCtrl', function($scope, $stateParams,  Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
    $scope.chatInfo = {
      getScale:null,
    }
    function test(){
      var center =[104.06667, 30.66667];
      console.log(ol.proj);
      // 地图设置中心，设置到成都，在本地离线地图 offlineMapTiles刚好有一张zoom为4的成都瓦片
      var center2 = ol.proj.transform([109.06667, 30.66667], 'EPSG:4326', 'EPSG:3857');
      console.log(center2)
      // 计算熊猫基地地图映射到地图上的范围，图片像素为 550*344，保持比例的情况下，把分辨率放大一些
      var extent2 = [center2[0]- 550*1000/2, center2[1]-344*1000/2, center2[0]+550*1000/2, center2[1]+344*1000/2];
  
      //创建地图
      // $scope.gisMap = new ol.Map({
      //   // 设置地图图层
      //   layers: [
      //     // 创建一个使用Open Street Map地图源的瓦片图层
      //     new ol.layer.Tile({
      //       source: new ol.source.OSM()
      //     })
      //   ],
      //   // 设置显示地图的视图
      //   view: new ol.View({
      //     extent: [102, 29, 104, 31],
      //     center: ol.proj.transform([104.0, 30.67], 'EPSG:4326', 'EPSG:3857'),
      //     zoom: 10
      //   }),
      //   // 让id为map的div作为地图的容器
      //   target: 'map'
      // });
  
      var map2 = new ol.Map({
         // 设置地图图层
         layers: [
          // 创建一个使用Open Street Map地图源的瓦片图层
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
          view: new ol.View({ 
              extent: [102, 29, 104, 31],
              center: ol.proj.transform(center, 'EPSG:4326', 'EPSG:3857'),
              zoom: 7
          }),
          target: 'map2'
      });
      var view = map2.getView();
      var zoom =view.getZoom();
      console.log(view,zoom);
      // 加载熊猫基地静态地图层
      map2.addLayer(new ol.layer.Image({
          source: new ol.source.ImageStatic({
              url: '../img/blank.png', // 熊猫基地地图
              imageExtent: extent2 ,   // 映射到地图的范围
              scale:0.3
          })
      }));
  
      // 创建一个用于放置活动图标的layer
      var activityLayer = new ol.layer.Vector({
          source: new ol.source.Vector()
      });
      // 创建一个活动图标需要的Feature，并设置位置
      var activity = new ol.Feature({
          geometry: new ol.geom.Point([center2[0]- 550*1000/2 + 390 * 1000, center2[1]-344*1000/2 + (344 - 145) * 1000])
      })
      // 设置Feature的样式，使用小旗子图标
      activity.setStyle(new ol.style.Style({
          image: new ol.style.Icon({
              src: '../img/flag.png',
              anchor: [0, 1],
              scale: 0.2
          })
      }));
      
      // 添加活动Feature到layer上，并把layer添加到地图中
      activityLayer.getSource().addFeature(activity);
      map2.addLayer(activityLayer);
      map2.render();
      map2.getView().on('change:resolution', function(){
        var style = activityLayer.getStyle();
        console.log(style)
        // 重新设置图标的缩放率，基于层级10来做缩放
        activityLayer.getImage().setScale(this.getZoom() / 10);
        activityLayer.setStyle(style);
      })
    }

    //=====================================
    function zoom(){
      var layer = new ol.layer.Vector({
        source: new ol.source.Vector()
      })
      var map = new ol.Map({
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          }), 
          layer
        ],
        target: 'map2',
        view: new ol.View({
          projection: 'EPSG:4326',
          center: [106, 32],
          zoom: 4,
          minZoom:4,
          maxZoom:15,
        })
      });
      
      var anchor = new ol.Feature({
        geometry: new ol.geom.Point([104.0818, 30.688])
      });
      anchor.setStyle(new ol.style.Style({
        image: new ol.style.Icon({
          src: '../img/flag.png',
          scale:0.2
        })
      }));
      layer.getSource().addFeature(anchor);
    
      // 监听地图层级变化
      map.getView().on('change:resolution', function(){
          var style = anchor.getStyle();
          console.log(this.getZoom());
          // 重新设置图标的缩放率，基于层级10来做缩放
          style.getImage().setScale($scope.chatInfo.getScale(this.getZoom() )/ 10);
          anchor.setStyle(style);
      })
    }
    $scope.chatInfo.getScale=function(zoom){
      if(angular.isNumber(zoom)){
        switch (zoom){
          case 1: return 0.25;
          case 2: return 0.3;
          case 3: ;
          case 4: return 0.2;
          case 5:return 0.3;
          case 6:return 0.4;
          case 7:return 0.5;
          case 8:return 0.7;
          case 9:return 1;
          case 10:return 2;
        }
        if(zoom>10){
          return 2.5;
        }
        if(zoom<1){
          return 0.2;
        }
      }
    }
    test();
    // zoom();

    $scope.submit=function(data){
      console.log("数据："+data);
    }
    $scope.myItem=[{name:2},{name:3},{name:4},{name:5},{name:1}];
  })