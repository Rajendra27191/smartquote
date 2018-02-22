angular.module('sq.SmartQuoteDesktop')
.controller('SQPaymentReminderController',function($window,$scope,$rootScope,$log,$state,$timeout,$http,$upload,SQPaymentReminderFactory,$filter){
console.log('initialise SQPaymentReminder Controller');
var latestExcelFile;
$scope.errorMessage=[];
$scope.upload={};


$scope.lastCall="";
$scope.onExcelSelect = function($files)  {
// console.log("onExcelSelect");
  // console.log($files);
     for (var i = 0; i < $files.length; i++) {
      if(($files[i].name.split('.').pop() == 'xml')){
       // console.log("valid file");
       latestExcelFile = $files[i];
      }
      else{
       // console.log("invalid file");
       $scope.isValid=true;
       $timeout(function() {
       $scope.isValid=false;
            }, 3000);
        // console.log('Please upload valid excel file.');
       $scope.invalidFile=true;
       latestExcelFile = {};
       document.getElementById('emailTemplate').value = '';
       }
      }
};

$scope.loadFile = function(){
  // console.log(latestExcelFile)
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
      // console.log(data); 
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

$scope.loadFileByXml = function(){
  // console.log(latestExcelFile)
  var reminderFile=latestExcelFile;
  var uploadUrl=$rootScope.projectName+"/loadPaymentReminderFileByXml";
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
      // console.log(data); 
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
      		// console.log(latestExcelFile.size);
          var fileType=latestExcelFile.name.split('.').pop();
          console.log(fileType)
        //   if (fileType=="xlsx") {
      		// $scope.loadFile();   
        //   };
          if (fileType=="xml") {
            $scope.loadFileByXml();
          };
	      }else{
	          $rootScope.alertError("File size must ne less than 15MB"); 
	      }   
    }
};
// ======================================
//============ Unload File ==============
// ======================================
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
      $scope.getLoadedFileList ();
  // if ( $scope.lastCall=="getLoadedFileList") {
  // }else{
  // };
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
    console.log(data)
    if (data.code) {
      if(data.code.toUpperCase()=='SUCCESS'){
        $rootScope.alertSuccess(data.message);
        $scope.lastCall='unload';
        $scope.initUnload();
      }else{
        $rootScope.alertError(data.message);
      }
    }
  }
    $rootScope.hideSpinner();
};

var cleanupEventUnloadFileDone = $scope.$on("UnloadFileDone", function(event, message){
  $scope.handleUnloadFileDoneResponse(message);      
});

var cleanupEventUnloadFileNotDone = $scope.$on("UnloadFileNotDone", function(event, message){
  $rootScope.alertServerError("Server error");
  $rootScope.hideSpinner();
});

// ==========================================
// ================ Send Reminder============
// ==========================================
$scope.fileDetailList=[];
$scope.initSendReminderLastCall="";
function initSend () {
$scope.search={};
$scope.customerDetailList=[];
// $scope.duration={id:0,value:'all'}
$scope.duration="";
$scope.reminderStatus=[
{id:0,value:'all'},
{id:1,value:'30'},
{id:2,value:'60'},
{id:3,value:'90'},
];
$scope.showFileDetailList=true;
$scope.showFileView=false;
$scope.showCustomerInfo=false;
$scope.disabledFileInfo=false;
$scope.isAllSelected=false;
$scope.selectedRows = [];
$scope.rows = { isAllSelected : false,};


}

