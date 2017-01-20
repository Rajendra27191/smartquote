var app= angular.module('sq.SmartQuoteDesktop',['ui.router','ui.bootstrap','ngResource','ngAnimate','angularLocalStorage','uiSwitch','ngFileUpload','datatables'])
.config(function($logProvider){
  $logProvider.debugEnabled(true);
  
})
.run(['$rootScope','$window','storage',function($rootScope,$window,storage){
 if(storage.get('isUserSignIn')==null || storage.get('isUserSignIn')==''){
    $rootScope.isUserSignIn=false;
 }
 if(storage.get('userNavMenu')==null || storage.get('userNavMenu')==''){
    $rootScope.userNavMenu=[];
 }
  storage.bind($rootScope, 'isUserSignIn',false);
  storage.bind($rootScope, 'userNavMenu',[]);
}])
.controller('SmartQuoteDesktopController',['$scope','$rootScope','$window','$state','$filter','$timeout','$http','notify','SQHomeServices',function($scope,$rootScope,$window,$state,$filter,$timeout,$http,notify,SQHomeServices){
console.log("SmartQuoteDesktopController initialise");
$window.pageYOffset;
$scope.user={};
$scope.form={};
$scope.invalidEmailPassword=false;
$scope.errormsg='';
$rootScope.isAdmin=false;
$rootScope.isSessionExpired=false;

if ($rootScope.isUserSignIn) {
$state.transitionTo('userhome.start');
}else{
$state.transitionTo('home.start');
}

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
  $scope.handleUserLogInDoneResponse(message);      
});

var cleanupEventUserLogInNotDone = $scope.$on("UserLogInNotDone", function(event, message){
  $rootScope.SQNotify("Server error please try after some time",'error');
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

$rootScope.SQNotify = function(message,flag)
  {
    if(flag === 'success')
    {
      notify({message:message,template:'assets/notification/views/oz.success.tpl.html',position:'center'});
    }
    else if (flag === 'error') 
    {
       notify({message:message,template:'assets/notification/views/oz.failure.tpl.html',position:'center'});
    } 
     else if (flag === 'central') 
    {
       notify({message:message,template:'assets/notification/views/oz.central.tpl.html',position:'center'});
    } 
  };

$rootScope.alertSuccess=function(message){
swal("Success",message, "success");
};
$rootScope.alertError=function(message){
sweetAlert("Error",message, "error");
};
$rootScope.alertServerError=function(message){
sweetAlert("Oops...",message, "error");
};

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

}]);
