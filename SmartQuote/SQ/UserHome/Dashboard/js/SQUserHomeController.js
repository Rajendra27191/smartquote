angular.module('sq.SmartQuoteDesktop')
.controller('SQUserHomeController',['$window','$scope','$rootScope','$log','$state','$timeout','SQHomeServices','$http','SQUserHomeServices',function($window,$scope,$rootScope,$log,$state,$timeout,SQHomeServices,$http,SQUserHomeServices){
console.log('initialise SQUserHomeController controller');
// $rootScope.initAuotoComplete();
// console.log("$rootScope.initDashBoard : " ,$rootScope.initDashBoard)
$window.pageYOffset;

//CODE STARTS===============================================================================================================
$rootScope.menuClicked=function(menuName){
// console.log(menuName);
if(menuName.toLowerCase()==='home'){
  if ($rootScope.isQuoteActivated) {
  $scope.showPromptWindow(menuName);
  }else{
  $scope.confirmChangeView(menuName);
  }
  // $state.transitionTo('userhome.start');
}
};

$rootScope.isQuoteActivated=false;
var changeView=false;
$scope.showPromptWindow=function(subMenuName){
  changeView=false;
  var previousWindowKeyDown = window.onkeydown;
  swal({
  title: 'Confirm Navigation',
  text: "Your unsaved data will be lost. \n Are you sure you want to leave this page ?",
  showCancelButton: true,
  closeOnConfirm: true,
  cancelButtonText:"Stay on Page",
  confirmButtonText:"Leave Page"
  }, function (isConfirm) {
    console.log("isConfirm >" + isConfirm)
  // window.onkeydown = previousWindowKeyDown;
  if (isConfirm) {
    $scope.confirmChangeView(subMenuName);
  } 
  });
};

$scope.confirmNavigationOnInitAutocomplete=function(view){
  console.log("confirmNavigationOnInitAutocomplete >> " + view )
  if ($rootScope.initAuotoCompleteDone) {
   $state.go(view, {}, {reload: true});   
  } else{
   $rootScope.alertWarning("You have to wait until product file downloads."); 
  };
}
 


$scope.confirmChangeView=function(subMenuName){
  if(subMenuName.toLowerCase()==='home'){
   $state.transitionTo('userhome.start');
  }
  if(subMenuName.toLowerCase()==='manage user group'){
  // $state.transitionTo('manageusergroup');  
  $state.go('manageusergroup', {}, {reload: true});
  }
  if(subMenuName.toLowerCase()==='manage user'){
  $state.go('manageuser', {}, {reload: true});     
  }
  if(subMenuName.toLowerCase()==='manage customer'){
   $state.go('managecustomer', {}, {reload: true});  
  }
  if(subMenuName.toLowerCase()==='manage product group'){
    $state.go('manageproductgroup', {}, {reload: true});   
  }
  if(subMenuName.toLowerCase()==='manage product'){
    $state.go('manageproduct', {}, {reload: true});  
  } 
  if(subMenuName.toLowerCase()==='upload product file'){
  $state.go('uploadproductfile', {}, {reload: true}); 
  }
  if(subMenuName.toLowerCase()==='create/edit terms and conditions'){  
  $state.go('managetermsconditions', {}, {reload: true});  
  }
  if(subMenuName.toLowerCase()==='create/edit services'){
  $state.go('manageservices', {}, {reload: true});  
  }
  if(subMenuName.toLowerCase()==='manage alternate product'){
  $state.go('managealternateproduct', {}, {reload: true});  
  }
  if(subMenuName.toLowerCase()==='create/edit offers'){
    $state.go('manageoffers', {}, {reload: true});  
  }
  if(subMenuName.toLowerCase()==='create proposal'){
  $state.go('createquote', {}, {reload: true});    
  } 
  if(subMenuName.toLowerCase()==='view/edit proposal'){
  // $state.transitionTo('vieweditquote');    
  $state.go('vieweditquote', {}, {reload: true});   
  } 
  if(subMenuName.toLowerCase()==='autosave proposal'){
    $state.go('autosavequote', {}, {reload: true});   
    $rootScope.showRestoreQuoteView = false;
  }
  if(subMenuName.toLowerCase()==='restore proposal'){    
    $state.go('restorequote', {}, {reload: true});   
  }  
  if(subMenuName.toLowerCase()==='payment reminder'){
  // $state.transitionTo('vieweditquote');    
  $state.go('paymentreminder.start', {}, {reload: true});   
  }
  if(subMenuName.toLowerCase()==='refresh products'){
    $rootScope.refreshProductFileJson();
  }
  if(subMenuName==='Logout'){
  $rootScope.userSignout(); 
  }
  $rootScope.initDashBoard=false;
};


$rootScope.subMenuClicked=function(subMenuName){
  // console.log(subMenuName);
  // console.log("isQuoteActivated >>" +$rootScope.isQuoteActivated)
  // console.log("$rootScope.initDashBoard "+$rootScope.initDashBoard)
  if ($rootScope.isQuoteActivated) {
  $scope.showPromptWindow(subMenuName);
  }else{
  $scope.confirmChangeView(subMenuName);
  }
  // $rootScope.initDashBoard=false;
};
$scope.$on('$destroy', function(event, message) {
 
 
});

}]);