$scope.initSendReminder=function(){
  $scope.fileDetailList=[];
  $rootScope.showSpinner();
  SQPaymentReminderFactory.GetFileDetailList();
};
$scope.handleGetFileDetailListDoneResponse=function(data){
  $scope.productDetails={};
  if(data){
    if (data.code) {
      if(data.code.toUpperCase()=='SUCCESS'){
        $scope.fileDetailList=data.fileLogList;;
        $scope.initSendReminderLastCall="getFileDetailList";
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
  // console.log("sendReminderClicked");
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
console.log(duration)
if(duration) {
$scope.duration=duration;
$scope.invalidDuration=false; 
}else{
$scope.invalidDuration=true; 
$scope.duration="";
}
};
$scope.resetFileInfo=function(){
$scope.duration="";
$scope.disabledFileInfo=false;
showFileView ();
// $scope.resetSendRemider();
};

$scope.getCustomerDetailFromFile=function(){
// console.log($scope.duration);
if ($scope.duration) {
if ($scope.objFile) {
$scope.invalidDuration=false;
$rootScope.showSpinner();
SQPaymentReminderFactory.GetCustomerDetailFromFile($scope.objFile.fileName,$scope.objFile.fileId);
};
}else{
  $scope.invalidDuration=true;
};

};
$scope.handleGetCustomerDetailFromFileDoneResponse=function(data){
  $scope.productDetails={};
  if(data){
    if (data.code) {
      if(data.code.toUpperCase()=='SUCCESS'){
        $scope.customerDetailListTemp= angular.copy(data.fileLogList);;
        $scope.customerDetailList=angular.copy(data.fileLogList);;
         $scope.initSendReminderLastCall="getCustomerDetailFromFile";
          showCustomerInfoView();
          $scope.disabledFileInfo=true;
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
//==================================
$scope.changeEmailId=function(customer,invalid){
  // console.log(customer)
  // console.log(invalid)
  if (invalid) {
  }else{
    if (customer) {
    if (customer.email==""||customer.email==null) {
    }else{
    $rootScope.showSpinner();  
    SQPaymentReminderFactory.ChangeEmailId(customer.customerCode,customer.fileId,customer.email);
    }
    };
  };
};
$scope.handleChangeEmailIdDoneResponse=function(data){
  $scope.productDetails={};
  if(data){
    if (data.code) {
      if(data.code.toUpperCase()=='SUCCESS'){
        console.log(data)
      }else{
        $rootScope.alertError(data.message);
      }
    }
    $rootScope.hideSpinner();
  }
};
var cleanupEventChangeEmailIdDone = $scope.$on("ChangeEmailIdDone", function(event, message){
  $scope.handleChangeEmailIdDoneResponse(message);      
});

var cleanupEventChangeEmailIdNotDone = $scope.$on("ChangeEmailIdNotDone", function(event, message){
  $rootScope.alertServerError("Server error");
  $rootScope.hideSpinner();
});
//==================================
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
// console.log(customerEmail)
list[index]=angular.copy(customerEmail); 
};

$scope.updateEmail=function(customer,index){
// console.log(index);
// console.log(customer);
if (customer.email) {
$scope.customerDetailListTemp[index]=angular.copy(customer);
$scope.editing[index] = false;
} 
}

$scope.toggleAll = function(duration) {
   var toggleStatus = $scope.rows.isAllSelected;
   console.log(duration)
   angular.forEach($scope.customerDetailList, function(itm){ 
    // console.log(itm)
    if (itm.total < 0) {
    } else{
      if (duration == '90') { 
            if (itm.march90Days > 0) {
            itm.selected = toggleStatus;
            };
      }else{
        itm.selected = toggleStatus;
      }
    };
    
  });
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
// console.log($scope.selectedRows)
// console.log("$scope.selectedRows : "+$scope.selectedRows.length)
};

$scope.validateCustomerData=function(customer,duration){
  var result = false;
  // console.log(customer)
  if (duration == "90") {
     if (customer.march90Days < 0) {
      result =true;
    };
  } 
  if (customer.total < 0) {
    result =true;
  };
  return result;
}
//===========================================================
//======================= Email Format ======================
//===========================================================
$scope.form={};
$scope.disabledSendBtn=true;
$scope.compose=null;
// $scope.emailConfigList=[{email: 'test@gmail.com', id: 30 },{ email: 'twotest@gmail.com', id: 27 },{ email: 'threextest@gmail.com', id: 50 }];
$scope.emailConfigList=[];
function initEmailFormatModal () {
// body...
// $scope.myText = "My name is: <h1>John Doe</h1>";
}

$scope.showEmailFormatModal=function(){
$('#emailFormatModal').modal({ keyboard: false,backdrop: 'static',show: true});
};
$scope.assignEmailFormat=function(data){
// $scope.compose=angular.copy(data.objEmailFormatBean);
$scope.compose={}
$scope.emailConfigList=angular.copy(data.emailFormatList);
$scope.compose.from="";

};


$scope.getEmailFormatTemplate=function(){
SQPaymentReminderFactory.GetEmailFormat();
}

$scope.handleGetEmailFormatTemplateDoneResponse=function(data){
  $scope.productDetails={};
  if(data){
    if (data.code) {
      if(data.code.toUpperCase()=='SUCCESS'){
        // console.log(data)
      $scope.assignEmailFormat(data)
      $scope.showEmailFormatModal();
       $scope.initSendReminderLastCall="getEmailFormatTemplate";
      // console.log(data)
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

$scope.assignToCompose=function(data){
$scope.compose.header=data.header;
$scope.compose.subject=data.subject;
$scope.compose.body=data.body;
};

$scope.inputReminderChanged=function(reminder,from){
  console.log("inputReminderChanged");
  console.log(reminder);
  if (reminder) {
    angular.forEach($scope.emailConfigList, function(value, key){
      if (reminder==value.templateId && from.configId ==value.configId) {
      $scope.assignToCompose(value);
      };
    });

  } else{

  };
};
$scope.inputFromChanged=function(from){
  console.log("inputFromChanged")
  // console.log(from)
  if (from) {
    $scope.showInputReminder=true;
    $scope.compose.header="";
    $scope.compose.subject="";
    $scope.compose.body="";
    $scope.compose.reminder="";
  } else{
    $scope.showInputReminder=false;
  };
};

$scope.acceptEmailFormatClicked=function(){
// console.log($scope.form)
if ($scope.form.emailFormat.$valid) {
$('#emailFormatModal').modal('hide');
$scope.disabledSendBtn=false;
} else{
$scope.form.emailFormat.submitted=true;
};
};

//======================================================

$scope.resetSendRemider=function(){
$scope.disabledFileInfo=false;
$scope.disabledSendBtn=true;
$scope.compose=null;
$scope.form.customerList.submitted=false;
$scope.form.emailFormat.submitted=false;
$scope.form.customerList.$setPristine();
$scope.form.emailFormat.$setPristine();
}
$scope.jsonForSendMail=function(){
var sendReminderDetail={};
var emailFormatTemp={}
emailFormatTemp={
  'from':$scope.compose.from.configId,
  'subject':$scope.compose.subject,
  'body':$scope.compose.body,
  'templateId':$scope.compose.reminder,
}
sendReminderDetail={
'customerArrayList':$scope.selectedRows,
'emailFormat':emailFormatTemp,
'duration':$scope.duration.value,
}
return angular.toJson(sendReminderDetail);
}

var validSelectedCustomers =true;
$scope.validateSelectedCustomerList=function(){
validSelectedCustomers =true;
$scope.getAllSelectedRows();
console.log($scope.selectedRows);
angular.forEach($scope.selectedRows, function(value, key){
      if (value.email == "" || value.email == null || value.email == " ")  {
        validSelectedCustomers = false;
      };
});

};  

$scope.sendMailBtnClicked=function(){  
  console.log($scope.form);
  console.log($scope.form.customerList.$valid);
  if ($scope.form.emailFormat.$valid) {
  $scope.validateSelectedCustomerList();  
  if (validSelectedCustomers) {
  if ($scope.selectedRows.length>0) {
    if ($scope.compose!=null) {
      console.log($scope.jsonForSendMail());
      $rootScope.showSpinner();
      SQPaymentReminderFactory.SendReminder($scope.jsonForSendMail());
    };
  }else{
    // console.log("please select customer")
    $rootScope.alertError("Please Select Customer")
  }
  }else{

  };

}
};

$scope.handleSendReminderDoneResponse=function(data){
  $scope.productDetails={};
  if(data){
    if (data.code) {
      if(data.code.toUpperCase()=='SUCCESS'){
        $rootScope.alertSuccess(data.message);
        initSend();
        $scope.resetSendRemider();
        $scope.initSendReminderLastCall="sendReminder";
      }else{
        $rootScope.alertError(data.message);
      }
    }
    $rootScope.hideSpinner();
  }
};
var cleanupEventSendReminderDone = $scope.$on("SendReminderDone", function(event, message){
  $scope.handleSendReminderDoneResponse(message);      
});

var cleanupEventSendReminderNotDone = $scope.$on("SendReminderNotDone", function(event, message){
  $rootScope.alertServerError("Server error");
  $rootScope.hideSpinner();
});

$scope.cancelSendReminderBtnClick=function(){
showFileView ();
$scope.resetSendRemider();
};
$scope.closeEmailFormatClicked=function(){
  $scope.compose={}
  $scope.showInputReminder=false;
  $scope.disabledSendBtn=true;
}

//=======================================================
//================  Email Log Code ======================
//=======================================================
function initEmailLog () {
$scope.emailLogLastCall="";
$scope.emailLogList=[];
}
$scope.rowChange=function(){
  // console.log("rowChange")
};

$scope.getEmailLog=function(){
  $rootScope.showSpinner();
  SQPaymentReminderFactory.GetEmailLogList();
};

$scope.handleGetEmailLogListDoneResponse=function(data){
  if(data){
    if (data.code) {
      if(data.code.toUpperCase()=='SUCCESS'){
      $scope.emailLogLastCall="getEmailLogList";
      $scope.emailLogList=data.emailLogList;
      }else{
        $rootScope.alertError(data.message);
      }
    }
    $rootScope.hideSpinner();
  }
};
var cleanupEventGetEmailLogListDone = $scope.$on("GetEmailLogListDone", function(event, message){
  $scope.handleGetEmailLogListDoneResponse(message);      
});

var cleanupEventGetEmailLogListNotDone = $scope.$on("GetEmailLogListNotDone", function(event, message){
  $rootScope.alertServerError("Server error");
  $rootScope.hideSpinner();
});
//===================================
$scope.emailLogTabClick=function(){
  initEmailLog();
  $scope.getEmailLog();
};
//===================================
$scope.showEmailLogDetailModal=function(){
$('#emailLogDetailModal').modal({ keyboard: false,backdrop: 'static',show: true});
};
//===================================
$scope.emailLogDetailList=[];
$scope.getEmailLogDetails=function(batchId,status){
  $rootScope.showSpinner();
  SQPaymentReminderFactory.GetEmailLogDetails(batchId,status);
};
$scope.handleGetEmailLogDetailsDoneResponse=function(data){
  $scope.emailLogDetailList=[];
  if(data){
    if (data.code) {
      if(data.code.toUpperCase()=='SUCCESS'){
      $scope.emailLogLastCall="getEmailLogDetailList";
      $scope.emailLogDetailList=data.fileLogList;
      if ($scope.emailLogDetailList.length>0) {
      $scope.showEmailLogDetailModal();
      } else{
      $rootScope.alertError("Sorry no record found");  
      };
      }else{
        $rootScope.alertError(data.message);
      }
    }
    $rootScope.hideSpinner();
  }
};
var cleanupEventGetEmailLogDetailsDone = $scope.$on("GetEmailLogDetailsDone", function(event, message){
  $scope.handleGetEmailLogDetailsDoneResponse(message);      
});

var cleanupEventGetEmailLogDetailsNotDone = $scope.$on("GetEmailLogDetailsNotDone", function(event, message){
  $rootScope.alertServerError("Server error");
  $rootScope.hideSpinner();
});

$scope.getLogDetail=function(emailLog,status){
  $scope.emailLogData=null;
  $scope.emailLogData={
    batchId:emailLog.batchId,
    fileName:emailLog.fileName,
    status:status
  }
  $scope.fileName=emailLog.fileName;
  if (status=="A") {
  $scope.sendStatus="All";
  }else if(status=="Y"){
  $scope.sendStatus="Sent";
  }else if(status=="N"){
  $scope.sendStatus="Pending";
  }else if(status=="F"){
  $scope.sendStatus="Failed";
  };

  $scope.getEmailLogDetails(emailLog.batchId,status);
};
//======================================
$scope.resendReminder=function(batchId){
  $rootScope.showSpinner();
  SQPaymentReminderFactory.ResendReminder(batchId);
};
$scope.handleResendReminderDoneResponse=function(data){

  if(data){
    if (data.code) {
      if(data.code.toUpperCase()=='SUCCESS'){
      $scope.emailLogLastCall="resendReminder";
      $('#emailLogDetailModal').modal('hide');
      $scope.emailLogTabClick();
      }else{
        $rootScope.alertError(data.message);
      }
    }
    $rootScope.hideSpinner();
  }
};
var cleanupEventResendReminderDone = $scope.$on("ResendReminderDone", function(event, message){
  $scope.handleResendReminderDoneResponse(message);      
});

var cleanupEventResendReminderNotDone = $scope.$on("ResendReminderNotDone", function(event, message){
  $rootScope.alertServerError("Server error");
  $rootScope.hideSpinner();
});
$scope.resendReminderClicked=function(batchId){
if (batchId!=null) {
$scope.resendReminder(batchId);
};
};
//=======================================================
$scope.saveAsExcel=function(batchId,status){
   var url =$rootScope.projectName+"/saveEmailLogAsExcel?batchId="+batchId+"&status="+status;
   window.open(url,'location=1,status=1,scrollbars=1,width=1050,fullscreen=yes,height=1400');
};
$scope.saveAsExcelClicked=function(emailLogData){
// console.log(emailLogData)
if (emailLogData) {
$scope.saveAsExcel(emailLogData.batchId,emailLogData.status);
} 
};
//=======================================================
//================  Abort Email Code ======================
//=======================================================
function initAbortEmail () {
$scope.abortEmailLast="";
$scope.pendingEmailList=[];
$scope.rowsAbort = { isAllSelected : false,};
}

$scope.getPendingEmailList=function(){
  $rootScope.showSpinner();
  SQPaymentReminderFactory.GetPendingEmailList();
};

$scope.handleGetPendingEmailListDoneResponse=function(data){
  if(data){
    if (data.code) {
      if(data.code.toUpperCase()=='SUCCESS'){
        $scope.pendingEmailList=[];
        $scope.pendingEmailList=data.fileLogList;
      }
    }
    $rootScope.hideSpinner();
  }
};
var cleanupEventGetPendingEmailListDone = $scope.$on("GetPendingEmailListDone", function(event, message){
  $scope.handleGetPendingEmailListDoneResponse(message);      
});

var cleanupEventGetPendingEmailListNotDone = $scope.$on("GetPendingEmailListNotDone", function(event, message){
  $rootScope.alertServerError("Server error");
  $rootScope.hideSpinner();
});
//===================================
$scope.abortEmailLogTabClick=function(){
  initAbortEmail();
  $scope.getPendingEmailList();
};
//===================================
$scope.toggleAllAbort = function() {
   // console.log($scope.rowsAbort.isAllSelected)
   var toggleStatus = $scope.rowsAbort.isAllSelected;
   angular.forEach($scope.pendingEmailList, function(itm){ 
    // console.log(itm)
    itm.selected = toggleStatus; 
  });
}

$scope.optionToggledAbort = function(){
var selectedList=[];
 angular.forEach($scope.pendingEmailList, function(itm){ 
  if (itm.selected) {
    var item=itm;
    selectedList.push(item);
  }
});
if (selectedList.length==$scope.pendingEmailList.length) {
  $scope.rowsAbort.isAllSelected=true;
} else{
  $scope.rowsAbort.isAllSelected=false;
}; 
}

$scope.getAllSelectedRowsAbort = function() {
$scope.selectedRowsForAbort = []; 
var selectedRows = $filter("filter")($scope.pendingEmailList, {
  selected: true
}, true);
angular.forEach(selectedRows, function(value, key){
  var cust = value;
  $scope.selectedRowsForAbort.push(cust);
});
};


$scope.jsonForAbortMail=function(){
var sendReminderDetail={};
sendReminderDetail={
'customerArrayList':$scope.selectedRowsForAbort,
}
return angular.toJson(sendReminderDetail);
};

$scope.abortMailBtnClicked=function(){  
  $scope.getAllSelectedRowsAbort();
  if ($scope.selectedRowsForAbort.length>0) {
      // console.log($scope.jsonForSendMail());
      // $rootScope.showSpinner();
      SQPaymentReminderFactory.AbortEmail($scope.jsonForAbortMail());
  }else{
    $rootScope.alertError("Please Select Mail To Abort")
  }
};

$scope.handleAbortEmailDoneResponse=function(data){
  $scope.productDetails={};
  if(data){
    if (data.code) {
      if(data.code.toUpperCase()=='SUCCESS'){
        // console.log(data)
        $rootScope.alertSuccess(data.message);
        $scope.abortEmailLogTabClick();

      }else{
        $rootScope.alertError(data.message);
      }
    }
    $rootScope.hideSpinner();
  }
};

var cleanupEventAbortEmailDone = $scope.$on("AbortEmailDone", function(event, message){
  $scope.handleAbortEmailDoneResponse(message);      
});

var cleanupEventAbortEmailNotDone = $scope.$on("AbortEmailNotDone", function(event, message){
  $rootScope.alertServerError("Server error");
  $rootScope.hideSpinner();
});
//=======================================================
//================ Email Upload Code ====================
//=======================================================
var latestEmailExcelFile;

$scope.onEmailExcelSelect = function($files)  {
// console.log("onExcelSelect");
  // console.log($files);
     for (var i = 0; i < $files.length; i++) {
      if(($files[i].name.split('.').pop() == 'xlsx')){
       // console.log("valid file");
       latestEmailExcelFile = $files[i];
      }
      else{
       // console.log("invalid file");
       $scope.isEmailFileValid=true;
       $timeout(function() {
       $scope.isEmailFileValid=false;
            }, 3000);
        // console.log('Please upload valid excel file.');
       $scope.invalidEmailFile=true;
       latestEmailExcelFile = {};
       document.getElementById('emailFile').value = '';
       }
      }
};

$scope.loadEmailFile = function(){
  // console.log(latestEmailExcelFile)
  var reminderFile=latestEmailExcelFile;
  var uploadUrl=$rootScope.projectName+"/loadPaymentReminderEmailFile";
  var fd= new FormData();
  fd.append('reminderFile',reminderFile);
  fd.append('fileName',reminderFile.name);
  $rootScope.showSpinner();
  $http.post(uploadUrl, fd,{
    // withCredentials: true,
    headers: {'Content-Type': undefined },
    transformRequest: angular.identity
  })
  .success(function(data, status, header, config){
    if(data.code.toUpperCase()=="SUCCESS"){
      $rootScope.alertSuccess(data.message);
      document.getElementById('emailFile').value = '';
      latestEmailExcelFile = {};
      // $scope.lastCall='load';
    }else if(data.code=="sessionTimeOut"){
      $rootScope.$broadcast('SessionTimeOut', data); 
    }else{
      // console.log(data); 
      // $rootScope.alertError(data.message);                             
      $rootScope.alertError(data.message+"\n"+"All three fields are mandatory");                             
      document.getElementById('emailFile').value = '';
      latestEmailExcelFile = {};
    }
    $rootScope.hideSpinner();
  })
  .error(function(data, status, header, config){
    $rootScope.alertServerError("Server error");
    $rootScope.hideSpinner();
  });
};

$scope.uploadEmailFile = function(){
  if(latestEmailExcelFile === undefined || latestEmailExcelFile === {} || document.getElementById('emailFile').value === '')
    {
      $scope.isEmailFileRequired=true;
      $timeout(function() {
      $scope.isEmailFileRequired=false;
      }, 3000);
    }else {   
       if ((latestEmailExcelFile.size / 1024) < 15360) {//6144
          $scope.loadEmailFile();
        }else{
          $rootScope.alertError("File size must ne less than 15MB"); 
        }   
    }
};


//===================================
$scope.$on('$destroy', function(event, message) {
cleanupEventGetFileListDone();
cleanupEventGetFileListNotDone();
cleanupEventUnloadFileDone();
cleanupEventUnloadFileNotDone();
cleanupEventGetFileDetailListDone();
cleanupEventGetFileDetailListNotDone();
cleanupEventGetCustomerDetailFromFileDone();
cleanupEventGetCustomerDetailFromFileNotDone();
cleanupEventChangeEmailIdDone();
cleanupEventChangeEmailIdNotDone();
cleanupEventGetEmailFormatTemplateDone();
cleanupEventGetEmailFormatTemplateNotDone();
cleanupEventSendReminderDone();
cleanupEventSendReminderNotDone();
cleanupEventGetEmailLogListDone();
cleanupEventGetEmailLogListNotDone();
cleanupEventGetEmailLogDetailsDone();
cleanupEventGetEmailLogDetailsNotDone();
cleanupEventResendReminderDone();
cleanupEventResendReminderNotDone();
cleanupEventGetPendingEmailListDone();
cleanupEventGetPendingEmailListNotDone();

});
});

