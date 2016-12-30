var app= angular.module('sq.SmartQuoteDesktop',['ui.router','ui.bootstrap','ngResource','angularLocalStorage','uiSwitch'])
.run(['$rootScope','$window','storage',function($rootScope,$window,storage){
   if(storage.get('user')==null || storage.get('user')==''){
      $rootScope.user={};
   }
   if(storage.get('userSession')==null || storage.get('userSession')==''){
      $rootScope.userSession=false;
   }
    storage.bind($rootScope, 'user',{});
    storage.bind($rootScope, 'userSession',false);
}])
.controller('SmartQuoteDesktopController',['$scope','$rootScope','$window','$state','$filter','$timeout','$http','notify','SQHomeServices',function($scope,$rootScope,$window,$state,$filter,$timeout,$http,notify,SQHomeServices){
 console.log("SmartQuoteDesktopController initialise");


$window.pageYOffset;

 $scope.user={};
  $rootScope.userSignin=function(){
  if($scope.user.userName=="admin"&&$scope.user.userPassword=="admin"){
    console.log("Admin");
    $rootScope.userSession=true;
    $state.transitionTo('userhome.start');
    
    
  } 
  };
  $rootScope.userSignout=function(){
    console.log("signout")
    $rootScope.userSession=false;
      $state.transitionTo('home.start');  
  };
  SQHomeServices.GetUserGroupInfo();
  SQHomeServices.GetUserGroupMenu();

 if ($rootScope.userSession) {
 $state.transitionTo('userhome.start');
 }else{
 $state.transitionTo('home.start');
 }

	
 
	$scope.handleGetUserGroupInfoDoneResponse=function(data){
	//console.log(data)	;
    if(data){
      if(data.code.toUpperCase()=='SUCCESS'){   
      	$rootScope.userGroups={"result":data.result};
    }
	}
  $rootScope.hideSpinner();
  };

  var cleanupEventGetUserGroupInfoDone = $scope.$on("GetUserGroupInfoDone", function(event, message){
    console.log("GetUserGroupInfoDone");
    $scope.handleGetUserGroupInfoDoneResponse(message);      
  });

  var cleanupEventGetUserGroupInfoNotDone = $scope.$on("GetUserGroupInfoNotDone", function(event, message){
    console.log('Some server problem');
     $rootScope.hideSpinner();
  });

	$scope.handleGetUserGroupMenuDoneResponse=function(data){
  //console.log(data)	;
  if(data){
    if(data.code.toUpperCase()=='SUCCESS'){   
      var result=data.result;
      // console.log(data.result);
      result.forEach(function(element,index){
        if(element.menuName=='Profile'){
          element.status=true;
          console.log(element)
          element.subMenuBeans.forEach(function(submenu,index){
            //console.log(submenu)
            submenu.status=true;
          });
        }
      });
   $rootScope.userMenu=result;
   //console.log(result)
    }
   }
    $rootScope.hideSpinner();
  };

  var cleanupEventGetUserGroupMenuDone = $scope.$on("GetUserGroupMenuDone", function(event, message){
    //console.log("GetUserGroupMenuDone");
    $scope.handleGetUserGroupMenuDoneResponse(message);      
  });

  var cleanupEventGetUserGroupMenuNotDone = $scope.$on("GetUserGroupMenuNotDone", function(event, message){
    //console.log('Some server problem');
    $rootScope.hideSpinner();
  });
 
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
	cleanupEventGetUserGroupInfoDone();
	cleanupEventGetUserGroupInfoNotDone();
	cleanupEventGetUserGroupMenuDone();
	cleanupEventGetUserGroupMenuNotDone();
});

}])
.directive('sqSpinner', [
'$timeout',
function ($timeout) {
  return {
    restrict: 'EA',
    replace: true,
    template: '<div style="position:fixed;z-index:100;left:0;right:0;width:100%;height:100%;margin:auto;background:#ffffff;opacity:.4;" ng-show="spinner.isShown">' + '<center>' + '<i style="margin:250px auto;" class="fa fa-spinner fa-spin fa-3x">' + '</i>' + '</center>' + '</div>',
    controller: [
      '$scope',
      '$rootScope',
      function ($scope, $rootScope) {
        $scope.spinner = { isShown: false };
        $rootScope.showSpinner = function () {
          $scope.spinner.isShown = true;
        };
        $rootScope.hideSpinner = function () {
          $scope.spinner.isShown = false;
        };
      }
    ]
  };
}
]);

