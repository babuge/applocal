angular.module('starter.directives',[])
    .directive('loadingFull',['$ionicBackdrop','$timeout','$rootScope',function($ionicBackdrop,$timeout,$rootScope){
        return {
            restrict:'E',
            template:"",
            replace:true,
            controller:function(){},
            link:function(scope,element,attrs){
                scope.attrs=attrs;
                scope.parseDom=function parseDom(arg) {
                    　　 var objE = document.createElement("div");
                    　　 objE.innerHTML = arg;
                    　　 return objE.childNodes;                    
                };                
                scope.loadingFn= function(val){
                    if(val=="true"){
                        $ionicBackdrop.retain();
                        var backEle = angular.element(document.querySelector(".backdrop"));  
                        scope.selfHeight=(backEle[0].clientHeight-44)/2-32 + "px";
                        var domString='<div class="hqLoading ">';  
                        domString+= '<div class="text-center LoadingBar ion-hq-md" style="top:'+scope.selfHeight+'"><i class="icon ion-hq-loading"></i>';                                     
                        domString+='</div></div>';
                        var ele=scope.parseDom(domString);            
                        backEle.append(ele);
                        backEle.addClass("hqBackDrop");
                       
                    }else{
                        $ionicBackdrop.release();
                        var backEle = angular.element(document.querySelector(".backdrop"));
                        if(backEle.hasClass("hqBackDrop")){
                            backEle.removeClass("hqBackDrop");
                            backEle.html("");
                        }
                    }
                }; 
                var watchSelf=scope.$watch("attrs.showloading",function(value){
                    if(value!=undefined ){
                        if(value=="true"){
                            scope.loadingFn(value);
                        }else if(value=="false"){
                            scope.loadingFn(value);
                        }
                    }  
                })
                $rootScope.$on('$stateChangeStart',function(event,toState,toParams,fromState,fromParams){
                    //tab的状态的改变--关闭
                    var backEle = angular.element(document.querySelector(".backdrop"));
                    if(backEle.length>0 &&backEle.hasClass("active")){
                        scope.loadingFn(false);
                        watchSelf=null;
                    }                    
                });                
            }
        }
    }])
    .directive('bbgBdmap',['$timeout',function($timeout){
        return {
            restrict:'E',
            template:'<div id="contBbg" style="height:100%;width:100%;"></div>',
            replace:true,
            scope:false,
            // controller:function(){
            // console.log(arguments)
            // },
            link:function(scope,element,attrs){
                scope.newAttrs = null;
                // ----订阅
                attrs.$observe('mapbaiduinit', function (value) {
                    if(value.length>0){
                        scope.newAttrs = JSON.parse(value);
                        mapInit();
                    }                    
                });
                function ZoomControl(){    
                    // 设置默认停靠位置和偏移量  
                    this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;    
                    this.defaultOffset = new BMap.Size(10, 10);
                }    
                // 通过JavaScript的prototype属性继承于BMap.Control   
                ZoomControl.prototype = new BMap.Control();
                // 自定义控件必须实现initialize方法，并且将控件的DOM元素返回   
                // 在本方法中创建个div元素作为控件的容器，并将其添加到地图容器中   
                ZoomControl.prototype.initialize = function(map){    
                    // 创建一个DOM元素   
                    var div = createDiv("+");    
                    // 绑定事件，点击一次放大两级    
                    div.onclick = function(e){  
                        map.zoomTo(map.getZoom() + 1);    
                    }    
                    // 添加DOM元素到地图中   
                    map.getContainer().appendChild(div);    
                    // 将DOM元素返回  
                    return div;    
                };

                function createDiv(str){
                    var ele = document.createElement("div");    
                    // 添加文字说明    
                    ele.appendChild(document.createTextNode(""+str+""));    
                    // 设置样式
                    ele.style.width = "32px";
                    ele.style.height = "32px";  
                    ele.style.cursor = "pointer";    
                    ele.style.border = "1px solid gray";    
                    ele.style.backgroundColor = "rgba(255,255,255,0.5)";
                    ele.style.lineHeight = "36px";
                    ele.style.textAlign = "center"; 
                    return ele;
                }

                 // --------定义另一个控件类，即function--
                 function SubZoomControl(){
                    // 设置停靠和偏移量
                    this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
                    this.defaultOffset = new BMap.Size(10,46);
                }
                // 通过JavaScript的prototype属性继承于BMap.Control
                SubZoomControl.prototype = new BMap.Control();
                // 自定义控件必须实现initialize方法，并且将控件的DOM元素返回
                // 在本方法中创建个div元素作为控件的容器，并将其添加到地图容器中
                SubZoomControl.prototype.initialize = function(map){
                    // 创建一个DOM元素
                    var div = createDiv("-");
                    // 绑定事件，点击一次缩小2级
                    div.onclick = function(e){
                        map.zoomTo(map.getZoom() - 1);
                    }
                    // 添加DOM元素到地图中
                    map.getContainer().appendChild(div);
                    // 将DOM元素返回
                    return div;
                }

                // ------定义刷新控件类，即function--
                function RefreshControl(){
                    // 设置默认停靠位置和偏移量
                    this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
                    this.defaultOffset = new BMap.Size(10,82);
                }
                // 通过JavaScript的prototype属性继承于BMap.Control
                RefreshControl.prototype = new BMap.Control();
                // 自定义控件必须实现initialize方法，并且将控件DOM元素返回
                // 在本方法中创建个div元素作为控件的容器，并将其添加到地图容器中
                RefreshControl.prototype.initialize = function(map){
                    // 创建一个DOM元素
                    var div = createDiv(" ");
                    div.setAttribute("class","icon ion-refresh");
                    // 绑定事件，点击一次缩小2级
                    div.onclick = function(e){
                        map.setZoom(scope.newAttrs.init.zoom);
                        map.setCenter(new BMap.Point(scope.newAttrs.init.center[0],scope.newAttrs.init.center[1]));
                    }
                    // 添加DOM元素到地图中
                    map.getContainer().appendChild(div);
                    // 将DOM元素返回
                    return div;
                };
                // ----地址拼接
                function addressName(value,num){
                    if(!value || value.length<=0){
                        return '';
                    }else{
                        return num?value:"-"+value;
                    }
                }
                // ----坐标转地址---
                function mylocation(mypoint){
                    // 地址解析,创建地理编码实例      
                    var myGeo = new BMap.Geocoder();    
                    // 根据坐标得到地址描述    
                    myGeo.getLocation(mypoint, function(result){      
                        if (result){      
                            var infoWindow = null;
                            var opts = {    
                                width : 0,     // 信息窗口宽度    
                                height: 0,     // 信息窗口高度    
                                title : "提示"  // 信息窗口标题   
                            };   
                            infoWindow = new BMap.InfoWindow('你正在<span style="color:#0aa;"> '+result.address+'<span>', opts);  // 创建信息窗口对象
                            map.openInfoWindow(infoWindow,mypoint);
                            !scope.newAttrs.addController||refreshControl.hide();
                            !scope.newAttrs.addController||subZoomControl.hide();
                            !scope.newAttrs.addController||zoomCtrl.hide()
                            infoWindow.disableAutoPan();
                            infoWindow.addEventListener("clickclose",function(e){
                                !scope.newAttrs.addController||refreshControl.show();
                                !scope.newAttrs.addController||subZoomControl.show();
                                !scope.newAttrs.addController||zoomCtrl.show();
                            });    
                        }      
                    });
                }

                function mapInit(){
                    if(!!scope.newAttrs.init){
                        !!scope.newAttrs.init.center||function(){
                            scope.newAttrs.init={center:[104.06792346,30.67994285]}
                        }(),
                        !!scope.newAttrs.init.zoom||function(){scope.newAttrs.init.zoom=6}();
                    }else{
                        scope.newAttrs.init = {
                        center:[104.06792346,30.67994285],
                        zoom:6
                        }
                    };
                    
                    // ------------初始化---
                    var con = angular.element(element)[0];
                    var map = new BMap.Map(con);
                    map.disableDoubleClickZoom();
                    // 创建地图实例  
                    var point = new BMap.Point(scope.newAttrs.init.center[0], scope.newAttrs.init.center[1]);
                    // 创建点坐标  
                    map.centerAndZoom(point, scope.newAttrs.init.zoom);
                    map.setMinZoom(4);
                    
                    // 初始化地图，设置中心点坐标和地图级别
                    // ---------定义一个控件类，即function---   
                    if(scope.newAttrs.addController === true){
                        // 创建控件实例    
                        var zoomCtrl = new ZoomControl();
                        // 添加到地图当中    
                        map.addControl(zoomCtrl);
                        // 创建控件实例
                        var subZoomControl = new SubZoomControl();
                        map.addControl(subZoomControl);
                        // 创建控件实例
                        var refreshControl = new RefreshControl(point);
                        map.addControl(refreshControl);
                    }
                    // 定位: sdk辅助定位
                    var geolocation = new BMap.Geolocation();
                    // 开启SDK辅助定位
                    geolocation.enableSDKLocation();
                    geolocation.getCurrentPosition(function(r) {
                        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                            var mk = new BMap.Marker(r.point);
                            map.addOverlay(mk);
                            map.panTo(r.point);
                            var address = addressName(r.address.province,1)+addressName(r.address.city)+addressName(r.address.district)+addressName(r.address.street)+addressName(r.address.street_number);
                            var mypoint = new BMap.Point(r.point.lng,r.point.lat);
                            map.setCenter(mypoint);
                            map.setZoom(13);
                            var opts = {    
                                width : 220,     // 信息窗口宽度  
                                height: 70,     // 信息窗口高度   
                                title : "&nbsp;&nbsp;提示:",  // 信息窗口标题
                                offset: new BMap.Size(0, 10),
                                enableCloseOnClick: true
                            };   
                            var infoWindow = new BMap.InfoWindow('你正在<span style="color:#0aa;"> '+address+'<span>', opts);  // 创建信息窗口对象
                            mk.addEventListener("click",function(){
                                this.openInfoWindow(infoWindow);
                                !scope.newAttrs.addController||refreshControl.hide();
                                !scope.newAttrs.addController||subZoomControl.hide();
                                !scope.newAttrs.addController||zoomCtrl.hide();
                            });
                            infoWindow.addEventListener("close",function(e){
                                !scope.newAttrs.addController||refreshControl.show();
                                !scope.newAttrs.addController||subZoomControl.show();
                                !scope.newAttrs.addController||zoomCtrl.show();
                            });    
                        }
                        else {
                            console.log('failed'+this.getStatus());
                        } 
                    });

                    // 定位:浏览器定位
                    // var myLocalPoint = null;
                    // var geolocation = new BMap.Geolocation();
                    // geolocation.getCurrentPosition(function(r){
                    //     if(this.getStatus() == BMAP_STATUS_SUCCESS){
                    //         var mk = new BMap.Marker(r.point);
                    //         map.addOverlay(mk);
                    //         map.panTo(r.point);
                    //         alert('您的位置：'+r.point.lng+','+r.point.lat);
                    //         myLocalPoint = r.point; 
                    //         mylocation(new BMap.Point(r.point.lng,r.point.lat));
                    //     }
                    //     else {
                    //         alert('failed'+this.getStatus());
                    //     }        
                    // });

                    // 定位:ip定位
                    // function myFun(result){
                    //     var cityName = result.name;
                    //     map.setCenter(cityName);
                    //     alert("当前定位城市:"+cityName);
                    // }
                    // var myCity = new BMap.LocalCity();
                    // myCity.get(myFun);

                    
                    

                    
                }
                
            } 
        }
    }])
    .directive('gobackButton',[function(){
        return {
            restrict :'EC',
            template : '<button class="button button-clear icon-left ion-ios-arrow-left" style ="color:#ffffff"></button>',
            replace : true,
            scope : false,
            link : function(scope,element,attrs){
                var total = {
                    backText : '返回',
                };
                var contentElement = angular.element(element)[0];
                var backText = contentElement.getAttribute('backText'); 
                if(backText){
                    contentElement.innerHTML = '&nbsp;'+ backText;
                }else{
                    contentElement.innerHTML = '&nbsp;'+ total.backText;
                }
            }
        }
        // <goback-Button backText='返回'></goback-Button>  //backText : string  
    }])
    .directive('bbgAmap',[function(){
        return {
            restrict: "E",
            template: '<div id="aMapRoot" style="width:100%;height:100%"></div> ',
            replace: true,
            scope:true,
            link: function(scope,element,attrs){
                scope.newAttrs = null;
                // ----订阅
                attrs.$observe("amapinit", function (value) {
                    if(value.length>0){
                        scope.newAttrs = JSON.parse(value);
                        mapInit();
                    }                    
                });

                function mapInit(){
                    // var map = new AMap.Map('aMapRoot');
                    var map = new AMap.Map('aMapRoot', {
                        zoom:scope.newAttrs.zoom,//级别
                        center: scope.newAttrs.center,//中心点坐标
                        viewMode:'3D'//使用3D视图
                    });
                    if(map.loaded){
                        scope.hide()
                    }
                    
                }
               
            }
        }
    }])
    .directive('bbgEcharts',function(){ // echarts 模版
        return {
            restrict: "E",
            template: '<div  style="width:100%;height:200px"></div> ',
            replace: true,
            scope:true,
            link: function(scope,element,attrs){
                // 是否改变element初始化高
                if(!!attrs.height){
                    element[0].style.height=attrs.height+"px";
                }
                scope.newAttrs = null;
                // ----订阅
                attrs.$observe("echartsinit", function (value) {
                    if(value.length>0){
                        scope.newAttrs = JSON.parse(value);
                        if(!!scope.newAttrs.opt){
                            Init(scope.newAttrs);
                        }
                    }
                });

                function Init(arg){
                    var myChart = echarts.init(element[0]);
                    // 是否显示隐藏loading
                    if(arg.loaded===false){
                        myChart.showLoading();
                    }
                    if(arg.loaded===true){
                        myChart.hideLoading();
                    }
                    myChart.setOption(arg.opt);
                }
            }
        }
       
        // <bbg-echarts echartsinit={{someScope}} height="350"></bbg-echarts> 【someScope:{opt:null,loaded:null}，height：绑定高度】
        // opt 为echarts的option 【echarts.init(option)】，loaded：null 【不开启动画】false与true显示隐藏动画
    })
