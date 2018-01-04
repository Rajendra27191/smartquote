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

// ================ Send Reminder============
$scope.search={};
$scope.initSendReminderLastCall="";
$scope.fileDetailList=[];
$scope.customerDetailList=[];
$scope.duration={id:0,value:'all'}
// $scope.duration=$scope.reminderStatus[0];
$scope.reminderStatus=[
{id:0,value:'all'},
{id:1,value:'30'},
{id:2,value:'60'},
{id:3,value:'90'},
];
// $scope.items = [];
//   $scope.selectedItem = { name: 'two', id: 27 };
//   $scope.items = [{name: 'one', id: 30 },{ name: 'two', id: 27 },{ name: 'threex', id: 50 }];
//   $scope.changeItem=function(){
//     alert($scope.selectedItem.name)
//   }
function initSend () {
$scope.showFileDetailList=true;
$scope.showFileView=false;
$scope.showCustomerInfo=false;
}

$scope.initSendReminder=function(){
  $rootScope.showSpinner();
  SQPaymentReminderFactory.GetFileDetailList();
};
$scope.handleGetFileDetailListDoneResponse=function(data){
  $scope.productDetails={};
  if(data){
    if (data.code) {
      if(data.code.toUpperCase()=='SUCCESS'){
        $scope.fileDetailList=data.result;;
      }else{
        $rootScope.alertError(data.message);
      }
    }
    $rootScope.hideSpinner();
  }
};
var cleanupEventGetFileDetailListDone = $scope.$on("GetFileDetailListDone", function(event, message){
  $scope.handleGetFileDetailListDoneResponse(message);      
});

var cleanupEventGetFileDetailListNotDone = $scope.$on("GetFileDetailListNotDone", function(event, message){
  $rootScope.alertServerError("Server error");
  $rootScope.hideSpinner();
});
//========================================================================================
$scope.sendReminderClicked=function(){
  console.log("sendReminderClicked");
  initSend();
  $scope.initSendReminder();
};

$scope.sendReminder=function(){};
//========================================================================================
function showFileView () {
$scope.showFileDetailList=false ;
$scope.showFileView=true;
$scope.showCustomerInfo=false;
}
function showCustomerInfoView () {
$scope.showFileDetailList=false;
$scope.showFileView=true;
$scope.showCustomerInfo=true;
}

$scope.openFile=function(file){
if (file) {
showFileView();
$scope.objFile=angular.copy(file);
};
};
$scope.closeFile=function(){
initSend();
};
$scope.changeDuration=function(duration){
// initSend();
$scope.duration=duration;
};

$scope.getCustomerDetailFromFile=function(){
if ($scope.objFile) {
console.log($scope.duration);
$rootScope.showSpinner();
SQPaymentReminderFactory.GetCustomerDetailFromFile($scope.objFile.fileName,$scope.objFile.fileId);
};
};
$scope.handleGetCustomerDetailFromFileDoneResponse=function(data){
  $scope.productDetails={};
  if(data){
    if (data.code) {
      if(data.code.toUpperCase()=='SUCCESS'){
        $scope.customerDetailListTemp=data.result;;
        $scope.customerDetailList=data.result;;
        showCustomerInfoView();
      }else{
        $rootScope.alertError(data.message);
      }
    }
    $rootScope.hideSpinner();
  }
};
var cleanupEventGetCustomerDetailFromFileDone = $scope.$on("GetCustomerDetailFromFileDone", function(event, message){
  $scope.handleGetCustomerDetailFromFileDoneResponse(message);      
});

var cleanupEventGetCustomerDetailFromFileNotDone = $scope.$on("GetCustomerDetailFromFileNotDone", function(event, message){
  $rootScope.alertServerError("Server error");
  $rootScope.hideSpinner();
});
//========================================================================================
$scope.isAllSelected=false;
$scope.selectedRows = [];
$scope.rows = { isAllSelected : false,};

$scope.toggleAll = function() {
  console.log($scope.rows.isAllSelected)
   var toggleStatus = $scope.rows.isAllSelected;
   angular.forEach($scope.customerDetailList, function(itm){ itm.selected = toggleStatus; });
}

 $scope.optionToggled = function(){
  var selectedList=[];
  console.log(selectedList.length)
   angular.forEach($scope.customerDetailList, function(itm){ 
    if (itm.selected) {
      var item=itm;
      selectedList.push(item);
    }
  });
  console.log(selectedList.length)
  console.log(selectedList.length==$scope.customerDetailList.length)
  if (selectedList.length==$scope.customerDetailList.length) {
    $scope.rows.isAllSelected=true;
  } else{
    $scope.rows.isAllSelected=false;
  }; 
  }

// $scope.getAllSelectedRows = function() {
// $scope.selectedRows = []; 
// var selectedRows = $filter("filter")($scope.quoteListView, {
//   selected: true
// }, true);
// angular.forEach(selectedRows, function(value, key){
//   var quote={quoteId:value.quoteId};
//   $scope.selectedRows.push(quote);
// });
// console.log("$scope.selectedRows : "+$scope.selectedRows.length)
// };

//======================= Email Format ======================
$scope.form={};
$scope.compose={};
$scope.emailConfigList=[{email: 'test@gmail.com', id: 30 },{ email: 'twotest@gmail.com', id: 27 },{ email: 'threextest@gmail.com', id: 50 }];
$scope.compose.from=$scope.emailConfigList[0];


$scope.openEmailFormatModal=function(){
 $('#emailFormatModal').modal({ keyboard: false,backdrop: 'static',show: true});
};

$scope.emailConfigChange=function(){
console.log($scope.compose)
};


$scope.getEmailFormatTemplate=function(){

}

$scope.handleGetEmailFormatTemplateDoneResponse=function(data){
  $scope.productDetails={};
  if(data){
    if (data.code) {
      if(data.code.toUpperCase()=='SUCCESS'){
      
      }else{
        $rootScope.alertError(data.message);
      }
    }
    $rootScope.hideSpinner();
  }
};
var cleanupEventGetEmailFormatTemplateDone = $scope.$on("GetEmailFormatTemplateDone", function(event, message){
  $scope.handleGetEmailFormatTemplateDoneResponse(message);      
});

var cleanupEventGetEmailFormatTemplateNotDone = $scope.$on("GetEmailFormatTemplateNotDone", function(event, message){
  $rootScope.alertServerError("Server error");
  $rootScope.hideSpinner();
});

$scope.$on('$destroy', function(event, message) {
cleanupEventUnloadFileDone();
cleanupEventUnloadFileNotDone();
cleanupEventGetFileListDone();
cleanupEventGetFileListNotDone();
cleanupEventGetEmailFormatTemplateDone();
cleanupEventGetEmailFormatTemplateNotDone();
cleanupEventGetCustomerDetailFromFileDone();
cleanupEventGetCustomerDetailFromFileNotDone();
});
});