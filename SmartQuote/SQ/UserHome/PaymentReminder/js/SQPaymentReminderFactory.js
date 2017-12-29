angular.module('sq.SmartQuoteDesktop')
.factory('SQPaymentReminderFactory', [
  '$rootScope',
  '$resource',
  '$http',
  '$state',
  '$log',
  function ($rootScope, $resource, $http, $state, $log) {
       // console.log($rootScope.projectName);
    var ReminderFactory = {
      getFileListAPI:$resource($rootScope.projectName+'/getLoadedFileList', {}, {getFileListMethod :{method: 'POST'}}),
      unloadFileAPI:$resource($rootScope.projectName+'/unloadPaymentReminderFile?fileName=:name&fileId=:id', {}, {unloadFileMethod :{method: 'GET'},params:{name:'@name',id:'@id'}}),


    };
    var objFactory = {};
    var data;
    var config = {
      headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
    }

objFactory.GetFileList = function (){
// console.log("GetQuoteView")
ReminderFactory.getFileListAPI.getFileListMethod(function(success){
console.log(success);
if (success.code=="sessionTimeOut") {
  $rootScope.$broadcast('SessionTimeOut', success);   
}else{
  $rootScope.$broadcast('GetFileListDone', success); 
}
},function(error){
console.log(error);
$rootScope.$broadcast('GetFileListNotDone', error);
});
};

objFactory.UnloadFile = function (name,id){
ReminderFactory.unloadFileAPI.unloadFileMethod({name:name,id:id},function (success) {
// console.log(success);
if (success.code=="sessionTimeOut") {
$rootScope.$broadcast('SessionTimeOut', success);   
}else{
$rootScope.$broadcast('UnloadFileDone', success); 
}
}, function (error) {
// console.log(error);
$rootScope.$broadcast('UnloadFileNotDone', error);
});
};





return objFactory;
}])

