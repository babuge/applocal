angular.module('starter.controllers')
    .controller('openlayerCtrl', function ($scope, $window, bbghttp, $timeout, timeHq) {
        $scope.$on("$ionicView.enter", function () {
            initData();
        })
        $scope.winW = $window.innerWidth; $scope.winH = $window.innerHeight - 45-48;
        function initData() {
            $scope.freshFlag = [parseInt($scope.winW*2/5),parseInt($scope.winH*2/5)];
            $scope.center = ol.proj.transform([104.06667, 30.66667],'EPSG:4326', 'EPSG:3857');
            $scope.extent =$scope.getExtent($scope.center);
            $scope.map = new ol.Map({
                // 设置地图图层
                layers: [
                    // 创建一个使用Open Street Map地图源的瓦片图层
                    new ol.layer.Tile({
                        source: new ol.source.OSM()
                    })
                ],
                view: new ol.View({
                    extent: $scope.extent,
                    center: $scope.center,
                    zoom: 16,
                    minZoom:15,
                    maxZoom:19
                }),
                target: 'openlayer'
            });
            var zoom = $scope.map.getView().getZoom();
            lg('init Zomm: '+zoom)
            var extent2 = [$scope.center[0]-156/2,$scope.center[1]-96/2,$scope.center[0]+156/2,$scope.center[1]+63/2];
            $scope.map.addLayer(new ol.layer.Image({
                source: new ol.source.ImageStatic({
                    url: '../img/blank.png', // 熊猫基地地图
                    imageExtent: extent2,   // 映射到地图的范围
                })
            }));
            $scope.onResolution = $scope.map.getView().on('change:resolution', function () {
                var zoom = $scope.map.getView().getZoom();
                lg('change zomm '+zoom);
                if(zoom===19){
                    lg('注销 change event')
                    $scope.map.unByKey($scope.onResolution);
                }
            })
            var cont=0;
            $scope.onMove = $scope.map.on('moveend',function() {
                lg(++cont);
                lg($scope.extent)
                var newCenter = $scope.map.getView().getCenter();
                lg(newCenter,$scope.center);
                if($scope.borderFlag(newCenter,$scope.center)===true){
                    lg('update')
                    $scope.upateCenter(newCenter);
                }
            })
    }

    // 计算
    $scope.borderFlag = function(newC,oldC) {
        var ret = [false,false,false,false];
        var lr = newC[0]-oldC[0]; // 大于0 向右，反之为左
        var tb = newC[1]-oldC[1]; // 大于0 向上，反之为下
        var wAbs =  Math.abs(lr)-$scope.freshFlag[0];
        var hAbs = Math.abs(tb) - $scope.freshFlag[1];
        // 如果通过 坐标 及半径 查询数据，只需要更新中心
        if(wAbs>0 || hAbs>0) {
            return true;
        }
        return false;
    };

    // 更新数据
    $scope.upateCenter = function(center){
        $scope.center = center;
        // bbghttp.post('/api/updateCenter',{center:center}).then(function(result){
            // lg(result);
            // 更新feature数据
            //   $scope.featureFresh(result.data)
            // 更新边界
            $scope.extent = $scope.getExtent($scope.center);
            var view = new ol.View({
                extent: $scope.extent,
                center: $scope.center,
                zoom: $scope.map.getView().getZoom(),
                minZoom:15,
                maxZoom:19
            });
            $scope.map.setView(view)
            // 渲染图层
            // $scope.render();
        // })
    }

    // 渲染
    $scope.render = function(arg){
        $scope.map.render();
    }
    
    // 显示边界
    $scope.getExtent = function(center) {
        return [center[0]-$scope.winW,center[1]-$scope.winH/2,center[0]+$scope.winW,center[1]+$scope.winH/2];
    }

    // 页面摧毁
    $scope.$on('$destroy',function(){

    })
})