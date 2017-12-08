var app= angular.module('sq.SmartQuoteDesktop',['ui.router','ui.bootstrap','ngSanitize','ngResource','ngAnimate','angularLocalStorage','uiSwitch','datatables','cfp.hotkeys','angular-svg-round-progressbar','angularUtils.directives.dirPagination','siyfion.sfTypeahead','angucomplete-alt','angularFileUpload','chart.js'])
.config(function($logProvider,ChartJsProvider){
  // console.log(".config")
  $logProvider.debugEnabled(true);
     
 // ChartJsProvider.setOptions({ colors : [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] });
  
})
.run(['$rootScope','$window','storage','$templateCache',function($rootScope,$window,storage,$templateCache){
   // console.log(".run")
   // $rootScope.$on('$viewContentLoaded', function() {
   //    $templateCache.removeAll();
   // });

   $rootScope.projectName="/smartprotest";
   // $rootScope.projectName="/smartpro";
   console.log($rootScope.projectName);

   if(storage.get('isUserSignIn')==null || storage.get('isUserSignIn')==''){
      $rootScope.isUserSignIn=false;
   }
   if(storage.get('userData')==null || storage.get('userData')==''){
      $rootScope.userData={};
   }
   if(storage.get('userNavMenu')==null || storage.get('userNavMenu')==''){
      $rootScope.userNavMenu=[];
   }
   
   if(storage.get('userList')==null || storage.get('userList')==''){
      $rootScope.userList=[];
   } 
   if(storage.get('customerList')==null || storage.get('customerList')==''){
      $rootScope.customerList=[];
   }
   if(storage.get('supplierList')==null || storage.get('supplierList')==''){
      $rootScope.supplierList=[];
   }
   if(storage.get('serviceList')==null || storage.get('serviceList')==''){
      $rootScope.serviceList=[];
   }
   if(storage.get('termConditionList')==null || storage.get('termConditionList')==''){
      $rootScope.termConditionList=[];
   }
   if(storage.get('offerList')==null || storage.get('offerList')==''){
      $rootScope.offerList=[];
   }
  storage.bind($rootScope, 'isUserSignIn',false);
  storage.bind($rootScope, 'userData',{});
  storage.bind($rootScope, 'userNavMenu',[]);
  
  storage.bind($rootScope, 'userList',[]);
  storage.bind($rootScope, 'customerList',[]);
  storage.bind($rootScope, 'supplierList',[]);
  storage.bind($rootScope, 'serviceList',[]);
  storage.bind($rootScope, 'termConditionList',[]);
  storage.bind($rootScope, 'offerList',[]);
}])
.controller('SmartQuoteDesktopController',['$log','$scope','$rootScope','$window','$location','$anchorScroll','$state','$filter','$timeout','$http','notify','SQHomeServices','$interval',function($log,$scope,$rootScope,$window,$location,$anchorScroll,$state,$filter,$timeout,$http,notify,SQHomeServices,$interval){
console.log("SmartQuoteDesktopController initialise");
$window.pageYOffset;
$scope.user={};
$scope.form={};
$scope.invalidEmailPassword=false;
$scope.errormsg='';
$rootScope.isAdmin=false;
$rootScope.isSessionExpired=false;
$rootScope.isUserSignIn=false;
// $rootScope.scrollpos=0;

// $state.transitionTo('home.start');
 $('#mySpinner').show();
 SQHomeServices.apiCallToCheckUserSession();
/*================ Check user is in sesssion========================*/
 $scope.clearLocalStorageData=function(){
    $rootScope.isUserSignIn=false;
    $rootScope.userNavMenu=[];
    $rootScope.userData={};
    $rootScope.userList=[];
    $rootScope.customerList=[];
    $rootScope.supplierList=[];
    $rootScope.serviceList=[];
    $rootScope.termConditionList=[];
    $rootScope.offerList=[];
 }
$rootScope.$on("sesssion", function(event, data){
    // console.log("sesssion")
    console.log(data)
    if(data.code=="success"){
      // $('#mySpinner').hide();
      $rootScope.isUserSignIn=true;
      // $rootScope.initAuotoComplete();
      $state.transitionTo('userhome.start');
    }else{
      $state.transitionTo('home.start'); 
      $scope.clearLocalStorageData();
      $('#mySpinner').hide();
    }
    // console.log("isUserInSession ",$rootScope.isUserSignIn);
});

// if ($rootScope.isUserSignIn) {
// $state.transitionTo('userhome.start');
// }else{
// $state.transitionTo('home.start');
// }

/*===================================================*/
$rootScope.initAuotoComplete=function(){
console.log("$rootScope.initAuotoComplete...");
var timestamp = new Date().getTime();
products = new Bloodhound({
  datumTokenizer:function(d) { return Bloodhound.tokenizers.whitespace(d.value).concat(Bloodhound.tokenizers.nonword(d.value)); },
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  prefetch: {
    url: $rootScope.projectName+"/products.json?"+timestamp,
    cache: false,
    beforeSend: function(xhr){
        $rootScope.showSpinner();
        },
    filter: function (devices) {
      $rootScope.hideSpinner();
      $('#mySpinner').hide();
      return $.map(devices, function (device) {
        return {
          code: device.code,
          value : device.value
        };
      });
    }
  },
});
products.clearPrefetchCache();
products.initialize();
$rootScope.productsDataset = {
  displayKey: 'value',
  limit: 200,
// async: false,
source: products.ttAdapter(),
};
$rootScope.exampleOptions = {
  displayKey: 'title',
  highlight: true
};
};
/*===================================================*/
$rootScope.userSignin=function(){
if ($scope.form.loginUser.$valid){
  $rootScope.showSpinner();
  SQHomeServices.userLogIn($scope.user.userName,$scope.user.userPassword); 
}else{
  $scope.form.loginUser.submitted=true;
}
 
};

$scope.handleUserLogInDoneResponse=function(data){
  if(data){
    //console.log(data);  
    if(data.code){ 
    if(data.code.toUpperCase()=='SUCCESS'){ 
     $rootScope.isUserSignIn=true;
     //console.log("lllllllllllllllll");
     $state.transitionTo('userhome.start');
     $rootScope.SQNotify("Successfully log in",'success');
     $scope.user={};
     $scope.invalidEmailPassword=false;
     $rootScope.isSessionExpired=false;
     if ($scope.form.loginUser) {
     $scope.form.loginUser.submitted=false;
     $scope.form.loginUser.$setPristine();        
     }
     $rootScope.userNavMenu=data.userMenuList;
     $rootScope.userData={
                           'userId':data.userData.userId,
                           'userGroupId':data.userData.userGroupId,
                           'userType':data.userData.userType,
                           'emailId':data.userData.emailId,
                           'contact':data.userData.contact,
                           'userName':data.userData.userName,
                           'validFrom':data.userData.validFrom,
                           'validTo':data.userData.validTo
                         }
    $rootScope.userList=data.userList;
    $rootScope.customerList=data.customerList;
    $rootScope.supplierList=data.supplierList;
    $rootScope.serviceList=data.serviceList;
    $rootScope.termConditionList=data.termConditionList;
    $rootScope.offerList=data.offerList;
    // $rootScope.initAuotoComplete();
                         
    }
    else if (data.code.toUpperCase()=='ERROR'){
      //$rootScope.alertError(data.message);
      $scope.invalidEmailPassword=true;
      $scope.errormsg=data.message;
      $rootScope.hideSpinner();
    }
    
    }
}
};

var cleanupEventUserLogInDone = $scope.$on("UserLogInDone", function(event, message){
  console.log("UserLogInDone");
   console.log(message);
  $scope.handleUserLogInDoneResponse(message);      
});

var cleanupEventUserLogInNotDone = $scope.$on("UserLogInNotDone", function(event, message){
  $rootScope.SQNotify("Server error please try after some time",'failure');
  $rootScope.hideSpinner();
});

$rootScope.userSignout=function(){
  // console.log("signout")
  $rootScope.showSpinner();
  SQHomeServices.userLogOut();
};

 $scope.handleUserLogOutDoneResponse=function(data){
  if(data){
    if(data.code){
    if(data.code.toUpperCase()=='SUCCESS'){ 
     $state.transitionTo('home.start'); 
     $scope.clearLocalStorageData();
     $rootScope.SQNotify("Successfully log out",'success'); 
    }else{
    $rootScope.alertError(data.message);
    }
    $rootScope.hideSpinner();
    }
  }
};

var cleanupEventUserLogOutDone = $scope.$on("UserLogOutDone", function(event, message){
  console.log("UserLogOutDone");
  $scope.handleUserLogOutDoneResponse(message);      
});

var cleanupEventUserLogOutNotDone = $scope.$on("UserLogOutNotDone", function(event, message){
 $rootScope.alertServerError("Server error please try after some time",'error');
});
/*===================================================*/
/*============== FORGET PASSWORD===========*/
$scope.isForgotPasswordOn=false;
$scope.forgotPasswordClicked=function(){
$scope.invalidEmailPassword=false;  
$scope.isForgotPasswordOn=true;

};

$scope.cancelForgetPassword=function(){
$scope.invalidEmailPassword=false;
$scope.isForgotPasswordOn=false;
};

$scope.submitForgetPassword=function(){
if ($scope.form.forgotPassword.$valid){
console.log($scope.user.userName);
$rootScope.showSpinner();
SQHomeServices.userForgotPassword($scope.user.userName);
}else{
$scope.form.forgotPassword.submitted=true;
}

};
$scope.handleUserForgotPasswordDoneResponse=function(data){
  if(data){
    if(data.code){
    if(data.code.toUpperCase()=='SUCCESS'){ 
     $rootScope.alertSuccess("Successfully reset password, please check your inbox for new password");
     $scope.user={};
     $scope.invalidEmailPassword=false;
     $scope.form.forgotPassword.submitted=false;
     $scope.form.forgotPassword.$setPristine();
     $scope.isForgotPasswordOn=false;
    }
    else if (data.code.toUpperCase()=='ERROR'){
     // $rootScope.alertError(data.message);
     $scope.invalidEmailPassword=true;
     $scope.errormsg=data.message;
    
    }
    $rootScope.hideSpinner();
  }
}
};

var cleanupEventUserForgotPasswordDone = $scope.$on("UserForgotPasswordDone", function(event, message){
  console.log("UserForgotPasswordDone");
  console.log(message);
  $scope.handleUserForgotPasswordDoneResponse(message);      
});

var cleanupEventUserForgotPasswordNotDone = $scope.$on("UserForgotPasswordNotDone", function(event, message){
  $rootScope.alertServerError("Server error");
  $rootScope.hideSpinner();
});

/*============== FORGET PASSWORD===========*/
$rootScope.getPrice = function(price){
// console.log(price) 
var price1=parseFloat(price);
if (price1=='') {
price1=0;
} else {
price1=price1.toFixed(2);
} 
return price1;
};

/*===============SESSION TIME OUT STARTS=====================*/
$scope.redirectToLogin=function(){
  $rootScope.isUserSignIn=false;
  $rootScope.userNavMenu=[];
  $state.transitionTo('home.start');
};

$scope.handleSessionTimeOutResponse=function(data){
  if(data){
   $state.transitionTo('userhome.start');
   $rootScope.isSessionExpired=true;
   //$rootScope.alertError("Session Time Out Please Login To Continue");
  }

  $rootScope.hideSpinner();
};

var cleanupEventSessionTimeOut = $scope.$on("SessionTimeOut", function(event, message){
  $scope.handleSessionTimeOutResponse(message);      
});

/*===============SESSION TIME OUT ENDS=====================*/
$rootScope.moveToTop=function(){
  console.log("moveToTop")
   $window.pageYOffset;  
   $window.scrollTo(0,0);
}

$rootScope.SQNotify = function(message,flag)
  {
    if(flag === 'success')
    {
      notify({message:message,template:'assets/notification/views/oz.success.tpl.html',position:'center'});
    }
    else if (flag === 'failure') 
    {
       notify({message:message,template:'assets/notification/views/oz.failure.tpl.html',position:'center'});
    } 
     else if (flag === 'central') 
    {
       notify({message:message,template:'assets/notification/views/oz.central.tpl.html',position:'center'});
    }
     else if (flag === 'error') 
    {
       notify({message:message,template:'assets/notification/views/oz.error.tpl.html',position:'center'});
    } 
  };

$rootScope.alertSuccess=function(message){
sweetAlert("Success",message, "success");
};
$rootScope.alertError=function(message){
sweetAlert("Oops!",message, "error");
};
$rootScope.alertServerError=function(message){
sweetAlert("Error",message, "error");
};
$rootScope.alertSessionTimeOutOnQuote=function(){
swal({
      title: "<h4 style='color:#F8BB86'>Session Expired</h4><h4>Quote saved partially with status 'INI' </h4>",
      // text: "your quote partially saved with status 'INI' you can complete quote from Edit/View Quote.",
      html: true
});
};


$scope.checkQuoteActivated = function () {
// console.log("reload isQuoteActivated");  
// console.log($rootScope.isQuoteActivated)  ;
$(window).bind("beforeunload",function(event) {
      if ($rootScope.isQuoteActivated) {
      return "";
        
      }
}); 
// $(window).unbind('beforeunload');

  // if ($rootScope.isQuoteActivated) {
  //   $scope.$on('onBeforeUnload', function (e, confirmation) {
  //         confirmation.message = "All data willl be lost.";
  //         e.preventDefault();
  //     });
  //   $scope.$on('onUnload', function (e) {
  //     console.log('leaving page'); // Use 'Preserve Log' option in Console
  //   });
  // }else{
  //   $scope.$on('onBeforeUnload', function (e, confirmation) {
  //         confirmation.message = "All data willl be lost.";
  //         // e.preventDefault();
  //   })
  // }
};
$scope.checkQuoteActivated();
$interval($scope.checkQuoteActivated, 1000);



// $(window).scroll(function() {
//   if ($(document).scrollTop() > 50) {
//     $('nav').addClass('shrink');
//   } else {
//     $('nav').removeClass('shrink');
//   }
// });
  // $(window).scroll(function (event) {
  //   var scroll = $(window).scrollTop();
  //   $rootScope.scrollpos=scroll;
  // });
///-------------------------Confirmation Window-----------------


$scope.$on('$destroy', function(event, message) {
cleanupEventUserLogInDone();
cleanupEventUserLogInNotDone();
cleanupEventUserLogOutDone();
cleanupEventUserLogOutNotDone();
cleanupEventUserForgotPasswordDone();
cleanupEventUserForgotPasswordNotDone();
cleanupEventGetUserGroupInfoDone();
cleanupEventGetUserGroupMenuDone(); 
cleanupEventSessionTimeOut();
});


}])
.factory('beforeUnload', function ($rootScope, $window) {
    // Events are broadcast outside the Scope Lifecycle
    
    $window.onbeforeunload = function (e) {
        var confirmation = {};
        var event = $rootScope.$broadcast('onBeforeUnload', confirmation);
        if (event.defaultPrevented) {
            return confirmation.message;
        }
    };
    
    $window.onunload = function () {
        $rootScope.$broadcast('onUnload');
    };
    return {};
})
.run(function (beforeUnload) {
    // Must invoke the service at least once
});
