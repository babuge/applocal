angular.module('starter.controllers').controller('EchartsCtrl', function ($scope, ) {

    $scope.$on("$ionicView.enter", function () {
        //初始化 数据
        dataInit();
    })

    function dataInit() {
        // echarts bar 
        var data1 = [];
        var data2 = [];
        var data3 = [];
        var random = function (max) {
            return (Math.random() * max).toFixed(1);
        };
        for (var i = 0; i < 500; i++) {
            data1.push([random(15), random(10), random(1)]);
            data2.push([random(10), random(10), random(1)]);
            data3.push([random(15), random(10), random(1)]);
        }

        $scope.echartsDot = {
            animation: false,
            legend: {
                data: ['scatter', 'scatter2', 'scatter3'],
                top:15
            },
            tooltip: {
            },
            xAxis: {
                type: 'value',
                min: 'dataMin',
                max: 'dataMax',
                splitLine: {
                    show: false
                },
                
            },
            yAxis: {
                type: 'value',
                min: 'dataMin',
                max: 'dataMax',
                splitLine: {
                    show: true
                },
                
            },
            dataZoom: [
                // {
                //     type: 'slider',
                //     show: true,
                //     xAxisIndex: [0],
                //     start: 1,
                //     end: 35
                // },
                // {
                //     type: 'slider',
                //     show: true,
                //     yAxisIndex: [0],
                //     left: '93%',
                //     start: 29,
                //     end: 36
                // },
                // {
                //     type: 'inside',
                //     xAxisIndex: [0],
                //     start: 1,
                //     end: 35
                // },
                {
                    type: 'inside',
                    // yAxisIndex: [0],
                    start: 29,
                    end: 36
                }
            ],
            series: [
                {
                    name: 'scatter',
                    type: 'scatter',
                    itemStyle: {
                        normal: {
                            opacity: 0.8
                        }
                    },
                    symbolSize: function (val) {
                        return val[2] * 40;
                    },
                    data: data1
                },
                {
                    name: 'scatter2',
                    type: 'scatter',
                    itemStyle: {
                        normal: {
                            opacity: 0.8
                        }
                    },
                    symbolSize: function (val) {
                        return val[2] * 40;
                    },
                    data: data2
                },
                {
                    name: 'scatter3',
                    type: 'scatter',
                    itemStyle: {
                        normal: {
                            opacity: 0.8,
                        }
                    },
                    symbolSize: function (val) {
                        return val[2] * 40;
                    },
                    data: data3
                }
            ]
        };
        

        // echarts bar
        $scope.echartsBar = {
            title:{
                text: 'upChart',
                x: 'center',
                top:5
            },
            grid:{
                left: 60,
            },
            tooltip : {},
            legend: {
                // data: ['业绩'],// or [{name:'',icon:'circle',textStyle:{}}],
                data: [{
                        name:'ionic',
                        icon:'image://img/ionic.png', //'circle' | 'rectangle' | 'triangle' | 'diamond' |'emptyCircle' | 'emptyRectangle' | 'emptyTriangle' | 'emptyDiamond'                   
                        textStyle:{
                            color:'blue',
                            fontSize:'12',
                            fontWeight: 'bold',
                        }
                    },{
                        name:'baidu',
                        icon: 'image://img/baidu.png', // 'heart'（心形）、'droplet'（水滴）、'pin'（标注）、'arrow'（箭头）和'star'（五角星）
                        textStyle: {
                            color: 'green',
                            fontSize:'12',
                            fontWeight: 'bold',
                        } 
                    },{
                        name:'echarts',
                        icon: 'image://img/echarts.png', // 但无论是在系列级还是数据级上你都可以指定使用，同时，'star' + n（n>=3)可变化出N角星，如指定为'star6'则可以显示6角星
                        textStyle: {
                            color: 'oringe',
                            fontSize:'12',
                            fontWeight: 'bold',
                        }
                    }],
                y: 'bottom', // [top],bottom,center (number) 
                x:  'center', // [center],left,right (number)
                bottom:20,
                backgroundColor: 'transparent',
                borderColor: 'rgba(178,34,34,0.0)',
                padding: 10,
                itemWidth: 14, //图例 图标宽
                itemHeight: 14, //图例 图标高
            },
            xAxis:{
                type: 'category',
                data:['季度A','季度B','季度C','季度D','季度E'],
            },
            yAxis: {
                type : 'value',
                name: 'star',
                show: true, // true
                axisLabel: {
					// formatter: function (value, index) {
                    //     // 格式化成月/日，只在第一个刻度显示年份
                    //     return value%10;
                    // }
                    formatter: '{value} up'
				}
            },
            dataZoom:[{
                type: 'inside',
                start: 5, // 可缩放区域开始
                end:60  // 可缩放区域结束
            }],
            series: [{
                name: 'ionic',
                type: 'bar',
                data: [50, 200, 360, 400, 450, 600],
                itemStyle:{
                    normal:{
                      label:{
                        formatter:function(a,b,c){return c+"%";}
                      }
                    }
                  }                
            },{
                name: 'baidu',
                type: 'bar',
                data: [100,120,140,160,200,350],
                itemStyle:{
                    normal:{
                      label:{
                        formatter:function(a,b,c){return c+"%";}
                      }
                    }
                  }   
            },{
                name: 'echarts',
                type: 'bar',
                data: [100,150,180,220,280,350],
                itemStyle:{
                    normal:{
                      label:{
                        formatter:function(a,b,c){return c+"%";}
                      }
                    }
                  }   
            }],
        };
    }

    // Echarts echartsPie
    $scope.echartsPie = {
        title:{
            text: 'pie',
            x: 'center',
            top:0
        },
        tooltip:{},
        grid:{

        },
        series: [{
            name: 'echart',
            type:'pie',
            radius : '55%',
            center: ['50%', '50%'],
            data:[
                {name:'time',value:16},
                {name:'value',value:18},
                {name:'star',value:12},
            ],
            roseType: 'radius',
            label: {
                normal: {
                    textStyle: {
                        color: 'rgba(0, 0, 255, 0.3)'
                    }
                }
            },
        },{
            name: 'baidu',
            type:'pie',
            data:[
                {name:'time',value:12,},
                {name:'value',value:14},
                {name:'star',value:7},
            ],
            roseType: 'radius',
            label: {
                normal: {
                    textStyle: {
                        color: 'rgba(0, 0, 255, 0.3)'
                    },
                    backgroundColor: 'rgba(0,255,0,.6)'
                }
            },
            itemStyle: {
                shadowBlur: 200,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                opacity:0.8
            },
        }]
    }

})