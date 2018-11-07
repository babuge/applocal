angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})
.factory('GPSService', function($q,$cordovaGeolocation) {
  var code = [61,161,66];
  return{
      runGps:function () {
          var errMsg = "";
          var deferred = $q.defer();
          if (ionic.Platform.isAndroid()){                
            bbgLocation.getLocation(function (data){
                //定位正常 61gps 161网络（包括WiFi及数据）  66离线
                var erra = {
                  code: data.stateCode,
                  message: null
                },
                post_data = {},
                code = [61,161,66];
                var infoAray = new Map();
                infoAray.set(62,"获取位置权限失败，请手动开启");
                infoAray.set(63,"请确认当前测试手机网络是否通畅");
                infoAray.set(67,"请连接网络重试");
                infoAray.set(162,"请求串密文解析失败,请联系管理员");
                infoAray.set(167,"请您检查是否禁用获取位置信息权限");
                angular.forEach(infoAray,function(item,index,map){
                  if(data.stateCode===index){
                    erra.message = item;
                  }
                })
                if(erra.message!=null){
                  deferred.reject(JSON.stringify(erra));   
                }else{
                  for(var a in code) {
                    if(data.stateCode===code[a]){
                      post_data = {
                        lon: data.longitude,
                        lat: data.latitude, 
                        code:data.stateCode,
                        radius:data.radius,
                        is_andro_version:true
                      };
                    }
                  }         
                  deferred.resolve(JSON.stringify(post_data));
                }
              },function(err){        
                  deferred.reject(JSON.stringify(err));                   
              });               
          }else if (ionic.Platform.isIOS()) {
              // ios google定位
              var posOptions = {
                  timeout: 10000,
                  enableHighAccuracy: false
              };
              $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
                  var post_data = {
                      lon: position.coords.longitude,
                      lat: position.coords.latitude,
                      address: null,
                      is_andro_version:false
                  }
                  deferred.resolve(JSON.stringify(post_data));
              }, function (err) {
                  deferred.reject(JSON.stringify(err));
              });            
          }
          return deferred.promise;
      }
  }
})
.factory('transGps',function(){
    
    /**
 * Created by Wandergis on 2015/7/8.
 * 提供了百度坐标（BD09）、国测局坐标（火星坐标，GCJ02）、和WGS84坐标系之间的转换
 */
    //定义一些常量
    var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
    var PI = 3.1415926535897932384626;
    var a = 6378245.0;
    var ee = 0.00669342162296594323;
    var transformlat = function(lng, lat) {
        var lat = +lat;
        var lng = +lng;
        var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
        return ret
      };
    
      var transformlng = function(lng, lat) {
        var lat = +lat;
        var lng = +lng;
        var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
        return ret
      };
    
      /**
       * 判断是否在国内，不在国内则不做偏移
       * @param lng
       * @param lat
       * @returns {boolean}
       */
      var out_of_china = function(lng, lat) {
        var lat = +lat;
        var lng = +lng;
        // 纬度3.86~53.55,经度73.66~135.05 
        return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
      };
    /**
     * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
     * 即 百度 转 谷歌、高德
     * @param bd_lon
     * @param bd_lat
     * @returns {*[]}
     */
    var bd09togcj02 = function(bd_lon, bd_lat) {
      var bd_lon = +bd_lon;
      var bd_lat = +bd_lat;
      var x = bd_lon - 0.0065;
      var y = bd_lat - 0.006;
      var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI);
      var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI);
      var gg_lng = z * Math.cos(theta);
      var gg_lat = z * Math.sin(theta);
      return [gg_lng, gg_lat]
    };
  
    /**
     * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
     * 即谷歌、高德 转 百度
     * @param lng
     * @param lat
     * @returns {*[]}
     */
    var gcj02tobd09 = function(lng, lat) {
      var lat = +lat;
      var lng = +lng;
      var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
      var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
      var bd_lng = z * Math.cos(theta) + 0.0065;
      var bd_lat = z * Math.sin(theta) + 0.006;
      return [bd_lng, bd_lat]
    };
  
    /**
     * WGS84转GCj02
     * @param lng
     * @param lat
     * @returns {*[]}
     */
    var wgs84togcj02 = function(lng, lat) {
      var lat = +lat;
      var lng = +lng;
      if (out_of_china(lng, lat)) {
        return [lng, lat]
      } else {
        var dlat = transformlat(lng - 105.0, lat - 35.0);
        var dlng = transformlng(lng - 105.0, lat - 35.0);
        var radlat = lat / 180.0 * PI;
        var magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        var sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
        dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
        var mglat = lat + dlat;
        var mglng = lng + dlng;
        return [mglng, mglat]
      }
    };
  
    /**
     * GCJ02 转换为 WGS84
     * @param lng
     * @param lat
     * @returns {*[]}
     */
    var gcj02towgs84 = function(lng, lat) {
      var lat = +lat;
      var lng = +lng;
      if (out_of_china(lng, lat)) {
        return [lng, lat]
      } else {
        var dlat = transformlat(lng - 105.0, lat - 35.0);
        var dlng = transformlng(lng - 105.0, lat - 35.0);
        var radlat = lat / 180.0 * PI;
        var magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        var sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
        dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
        mglat = lat + dlat;
        mglng = lng + dlng;
        return [lng * 2 - mglng, lat * 2 - mglat]
      }
    };

     /**
     * WGS84 转换为 BD09
     * @param lng
     * @param lat
     * @returns {*[]}
     */
    var wgs84tobd09=function(lng,lat){
      var lat = +lat;
      var lng = +lng;
      if (out_of_china(lng, lat)) {
      return [lng, lat]
      } else {
      var dlat = transformlat(lng - 105.0, lat - 35.0);
      var dlng = transformlng(lng - 105.0, lat - 35.0);
      var radlat = lat / 180.0 * PI;
      var magic = Math.sin(radlat);
      magic = 1 - ee * magic * magic;
      var sqrtmagic = Math.sqrt(magic);
      dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
      dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
      var mglat = lat + dlat;
      var mglng = lng + dlng;
      var z = Math.sqrt(mglng * mglng + mglat * mglat) + 0.00002 * Math.sin(mglat * x_PI);
      var theta = Math.atan2(mglat, mglng) + 0.000003 * Math.cos(mglng * x_PI);
      var bd_lng = z * Math.cos(theta) + 0.0065;
      var bd_lat = z * Math.sin(theta) + 0.006;
      return [bd_lng, bd_lat];
      }
  }  
    return {
      bd09togcj02: bd09togcj02,
      gcj02tobd09: gcj02tobd09,
      wgs84togcj02: wgs84togcj02,
      gcj02towgs84: gcj02towgs84,
      wgs84tobd09:wgs84tobd09
    }  
})
.factory('ImageServes',['$window',function($window){
  function _arrayBufferToBase64(buffer){
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return $window.btoa(binary);
  }
  return {
    arrayBufferToBase64:_arrayBufferToBase64,
  }
}])
.factory('cryptService',['ConstUrlSecret',function(ConstUrlSecret){
  console.log('ConstUrlSecret:'+ConstUrlSecret.key)
  var typeofObj = function(filter,args){
    return "object"===typeof(filter)&&"object"===typeof(args);
  }
  function encrypt (message, key) {
    return CryptoJS.TripleDES.encrypt(message, key).toString();
  }

  function decrypt (message, key) {
    return CryptoJS.TripleDES.decrypt(message, key).toString(CryptoJS.enc.Utf8);
  }

  var filter = function(filter,args){
    var filter = filter;
    if(typeofObj(filter,args)){
      for(var key in args){
        if( filter.hasOwnProperty(key) ) {
          if(typeofObj(filter[key],args[key])){
            filter[key] = filter(filter[key],args[key])
          }else{
            filter[key] = args[key];
          }
        }
      }
    }else{
      return false;
    }
    return filter;
  }
  var encryption = function(filter,args){ // 加密
    var filter = filter;
    if(typeofObj(filter,args)){
      for(var key in args){
        if( filter.hasOwnProperty(key) ) {
          if(typeofObj(filter[key],args[key])){
              filter[key] = encryption(filter[key],args[key]);
          }else{
            filter[key] = encrypt(args[key], ConstUrlSecret.key); // 加密
          }
        }
      }
    }else{
      return false;
    }
    return filter;
  };
  var decryption = (filter,args) => { // 解密
    var filter = filter;
    if(typeofObj(filter,args)){
      for(var key in args){
        if( filter.hasOwnProperty(key) ) {
            if(typeofObj(filter[key],args[key])){
                filter[key] = decryption(filter[key],args[key]);
            }else{
                filter[key] = decrypt(args[key], ConstUrlSecret.key); // 解密
            }
        }
      }
    }else{
      return false;
    }
    return filter;
};
  return {
    filter:filter,
    encrypt:encrypt,
    decrypt:decrypt,
    encryption:encryption,
    decryption:decryption
  }
}])
.factory('urlBaseService',['ConstServerId',function(ConstServerId){
  var maps = function(a) {
      var a = ConstServerId.value || a;
      var map = new Map();
      map.set(1,'http://localhost');
      map.set(2,'http://localhost:8000');
      map.set(3,'http://www.babuge.com');      
      var messge = 'http://localhost:80';
      angular.forEach(map,function(item,index){
          if(index===a){
              return messge=item;
          }
      });
      return messge;
  };
  return {
      maps:maps,
  }
}])
.factory('Utils',['$ionicPopup',function($ionicPopup){ // 工具集
  var showAlert = function(title,message) {
    var tit = title,msg = message;
    if(arguments.length===1){
        tit = null;
        msg = title;
    }
    var alertPopup = $ionicPopup.alert({
      title: tit||'提示',
      template: msg||'发生异常！'
    });
    alertPopup.then(function(res) {
      
    });
  };
  return {
    showAlert : showAlert,
  }
}])
.factory('rongCloudService',['Utils','ConstRongCloud',function(Utils,ConstRongCloud){
      // 初始化融云
      var init = function(back) {
        RongCloudLibPlugin.init({
            appKey: ConstRongCloud.key,
            function (ret, err) {
                if(ret.status == 'error'){
                    Utils.showAlert(err.code);
                    return back(null);
                }
                console.log(ret)
                return back(ret);
            }
        })
    };

    // 连接融云
    var connect = function(userInfo) {
        RongCloudLibPlugin.connect({
            token: userInfo.token},
            function(ret, err){
                if (ret.status == 'success'){
                    Utils.showAlert(ret.result.userId);
                }
                console.log(ret)
        });
    };

    // 获取连接状态
    var connectStatus = function() {
        RongCloudLibPlugin.getConnectionStatus(function (ret, err) {
            Utils.showAlert(ret.result.connectionStatus);
        })
    };

    // 断开连接
    var disconnect = function() {
        RongCloudLibPlugin.disconnect({
            isReceivePush: false
        },function(ret, err){
            Utils.showAlert(ret.status);
        }); // 断开，且不再接收 Push isReceivePush：true断开仍然接收push
    };

    // 注销登录
    var Logout = function() {
        RongCloudLibPlugin.logout(function (ret, err) {
            if (ret.status == 'error'){
                Utils.showAlert(err.code);
            }
            console.log(ret);
        }); // 断开，且不再接收 Push
    };

    // 获取当前用户信息
    var currentUser = function() {
        RongCloudLibPlugin.getCurrentUserId( function (ret, err) {
            Utils.showAlert(ret.result);
        })
    };

    // 监听连接状态：调用 init 方法之后，调用 connect 方法之前设置
    var connectionStatusListener = function() {
        RongCloudLibPlugin.setConnectionStatusListener(function(ret, err){
            Utils.showAlert(ret.result.connectionStatus);
        });
    };

    // 接收消息监听器：调用 init 方法之后，调用 connect 方法之后设置
    var receiveMessageListener = function() {
        RongCloudLibPlugin.setOnReceiveMessageListener(function (ret, err) {
            Utils.showAlert(JSON.stringify(ret.result.message)+',number--:'+ret.result.message.left);
        })
    };

    /**会话列表获取： 如果有置顶会话，则置顶会话在最前面
     *   PRIVATE // 单聊
     *   DISCUSSION	// 讨论组
     *   GROUP	// 群组
     *   CHATROOM	// 聊天室
     *   CUSTOMER_SERVICE	// 客服
     *   SYSTEM	// 系统
     */
    var conversationList = function() {
        RongCloudLibPlugin.getConversationList(function (ret, err) {
            Utils.showAlert(JSON.stringify(ret.result));
        })
    };

    /**获取某一会话消息
     * 
     * @param {conversationType:string,targetId:string} data 消息会话类型,目标id 
     * @param {function} back 
     */
    var conversation = function(data,back) {
        RongCloudLibPlugin.getConversation(data, function (ret, err) {
            Utils.showAlert(JSON.stringify(ret.result));
            if(ret.status === 'success'){
                return back(ret.result);
            }
            return back(null);
        })
    };

    /**获取某一会话最新消息
     * 消息会话类型，目标id，获取消息数量
     * @param {conversationType:string,targetId:string,count:number} data 
     * @param {*} back 
     */
    var latesMessage = function(data,back) {
        RongCloudLibPlugin.getLatestMessages(data, function (ret, err) {
            Utils.showAlert(JSON.stringify(ret.result));
            if(ret.status === 'success'){
                return back(ret.result);
            }
            return back(null);
        })
    };

    /**获取某一会话的历史消息
     * 消息会话类型，目标id，最后一条消息id（没有消息第一次调用应设置为-1），获取消息数量
     * @param {conversationType:string,targetId,oldestMessageId:number,count:number} data 
     * @param {*} back 
     */
    var historyMessages = function(data,back) {
        RongCloudLibPlugin.getHistoryMessages(data, function (ret, err) {
            Utils.showAlert(JSON.stringify(ret.result));
            if(ret.status === 'success'){
                return back(ret.result);
            }
            return back(null);
        })
    };

    var sendTextMessage = function(data,back) {
        RongCloudLibPlugin.sendTextMessage(data, function (ret, err) {
            if (ret.status == 'prepare')
                Utils.showAlert(JSON.stringify(ret.result.message) );
            else if (ret.status == 'success')
                Utils.showAlert(ret.result.message.messageId );
            else if (ret.status == 'error')
                Utils.showAlert(err.code );
        });
    };

    

    return {
      init:init,
      connect:connect,
      connectStatus:connectStatus,
    }
}])
.factory('hintService',['$cordovaToast','$ionicPopup',function($cordovaToast,$ionicPopup){
  var log = function(msg){
    console.log('该提示（$cordovaToast）不可用！android8出现通知权限关闭影响问题');
    var myPopup = $ionicPopup.show({
      title: '',
      template:'<span>'+msg+'</span>',
      scope: $scope,
      buttons: [
        {
          text: '<b>知道了</b>',
          type: 'button-calm',
          onTap: function(e) {
           // do something
          }
        },
      ]
    });
  }
  var shortBottom = function(msg){
    log(msg)
    // $cordovaToast.showShortBottom(msg).then(function(res){console.log(res)},function(err){console.log('err:'+JSON.stringify(res))});
  };
  var shortCenter = function(msg){
    log(msg)
    // $cordovaToast.showShortCenter(msg).then(function(res){console.log(res)},function(err){console.log('err:'+JSON.stringify(res))});
  };
  var shortTop = function(msg){
    log(msg)
    // $cordovaToast.showShortTop(msg).then(function(res){console.log(res)},function(err){console.log('err:'+JSON.stringify(res))});
  };
  var longBottom = function(msg){
    log(msg)
    // $cordovaToast.showLongBottom(msg).then(function(res){console.log(res)},function(err){console.log('err:'+JSON.stringify(res))});
  };
  var longCenter = function(msg){
    log(msg)
    // $cordovaToast.showLongCenter(msg).then(function(res){console.log(res)},function(err){console.log('err:'+JSON.stringify(res))});
  };
  var longTop = function(msg){
    log(msg)
    // $cordovaToast.showLongTop(msg).then(function(res){console.log(res)},function(err){console.log('err:'+JSON.stringify(res))});
  };
  return {
    shortBottom:shortBottom,
    shortCenter:shortCenter,
    shortTop:shortTop,
    longBottom:longBottom,
    longCenter:longCenter,
    longTop:longTop,
  }
}]);
