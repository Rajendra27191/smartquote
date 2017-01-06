angular.module('sq.SmartQuoteDesktop')

.controller('SQManageUserController',['$scope','$rootScope','$log','$state','$timeout','$http','SQHomeServices','SQUserHomeServices',function($scope,$rootScope,$log,$state,$timeout,$http,SQHomeServices,SQUserHomeServices){
console.log('initialise SQManageUserController controller');
$scope.form={};
$scope.manageUser={};
$scope.isUserNameSelected=false;

$scope.today = function() {
    $scope.dt = new Date();
    return $scope.dt;
};


$scope.init=function(){
$rootScope.showSpinner();
SQUserHomeServices.GetUserList();
};

$scope.reset=function(){
$scope.manageUser={};
$scope.popup1={};
$scope.popup2={};
$scope.buttonstatus='add';
$scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd.MM.yyyy', 'shortDate'];
$scope.format = $scope.formats[1];
$scope.dateOptions = {
formatYear: 'yy',
startingDay: 1,
showWeeks: false
};
$scope.dateValid=true;
$scope.manageUser={'userValidFrom':$scope.today(),'userValidTo':$scope.today()};
};

$scope.resetForm=function(){
	$scope.form.userManageUser.submitted=false;
	$scope.form.userManageUser.$setPristine();
};

$scope.reset();
$scope.init();

$scope.resetOnBackspace = function (event) {
    if (event.keyCode === 8) {
        $scope.reset();
        $scope.resetForm();
    }

};
$scope.userNameSelected=function(){
console.log("userNameSelected")
if ($scope.isUserNameSelected) {
$scope.buttonstatus='add';
var tempcode=$scope.manageUser.userName;
$scope.reset();
$scope.resetForm();
$scope.manageUser.userName = tempcode;
}
};
//$scope.today();
$scope.open1 = function() {
$scope.popup1.opened = true;
};
$scope.open2 = function() {
$scope.popup2.opened = true;
};

$scope.userValidFromDateChanged=function(userValidFromDate){
//console.log(userValidFrom)
};

$scope.validateDate=function(dateFrom,dateTo){
	//console.log("validateDate")
	if(dateFrom&&dateTo){
		var date1=moment(dateFrom).format('YYYY-MM-DD');
		var date2=moment(dateTo).format('YYYY-MM-DD');
		//console.log(date1,date2);
		if (date2>date1) {
			$scope.dateValid=true;
		}else{
			$scope.dateValid=false;
		}
	}

}
/*=========================SAVE USER================================*/
$scope.userTypeChanged=function(userType){
	//console.log("userTypeChanged");
	//console.log(userType);
};

$scope.jsonToCreateUser=function(){
	var user={};
	if ($scope.buttonstatus=='add'){
		user={
		"userGroupId":$scope.manageUser.userType.key,
		"userName":$scope.manageUser.userName,
		"userType":$scope.manageUser.value,
		"emailId":$scope.manageUser.userEmailId,
		"password":$scope.manageUser.userPassword,
		"contact":$scope.manageUser.userContactNo,
		"validFrom":moment($scope.manageUser.userValidFrom).format('YYYY-MM-DD'),
		"validTo":moment($scope.manageUser.userValidTo).format('YYYY-MM-DD'),};

	}else if ($scope.buttonstatus='edit'){
		user={
		"userId":$scope.manageUser.userId,
		"userGroupId":$scope.manageUser.userType.key,
		"userName":$scope.manageUser.userName,
		"userType":$scope.manageUser.value,
		"emailId":$scope.manageUser.userEmailId,
		"password":$scope.manageUser.userPassword,
		"contact":$scope.manageUser.userContactNo,
		"validFrom":moment($scope.manageUser.userValidFrom).format('YYYY-MM-DD'),
		"validTo":moment($scope.manageUser.userValidTo).format('YYYY-MM-DD'),};
	}

	
	//console.log(JSON.stringify(user));
	return JSON.stringify(user);

}

$scope.saveUser=function(userType){
	console.log("saveUser");
	if($scope.form.userManageUser.$valid){
		console.log("Form valid");
		$scope.validateDate($scope.manageUser.userValidFrom,$scope.manageUser.userValidTo);
		// console.log($scope.dateValid);
		//console.log($scope.manageUser.userType)
		if($scope.dateValid){
		if ($scope.buttonstatus=='add') {
		var	userDetails=$scope.jsonToCreateUser();
		$rootScope.showSpinner();
		SQUserHomeServices.SaveUser(userDetails);
		}else if ($scope.buttonstatus=='edit'){
			//console.log("UPDATE")
			// if($scope.manageUser.userType.value){
			// }else{
			// 	$rootScope.userGroups.forEach(function(element,index){
			// 		if($scope.manageUser.userType==element.value){
			// 			$scope.manageUser.userType=element;
			// 		}
			// 	});
			// }
			var	userDetails=$scope.jsonToCreateUser();
			$rootScope.showSpinner();
			SQUserHomeServices.UpdateUserDetails(userDetails);
		}	
		}else{
			$scope.dateValid=false;
		}
	}else{
		console.log("Form invalid");
		console.log($scope.manageUser);
		$scope.form.userManageUser.submitted=true;


	}
	
};

$scope.handleSaveUserDoneResponse=function(data){
//console.log(data)	;
if(data){
  if(data.code.toUpperCase()=='SUCCESS'){   
	$scope.isUserNameSelected=false;
	$scope.reset();
	$scope.resetForm();
	$scope.init();
	//console.log($scope.form.userManageUser);
	$rootScope.alertSuccess("Successfully saved user");
}else{
	$rootScope.alertError(data.message);
}
}
$rootScope.hideSpinner();
};

var cleanupEventSaveUserDone = $scope.$on("SaveUserDone", function(event, message){
$scope.handleSaveUserDoneResponse(message);      
});

var cleanupEventSaveUserNotDone = $scope.$on("SaveUserNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

$scope.handleUpdateUserDetailsDoneResponse=function(data){
if(data){
  if(data.code.toUpperCase()=='SUCCESS'){   
	$scope.reset();
	$scope.resetForm();
	$scope.init();
	//console.log($scope.form.userManageUser);
	$rootScope.alertSuccess("Successfully updated user");
}else{
	$rootScope.alertError(data.message);
}
}
$rootScope.hideSpinner();
};

var cleanupEventUpdateUserDetailsDone = $scope.$on("UpdateUserDetailsDone", function(event, message){
$scope.handleUpdateUserDetailsDoneResponse(message);      
});

var cleanupEventUpdateUserDetailsNotDone = $scope.$on("UpdateUserDetailsNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

/*==========================GET USER LIST==============================*/
$scope.handleGetUserListDoneResponse=function(data){
if(data){
  if(data.code.toUpperCase()=='SUCCESS'){   
	console.log(data)	;
	$scope.userList=data.result;
}
}
$rootScope.hideSpinner();
};

var cleanupEventGetUserListDone = $scope.$on("GetUserListDone", function(event, message){
$scope.handleGetUserListDoneResponse(message);      
});

var cleanupEventGetUserListNotDone = $scope.$on("GetUserListNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});
/*==========================================================================*/
/*========================GET USER DETAILS================================*/
$scope.userNameChanged=function(user){
//console.log("userNameChanged====")
//console.log(user);
$rootScope.showSpinner();
SQUserHomeServices.GetUserDetails(user.key);
};

$scope.setDate = function(year, month, day) {
	console.log(year, month, day);
    var dt = new Date(year, month, day);
    console.log(dt);
    return dt;
 };

$scope.setUserDetails=function(userdata){
console.log(userdata);
var validFrom=userdata.validFrom;
var validTo=userdata.validTo;

var tempFrom=moment(validFrom).subtract(1, 'months').format('YYYY-MM-DD');
var fromMonth = moment(tempFrom).format('MM');
var fromDay   = moment(tempFrom).format('DD');
var fromYear  = moment(tempFrom).format('YYYY');
validFrom=$scope.setDate(fromYear,fromMonth,fromDay);
var tempTo=moment(validTo).subtract(1, 'months').format('YYYY-MM-DD');
var toMonth = moment(tempTo).format('MM');
var toDay   = moment(tempTo).format('DD');
var toYear  = moment(tempTo).format('YYYY');
validTo=$scope.setDate(toYear,toMonth,toDay);

var userType='';
console.log($rootScope.userGroups)
$rootScope.userGroups.forEach(function(element,index){
	if(element.key==userdata.userGroupId){
		userType=element;
	}
});

console.log("userType")
console.log(userType)
$scope.manageUser={
	'userId':userdata.userId,
	'userName':userdata.userName,'userType':userType,
	'userPassword':userdata.password,'userConfirmPassword':userdata.password,
	'userEmailId':userdata.emailId,'userContactNo':userdata.contact,
	'userValidFrom':validFrom,
	'userValidTo':validTo,
};

};

$scope.handleGetUserDetailsDoneResponse=function(data){
if(data){
  if(data.code.toUpperCase()=='SUCCESS'){   
	console.log(data);
	$scope.setUserDetails(data.objUserBean);
	$scope.buttonstatus='edit';
	$scope.isUserNameSelected=true;
}
}
$rootScope.hideSpinner();
};

var cleanupEventGetUserDetailsDone = $scope.$on("GetUserDetailsDone", function(event, message){
$scope.handleGetUserDetailsDoneResponse(message);      
});

var cleanupEventGetUserDetailsNotDone = $scope.$on("GetUserDetailsNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});

/*===========================DELETE USER=============================*/
$scope.deleteUser=function(){
if($scope.manageUser.userId){
$rootScope.showSpinner();
SQUserHomeServices.DeleteUser($scope.manageUser.userId);	
}
};

$scope.handleDeleteUserDoneResponse=function(data){
if(data){
  if(data.code.toUpperCase()=='SUCCESS'){   
	$scope.reset();
	$scope.resetForm();
	$scope.init();
	console.log(data)
	$rootScope.alertSuccess("Successfully deleted user");
}else{
	$rootScope.alertError(data.message);
}
}
$rootScope.hideSpinner();
};

var cleanupEventDeleteUserDone = $scope.$on("DeleteUserDone", function(event, message){
$scope.handleDeleteUserDoneResponse(message);      
});

var cleanupEventDeleteUserNotDone = $scope.$on("DeleteUserNotDone", function(event, message){
$rootScope.alertServerError("Server error");
$rootScope.hideSpinner();
});
/*=============================================*/


$scope.$on('$destroy', function(event, message) {
	cleanupEventSaveUserDone();
	cleanupEventSaveUserNotDone();
	cleanupEventUpdateUserDetailsDone();
	cleanupEventUpdateUserDetailsNotDone();
	cleanupEventDeleteUserDone();
	cleanupEventDeleteUserNotDone();
	cleanupEventGetUserDetailsDone();
	cleanupEventGetUserDetailsNotDone();
	cleanupEventGetUserListDone();
	cleanupEventGetUserListNotDone();

});

}]);