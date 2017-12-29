angular.module('sq.SmartQuoteDesktop')
.controller('SQPaymentReminderController',function($window,$scope,$rootScope,$log,$state,$timeout,$http,$upload,SQPaymentReminderFactory){
console.log('initialise SQPaymentReminder Controller');
var latestExcelFile;
$scope.errorMessage=[];
$scope.upload={};
$scope.lastCall="";
$scope.onExcelSelect = function($files)  {
console.log("onExcelSelect");
  console.log($files);
     for (var i = 0; i < $files.length; i++) {
      if(($files[i].name.split('.').pop() == 'xlsx' || $files[i].name.split('.').pop() == 'xls')){
       console.log("valid file");
       latestExcelFile = $files[i];
      }
      else{
       console.log("invalid file");
       $scope.isValid=true;
       $timeout(function() {
       $scope.isValid=false;
            }, 3000);
        console.log('Please upload valid excel file.');
       $scope.invalidFile=true;
       latestExcelFile = {};
       document.getElementById('emailTemplate').value = '';
       }
      }
};

$scope.loadFile = function(){
  console.log(latestExcelFile)
  var reminderFile=latestExcelFile;
  var uploadUrl=$rootScope.projectName+"/loadPaymentReminderFile";
  var fd= new FormData();
  fd.append('reminderFile',reminderFile);
  fd.append('fileName',reminderFile.name);
  // console.log(fd.get('reminderFile'));
  // console.log(fd.get('hi'));
  $rootScope.showSpinner();
  $http.post(uploadUrl, fd,{
    // withCredentials: true,
    headers: {'Content-Type': undefined },
    transformRequest: angular.identity
  })
  .success(function(data, status, header, config){
    if(data.code.toUpperCase()=="SUCCESS"){
      $rootScope.alertSuccess(data.message);
      document.getElementById('emailTemplate').value = '';
      latestExcelFile = {};
      $scope.lastCall='load';
    }else if(data.code=="sessionTimeOut"){
      $rootScope.$broadcast('SessionTimeOut', data); 
    }else{
      console.log(data); 
      $rootScope.alertError(data.message);                             
      document.getElementById('emailTemplate').value = '';
      latestExcelFile = {};
    }
    $rootScope.hideSpinner();
  })
  .error(function(data, status, header, config){
    $rootScope.alertServerError("Server error");
    $rootScope.hideSpinner();
  });
};

$scope.uploadFile = function(){
  if(latestExcelFile === undefined || latestExcelFile === {} || document.getElementById('emailTemplate').value === '')
    {
      $scope.errorMessage=[];
      $scope.isRequired=true;
      $timeout(function() {
      $scope.isRequired=false;
      }, 3000);
    }else {   
    	 if ((latestExcelFile.size / 1024) < 15360) {//6144
      		console.log(latestExcelFile.size);
      		$scope.loadFile(); 
	      }else{
	          $rootScope.alertError("File size must ne less than 15MB"); 
	      }   
    }
};

//============ Unload File===============
$scope.search={};
$scope.fileList=[];
$scope.getLoadedFileList = function(){
$rootScope.showSpinner();  
SQPaymentReminderFactory.GetFileList();
};
$scope.handleGetFileListDoneResponse=function(data){
  $scope.productDetails={};
  if(data){
    if (data.code) {
      if(data.code.toUpperCase()=='SUCCESS'){
        $scope.fileList=data.result;
        $scope.lastCall="getLoadedFileList";
        $rootScope.hideSpinner();
      }else{
        $rootScope.alertError(data.message);
      }
    }
  }
};
var cleanupEventGetFileListDone = $scope.$on("GetFileListDone", function(event, message){
  $scope.handleGetFileListDoneResponse(message);      
});

var cleanupEventGetFileListNotDone = $scope.$on("GetFileListNotDone", function(event, message){
  $rootScope.alertServerError("Server error");
  $rootScope.hideSpinner();
});

$scope.initUnload =function () {
  if ( $scope.lastCall=="getLoadedFileList") {
  }else{
      $scope.getLoadedFileList ();
  };
}

$scope.unloadFile = function(file){
if (file) {
  var previousWindowKeyDown = window.onkeydown;
  swal({
  title: 'Confirm Navigation',
  text: "File data will be lost. \n Are you sure you want unload file ?",
  showCancelButton: true,
  closeOnConfirm: true,
  cancelButtonText:"Stay on Page",
  confirmButtonText:"Leave Page"
  }, function (isConfirm) {
  // window.onkeydown = previousWindowKeyDown;
  console.log("isConfirm >" + isConfirm)
  if (isConfirm) {
  $rootScope.showSpinner();
  SQPaymentReminderFactory.UnloadFile(file.value,file.key);
  } 
  });
}; 
  
};
$scope.handleUnloadFileDoneResponse=function(data){
  $scope.productDetails={};
  if(data){
    if (data.code) {
      if(data.code.toUpperCase()=='SUCCESS'){
        $rootScope.alertSuccess(data.message);
        $scope.lastCall='unload';
        $scope.initUnload();
        // $rootScope.hideSpinner();
      }else{
        $rootScope.alertError(data.message);
      }
    }
  }
};
var cleanupEventUnloadFileDone = $scope.$on("UnloadFileDone", function(event, message){
  $scope.handleUnloadFileDoneResponse(message);      
});

var cleanupEventUnloadFileNotDone = $scope.$on("UnloadFileNotDone", function(event, message){
  $rootScope.alertServerError("Server error");
  $rootScope.hideSpinner();
});


});