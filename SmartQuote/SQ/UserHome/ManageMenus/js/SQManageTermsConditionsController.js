angular.module('sq.SmartQuoteDesktop')
.controller('SQManageTermsConditionsController',function($scope,$rootScope,$window,$anchorScroll,$log,$state,$timeout,SQManageMenuServices,ArrayOperationFactory){
console.log('initialise SQManageTermsConditionsController');	
$scope.form={};
$scope.termCondition={};
// $scope.termConditionList=[];
$scope.editing = [];



// $scope.init=function(){
// 	$rootScope.showSpinner();
// 	SQManageMenuServices.GetTermsConditions();
// };

// $scope.init();

// ================= GetTermsConditions List ======================
$scope.handleGetTermsConditionsDoneResponse=function(data){
// console.log(data)
if(data){
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
  // $scope.termConditionList=data.result;
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
		SQManageMenuServices.CreateTermsConditions($scope.termCondition.term);


	}else{
		$log.debug("invalid form");
		$scope.form.manageTermCondition.submitted=true;
	}
}

$scope.handleCreateTermsConditionsDoneResponse=function(data){
console.log(data)
if(data){
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
  // $scope.termConditionList=data.result;
  var obj={"code":data.genratedId,"key":data.genratedId,"value":$scope.termCondition.term}
  ArrayOperationFactory.insertIntoArrayKeyValue($rootScope.termConditionList,obj)
  $rootScope.alertSuccess("Successfully saved term & condition!");
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
var updateObj={};
$scope.updateTermAndCondition=function(term,index){
	// console.log(term)
	updateObj={};
	if (term.value && term.key) {
		$scope.updatedIndex=index;
	 	$rootScope.showSpinner();
		SQManageMenuServices.UpdateTermsConditions(term.value,term.key);
		updateObj={"code":term.key,"key":term.key,"value":term.value}
	}else{

	}
}

$scope.handleUpdateTermsConditionsDoneResponse=function(data){
// console.log(data)
if(data){
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
  // $scope.termConditionList=data.result;
  $scope.stop($scope.updatedIndex);
  ArrayOperationFactory.updateArrayKeyValue($rootScope.termConditionList,updateObj);
  $rootScope.alertSuccess("Successfully updated term & condition!");
}else if (data.code.toUpperCase()=='ERROR'){
   $rootScope.alertError(data.message);
   // $scope.init();
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
var deleteObj={};
$scope.deleteTermAndCondition=function(term){
	// console.log(term)
	deleteObj={};
	if (term.value && term.key) {
	var previousWindowKeyDown = window.onkeydown;
	swal({
	title: 'Are you sure?',
	text: "You will not be able to recover this term & condition!",
	showCancelButton: true,
	closeOnConfirm: false,
	}, function (isConfirm) {
	window.onkeydown = previousWindowKeyDown;
	if (isConfirm) {
		$rootScope.showSpinner();
		SQManageMenuServices.DeleteTermCondition(term.key);
		deleteObj={"code":term.key,"key":term.key,"value":term.value}
	} 
	});
	}
}

$scope.handleDeleteTermConditionDoneResponse=function(data){
// console.log(data)
if(data){
if (data.code) {
  if(data.code.toUpperCase()=='SUCCESS'){
  // $scope.termConditionList=data.result;
    ArrayOperationFactory.deleteFromArrayKeyValue($rootScope.termConditionList,deleteObj);
    $rootScope.alertSuccess("Successfully deleted term & condition!");
  
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

$scope.$on('$destroy', function(event, message) {
cleanupEventCreateTermsConditionsDone();
cleanupEventCreateTermsConditionsNotDone();
cleanupEventUpdateTermsConditionsDone();
cleanupEventUpdateTermsConditionsNotDone();
cleanupEventDeleteTermConditionDone();
cleanupEventDeleteTermConditionNotDone();
});

});