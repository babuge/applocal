angular.module('time-hq.directive',[])
.directive('hqTimedirective',['$ionicScrollDelegate','$rootScope',function($ionicScrollDelegate,$rootScope){
    var link = function(scope,element,attr,contro){
        console.log(element)
        console.log('geting',scope.message);
        console.log('initData',scope.mainObj);
        scope.itemArray = [{
            name:"year",
            value:['',2018,2017,2016,2015,2014,2013,2012,' '],
        },{
            name:"month",
            value:['','01','02','03','04','05','06','07','08','09','10','11','12',' '],
        }];
        
        scope.itemLength = parseInt(100 / scope.itemArray.length)+'%';
        element[0].offsetParent.getElementsByClassName('popup')[0].style.width="80%";
        console.log()
    
        var distanceSave = [0,0,0,0,0,0],selectIndex=[2018,01,01,0,0,0];
        var returnIndex = function(name) {
            switch (name){
                case 'year': return 0;
                case 'month': return 1;
                case 'day': return 2;
                case 'hour': return 3;
                case 'minute': return 4;
                case 'second': return 5;
            }
        }
        scope.domEdit = function(number,name,type) {
            var dom =  element[0].getElementsByClassName(name);
            scope.calculate(number,dom,dom[(number+1)*2-1].scrollTop,type); 
        };
        scope.calculate = function(number,dom,distance,type) {
            // verfiy
            var top = parseInt(distance / 40) * 40 + Math.round( (distance % 40) / 40) * 40;
            console.log(top)
            if(top==distanceSave[number]) return;
            distanceSave[number] = top;
            scope.render(number,dom,top);
            selectIndex[returnIndex(type)] = scope.itemArray[returnIndex(type)].value[top/40+1];
            console.log(selectIndex);
            var date = selectIndex[0]+'/' + selectIndex[1]+'/' + selectIndex[2]+' ' + selectIndex[3]+':' + selectIndex[4]+':' + selectIndex[5];
            // send
            var data ={
                ing:true,
                value:new Date(date).getTime(),
            };
            scope.sendMessage(data);
        }
        scope.render = function(number,dom,distance) {
            dom[number*2].scrollTop = distance;
        }
        scope.sendMessage = function (meg){
            scope.setDateMessege(meg);
        }
        scope.scrollIng = function(number,name,type) {
            scope.domEdit(number,name,type);
        };
    };
    return {
        restrict: 'E',
        scope: true,
        replace:true,
        templateUrl:'time-hq.html',
        link: link,
    }
    
}]);