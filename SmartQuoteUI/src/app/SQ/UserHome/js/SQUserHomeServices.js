angular.module('sq.SmartQuoteDesktop')
.factory('SQUserHomeServices', [
  '$rootScope',
  '$resource',
  '$http',
  '$state',
  '$log',
  function ($rootScope, $resource, $http, $state, $log) {
    var UserHomeServices = {
        //createUserGroup:$resource('/smartquote/createUserGroup?userGroupName=:userGroupName&checkedMenuList=:checkedMenuList', {}, {createUserGroup :{method: 'POST'}}),
      };
    var userhome = {};
    userhome.CreateUserGroup = function (userGroupName,checkedMenuList) {
      // var data={};
      // data={'userGroupName':userGroupName,'checkedMenuList':checkedMenuList}
      // UserHomeServices.createUserGroup.createUserGroup({userGroupName:userGroupName,checkedMenuList:checkedMenuList},function (success) {
      //   console.log(success);
      //   //$rootScope.$broadcast('CreateUserGroupDone', success);
      // }, function (error) {
      //   console.log(error);
      //   //$rootScope.$broadcast('CreateUserGroupNotDone', error.status);
      // });
    };

    userhome.setUserGroup = function (userGroupId){
      $http({
      method: "GET",
      url: "/smartquote/getAssignedAccess?userGroupId="+userGroupId,
      //data: $scope.additionalCategory.addCatName
      }).success(function(data, status, header, config){
        //console.log(data);
        $rootScope.$broadcast('SetUserGroupDone', data);          
      }).error(function(data, status, header, config){
        //console.log(data);
        $rootScope.$broadcast('SetUserGroupNotDone', data);
          //error
      });
    };

    userhome.saveUserGroup = function (userGroupName,checkedMenuList){
      $http({
      method: "POST",
      url: "/smartquote/createUserGroup?userGroupName="+userGroupName+"&checkedMenuList="+checkedMenuList,
      //data: $scope.additionalCategory.addCatName
      }).success(function(data, status, header, config){
        //console.log(data);
        $rootScope.$broadcast('AddUserGroupDone', data);    
      }).error(function(data, status, header, config){
        //console.log(data);
        $rootScope.$broadcast('AddUserGroupNotDone', data); 
      });
    };

    userhome.editUserGroup = function (userGroupId,checkedMenuList){
      $http({
      method: "POST",
      url: "/smartquote/updateUserGroup?userGroupId="+userGroupId+"&checkedMenuList="+checkedMenuList,
      //data: $scope.additionalCategory.addCatName
      }).success(function(data, status, header, config){
        //console.log("Edit success");
        //console.log(data);
        $rootScope.$broadcast('EditUserGroupDone', data); 
      }).error(function(data, status, header, config){
        //console.log(data);
        $rootScope.$broadcast('EditUserGroupNotDone', data);
      });
    };

     userhome.deleteUserGroup = function (userGroupId){
      $http({
      method: "POST",
      url: "/smartquote/deleteUserGroup?userGroupId="+userGroupId,
      //data: $scope.additionalCategory.addCatName
      }).success(function(data, status, header, config){
        //console.log("delete success");
        //console.log(data);
        $rootScope.$broadcast('DeleteUserGroupDone', data); 
      }).error(function(data, status, header, config){
        //console.log(data);
        $rootScope.$broadcast('DeleteUserGroupNotDone', data);
      });
    };
/*===================Create USer Starts====================*/
    userhome.SaveUser = function (userDetails){
      console.log(userDetails)
      $http({
      method: "POST",
      url: "/smartquote/createUser?userDetails="+userDetails,
      //data: $scope.additionalCategory.addCatName
      }).success(function(data, status, header, config){
        console.log("saveUser success");
        console.log(data);
        $rootScope.$broadcast('SaveUserDone', data); 
      }).error(function(data, status, header, config){
        console.log(data);
        $rootScope.$broadcast('SaveUserNotDone', data);
      });
    }; 

    userhome.GetUserList = function (){
      $http({
      method: "POST",
      url: "/smartquote/getUserList",
      //data: $scope.additionalCategory.addCatName
      }).success(function(data, status, header, config){
        //console.log("saveUser success");
        //console.log(data);
        $rootScope.$broadcast('GetUserListDone', data); 
      }).error(function(data, status, header, config){
        //console.log(data);
        $rootScope.$broadcast('GetUserListNotDone', data);
      });
    };

     userhome.GetUserDetails = function (userId){
      console.log(userId)
      $http({
      method: "POST",
      url: "/smartquote/getUserDetails?userId="+userId,
      //data: $scope.additionalCategory.addCatName
      }).success(function(data, status, header, config){
        //console.log("GetUserDetails success");
        //console.log(data);
        $rootScope.$broadcast('GetUserDetailsDone', data); 
      }).error(function(data, status, header, config){
        //console.log(data);
        $rootScope.$broadcast('GetUserDetailsNotDone', data);
      });
    };

    userhome.UpdateUserDetails = function (userDetails){
      //console.log(userDetails)
      $http({
      method: "POST",
      url: "/smartquote/updateUserDetails?userDetails="+userDetails,
      //data: $scope.additionalCategory.addCatName
      }).success(function(data, status, header, config){
        //console.log("EditUser success");
        //console.log(data);
        $rootScope.$broadcast('UpdateUserDetailsDone', data); 
      }).error(function(data, status, header, config){
        //console.log(data);
        $rootScope.$broadcast('UpdateUserDetailsNotDone', data);
      });
    };

     userhome.DeleteUser = function (userId){
      $http({
      method: "POST",
      url: "/smartquote/deleteUser?userId="+userId,
      //data: $scope.additionalCategory.addCatName
      }).success(function(data, status, header, config){
        //console.log("delete success");
        //console.log(data);
        $rootScope.$broadcast('DeleteUserDone', data); 
      }).error(function(data, status, header, config){
        //console.log(data);
        $rootScope.$broadcast('DeleteUserNotDone', data);
      });
    };


    return userhome;
  }
]);

