angular.module('sq.SmartQuoteDesktop')
.controller('SQPaymentReminderController',function($window,$scope,$rootScope,$log,$state,$timeout,$http,$upload,SQPaymentReminderFactory,$filter){
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
  cancelButtonText:"Cancel",
  confirmButtonText:"Unload Anyway"
  }, function (isConfirm) {
  // window.onkeydown = previousWindowKeyDown;
  // console.log("isConfirm >" + isConfirm)
  if (isConfirm) {
  $rootScope.showSpinner();
  SQPaymentReminderFactory.UnloadFile(file.value,file.key);
  };
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
$scope.fileDetailList=[];
function initSend () {
$scope.search={};
$scope.initSendReminderLastCall="";
$scope.customerDetailList=[];
$scope.duration={id:0,value:'all'}
$scope.reminderStatus=[
{id:0,value:'all'},
{id:1,value:'30'},
{id:2,value:'60'},
{id:3,value:'90'},
];
$scope.showFileDetailList=true;
$scope.showFileView=false;
$scope.showCustomerInfo=false;

$scope.isAllSelected=false;
$scope.selectedRows = [];
$scope.rows = { isAllSelected : false,};


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
        $scope.fileDetailList=data.fileList;;
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

$scope.sendReminderClicked=function(){
  console.log("sendReminderClicked");
  initSend();
  $scope.initSendReminder();
};

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
        $scope.customerDetailListTemp= angular.copy(data.fileList);;
        $scope.customerDetailList=angular.copy(data.fileList);;
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
$scope.editing = [];
$scope.selectedRows = []; 
$scope.editEmailBtnClicked=function(list,index){
for(var i=0;i<list.length;i++){
if(i == index){
$scope.editing[i] = true;
// $("#"+$scope.editing[i]).focus();
}else{
$scope.editing[i] = false;
}
}    
};
var customerEmail=""
$scope.stop = function(list,index){    
$scope.editing[index] = false;
customerEmail=angular.copy($scope.customerDetailListTemp[index]);
console.log(customerEmail)
list[index]=angular.copy(customerEmail); 
};

$scope.updateEmail=function(customer,index){
console.log(index);
console.log(customer);
if (customer.email) {
$scope.customerDetailListTemp[index]=angular.copy(customer);
$scope.editing[index] = false;
} 
}

$scope.toggleAll = function() {
   var toggleStatus = $scope.rows.isAllSelected;
   angular.forEach($scope.customerDetailList, function(itm){ itm.selected = toggleStatus; });
}

 $scope.optionToggled = function(){
  var selectedList=[];
   angular.forEach($scope.customerDetailList, function(itm){ 
    if (itm.selected) {
      var item=itm;
      selectedList.push(item);
    }
  });
  if (selectedList.length==$scope.customerDetailList.length) {
    $scope.rows.isAllSelected=true;
  } else{
    $scope.rows.isAllSelected=false;
  }; 
  }

$scope.getAllSelectedRows = function() {
$scope.selectedRows = []; 
var selectedRows = $filter("filter")($scope.customerDetailList, {
  selected: true
}, true);
angular.forEach(selectedRows, function(value, key){
  var cust = value;
  $scope.selectedRows.push(cust);
});
console.log($scope.selectedRows)
console.log("$scope.selectedRows : "+$scope.selectedRows.length)
};

//======================= Email Format ======================
$scope.form={};
$scope.disabledSendBtn=true;
$scope.compose=null;
$scope.emailConfigList=[{email: 'test@gmail.com', id: 30 },{ email: 'twotest@gmail.com', id: 27 },{ email: 'threextest@gmail.com', id: 50 }];
// $scope.emailConfigList=[];
function initEmailFormatModal () {
// body...
// $scope.myText = "My name is: <h1>John Doe</h1>";
}

$scope.showEmailFormatModal=function(){
$('#emailFormatModal').modal({ keyboard: false,backdrop: 'static',show: true});
};
$scope.assignEmailFormat=function(data){
$scope.compose=angular.copy(data);
// $scope.compose.from=$scope.emailConfigList[0];
};


$scope.getEmailFormatTemplate=function(){
SQPaymentReminderFactory.GetEmailFormat();
}

$scope.handleGetEmailFormatTemplateDoneResponse=function(data){
  $scope.productDetails={};
  if(data){
    if (data.code) {
      if(data.code.toUpperCase()=='SUCCESS'){
      $scope.showEmailFormatModal();
      $scope.assignEmailFormat(data.objEmailFormatBean)
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

$scope.mailFormatBtnClicked=function(){
  initEmailFormatModal ();
  if ($scope.compose==null) {
  $scope.getEmailFormatTemplate();
  } else{
    $scope.showEmailFormatModal();
  };
};

$scope.emailConfigChange=function(){
console.log($scope.compose.from)
};


$scope.acceptEmailFormatClicked=function(){
console.log($scope.form)
if ($scope.form.emailFormat.$valid) {
$('#emailFormatModal').modal('hide');
$scope.disabledSendBtn=false;
} else{
$scope.form.emailFormat.submitted=true;
};
};

//======================================================
$scope.jsonForSendMail=function(){
var sendReminderDetail={};
var emailFormatTemp={}
emailFormatTemp={
  'from':$scope.compose.from.id,
  'subject':$scope.compose.subject,
  'body':$scope.compose.body,
}
sendReminderDetail={
'customerArrayList':$scope.selectedRows,
'emailFormat':emailFormatTemp,
'duration':$scope.duration.value,
}
return angular.toJson(sendReminderDetail);
}
$scope.sendMailBtnClicked=function(){  
  // console.log($scope.form);
$scope.getAllSelectedRows();
if ($scope.selectedRows.length>0) {
  if ($scope.compose!=null) {
    console.log($scope.jsonForSendMail());
    SQPaymentReminderFactory.SendReminder($scope.jsonForSendMail());

  };
}else{
  console.log("please select customer")
}

};

// $scope.handleGetEmailFormatTemplateDoneResponse=function(data){
//   $scope.productDetails={};
//   if(data){
//     if (data.code) {
//       if(data.code.toUpperCase()=='SUCCESS'){
//       $scope.showEmailFormatModal();
//       $scope.assignEmailFormat(data.objEmailFormatBean)
//       }else{
//         $rootScope.alertError(data.message);
//       }
//     }
//     $rootScope.hideSpinner();
//   }
// };
// var cleanupEventGetEmailFormatTemplateDone = $scope.$on("GetEmailFormatTemplateDone", function(event, message){
//   $scope.handleGetEmailFormatTemplateDoneResponse(message);      
// });

// var cleanupEventGetEmailFormatTemplateNotDone = $scope.$on("GetEmailFormatTemplateNotDone", function(event, message){
//   $rootScope.alertServerError("Server error");
//   $rootScope.hideSpinner();
// });






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