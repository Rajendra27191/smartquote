angular.module('sq.SmartQuoteDesktop')
.controller('SQManageTermsConditionsController',['$scope','$rootScope','$window','$anchorScroll','$log','$state','$timeout','SQUserHomeServices',function($scope,$rootScope,$window,$anchorScroll,$log,$state,$timeout,SQUserHomeServices){
console.log('initialise SQManageTermsConditionsController');	
$scope.form={};
$scope.termCondition={};
$scope.termConditionList=[];
$scope.editing = [];



$scope.init=function(){
	$rootScope.showSpinner();
	SQUserHomeServices.GetTermsConditions();
};

$scope.init();

// ================= GetTermsConditions List ======================
$scope.handleGetTermsConditionsDoneResponse=function(data){
// console.log(data)
if(data){
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
  $scope.termConditionList=data.result;
}
$rootScope.hideSpinner();
}
}
};

var cleanupEventGetTermsConditionsDone = $scope.$on("GetTermsConditionsDone", function(event, message){
$scope.handleGetTermsConditionsDoneResponse(message);      
});

var cleanupEventGetTermsConditionsNotDone = $scope.$on("GetTermsConditionsNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

// ================================================================

// ================= CreateTermsConditions ======================

$scope.saveTermAndCondition=function(){
	if ($scope.form.manageTermCondition.$valid) {
		$log.debug("valid form");
		// var term ={"termName":$scope.termCondition.term}
		// $scope.termConditionList.push(term);
		$rootScope.showSpinner();
		SQUserHomeServices.CreateTermsConditions($scope.termCondition.term);


	}else{
		$log.debug("invalid form");
		$scope.form.manageTermCondition.submitted=true;
	}
}

$scope.handleCreateTermsConditionsDoneResponse=function(data){
// console.log(data)
if(data){
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
  // $scope.termConditionList=data.result;
   	swal({
	  title: "Success",
	  text: "Successfully saved term & condition!",
	  type: "success",
	  // animation: "slide-from-top",
	},
	function(){
	$scope.init();
	});
  $scope.termCondition={};
  $scope.form.manageTermCondition.submitted=false;
  $scope.form.manageTermCondition.$setPristine();
}else if (data.code.toUpperCase()=='ERROR'){
   $rootScope.alertError(data.message);
}
$rootScope.hideSpinner();
}
}
};

var cleanupEventCreateTermsConditionsDone = $scope.$on("CreateTermsConditionsDone", function(event, message){
$scope.handleCreateTermsConditionsDoneResponse(message);      
});

var cleanupEventCreateTermsConditionsNotDone = $scope.$on("CreateTermsConditionsNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

// ================================================================
$scope.editTermBtnClicked=function(termConditionList,index){
// console.log(termConditionList);	
// console.log(index);	
	for(var i=0;i<termConditionList.length;i++){
        if(i == index){
          $scope.editing[i] = true;
        }else{
          $scope.editing[i] = false;
        }
      }    
};
$scope.stop = function(index){
  $scope.editing[index] = false;
};

// ================= UpdateTermsConditions ======================

$scope.updateTermAndCondition=function(term,index){
	// console.log(term)
	if (term.value && term.key) {
		$scope.updatedIndex=index;
	 	$rootScope.showSpinner();
		SQUserHomeServices.UpdateTermsConditions(term.value,term.key);

	}else{

	}
}

$scope.handleUpdateTermsConditionsDoneResponse=function(data){
// console.log(data)
if(data){
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
  // $scope.termConditionList=data.result;
   	swal({
	  title: "Success",
	  text: "Successfully updated term & condition!",
	  type: "success",
	  // animation: "slide-from-top",
	},
	function(){
	$scope.init();
	$scope.stop($scope.updatedIndex);
	});
  
}else if (data.code.toUpperCase()=='ERROR'){
   $rootScope.alertError(data.message);
   $scope.init();
}
$rootScope.hideSpinner();
}
}
};

var cleanupEventUpdateTermsConditionsDone = $scope.$on("UpdateTermsConditionsDone", function(event, message){
$scope.handleUpdateTermsConditionsDoneResponse(message);      
});

var cleanupEventUpdateTermsConditionsNotDone = $scope.$on("UpdateTermsConditionsNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

// ================================================================

// ================= DeleteTermsConditions ======================

$scope.deleteTermAndCondition=function(term){
	// console.log(term)
	if (term.value && term.key) {
	var previousWindowKeyDown = window.onkeydown;
	swal({
	title: 'Are you sure?',
	text: "You will not be able to recover this customer!",
	showCancelButton: true,
	closeOnConfirm: false,
	}, function (isConfirm) {
	window.onkeydown = previousWindowKeyDown;
	if (isConfirm) {
		$rootScope.showSpinner();
		SQUserHomeServices.DeleteTermCondition(term.key);
	} 
	});

	}else{

	}
}

$scope.handleDeleteTermConditionDoneResponse=function(data){
// console.log(data)
if(data){
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
  // $scope.termConditionList=data.result;
   	swal({
	  title: "Success",
	  text: "Successfully deleted term & condition!",
	  type: "success",
	  // animation: "slide-from-top",
	},
	function(){
	$scope.init();
	// $scope.stop($scope.updatedIndex);
	});
  
}else if (data.code.toUpperCase()=='ERROR'){
   $rootScope.alertError(data.message);
}
$rootScope.hideSpinner();
}
}
};

var cleanupEventDeleteTermConditionDone = $scope.$on("DeleteTermConditionDone", function(event, message){
$scope.handleDeleteTermConditionDoneResponse(message);      
});

var cleanupEventDeleteTermConditionNotDone = $scope.$on("DeleteTermConditionNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

	
}]);