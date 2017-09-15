var app= angular.module('sq.SmartQuoteDesktop',['ui.router','ui.bootstrap','ngSanitize','ngResource','ngAnimate','angularLocalStorage','uiSwitch','angularFileUpload','datatables','cfp.hotkeys','angular-svg-round-progressbar','angularUtils.directives.dirPagination','siyfion.sfTypeahead','angucomplete-alt'])
.config(function($logProvider){
  $logProvider.debugEnabled(true);
  
})
.run(['$rootScope','$window','storage','SQHomeServices','$templateCache',function($rootScope,$window,storage,SQHomeServices,$templateCache){
   // $rootScope.showSpinner();
   // $rootScope.$on('$viewContentLoaded', function() {
   //    $templateCache.removeAll();
   // });
   $('#mySpinner').show();
   SQHomeServices.apiCallToCheckUserSession();
   if(storage.get('isUserSignIn')==null || storage.get('isUserSignIn')==''){
      $rootScope.isUserSignIn=false;
   }
   if(storage.get('userNavMenu')==null || storage.get('userNavMenu')==''){
      $rootScope.userNavMenu=[];
   }
   if(storage.get('userData')==null || storage.get('userData')==''){
      $rootScope.userData={};
   }
  storage.bind($rootScope, 'isUserSignIn',false);
  storage.bind($rootScope, 'userNavMenu',[]);
  storage.bind($rootScope, 'userData',{});
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

// $state.transitionTo('home.start');
/*================ Check user is in sesssion========================*/
$rootScope.$on("sesssion", function(event, data){
    console.log("sesssion")
    console.log(data)
    if(data.code=="success"){
      $state.transitionTo('userhome.start');
      $rootScope.isUserSignIn=true;
      $('#mySpinner').hide();
    }else{
      $state.transitionTo('home.start'); 
      $rootScope.isUserSignIn=false;
      $('#mySpinner').hide();
    }
    console.log("isUserInSession ",$rootScope.isUserSignIn);
});

// if ($rootScope.isUserSignIn) {
// $state.transitionTo('userhome.start');
// }else{
// $state.transitionTo('home.start');
// }

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
     $rootScope.userNavMenu=data.result;
     $rootScope.userData={
                           'userId':data.userData.userId,
                           'userGroupId':data.userData.userGroupId,
                           'emailId':data.userData.emailId,
                           'contact':data.userData.contact,
                           'userName':data.userData.userName,
                           'validFrom':data.userData.validFrom,
                           'validTo':data.userData.validTo
                         }
    }
    else if (data.code.toUpperCase()=='ERROR'){
      //$rootScope.alertError(data.message);
      $scope.invalidEmailPassword=true;
      $scope.errormsg=data.message;
    }
    $rootScope.hideSpinner();
    
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
     $rootScope.isUserSignIn=false;
     $rootScope.userNavMenu=[];
     $rootScope.userData={};
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
   //$rootScope.alertError("Session Time Out Please Login To Continue");
   $state.transitionTo('userhome.start');
   $rootScope.isSessionExpired=true;
  }

  $rootScope.hideSpinner();
};

var cleanupEventSessionTimeOut = $scope.$on("SessionTimeOut", function(event, message){
  $scope.handleSessionTimeOutResponse(message);      
});

/*===============SESSION TIME OUT ENDS=====================*/
$rootScope.moveToTop=function(){
    //   $('html, body').animate({
    //     scrollTop: $("#top").offset().top
    // }, 1000);
    // $(window).scrollTop(0);
    // $(window).scrollTop(100);
     // $window.pageYOffset;
   // $anchorScroll();
   $window.scrollTo(0,0);
     // $anchorScroll.yOffset = 100
     // $location.hash('top');
    // $anchorScroll();
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
sweetAlert("Error",message, "error");
};
$rootScope.alertServerError=function(message){
sweetAlert("Oops...",message, "error");
};
$rootScope.alertSessionTimeOutOnQuote=function(){
swal({
      title: "<h4 style='color:#F8BB86'>Session Expired</h4><h4>Quote saved partially with status 'INI' </h4>",
      // text: "your quote partially saved with status 'INI' you can complete quote from Edit/View Quote.",
      html: true
});
};

//Auto Reload 
// $scope.reload = function () {
// console.log("reload executed");     
// };
// $scope.reload();
// $interval($scope.reload, 5000);



// $scope.onExit = function() {
//   console.log("onExit")
//       return ('bye bye');
// };
// $window.onbeforeunload =  $scope.onExit;



// $scope.$on('$locationChangeStart', function( event ) {
//     var answer = confirm("Are you sure you want to leave this page???")
//     if (!answer) {
//         event.preventDefault();
//     }
// });
// $(window).bind("beforeunload",function(event) {
  //     return "";
  // });

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
