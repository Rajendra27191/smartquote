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
/*===============Manage User Group====================*/
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
      }).success(function(data, status, header, config){
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
      }).success(function(data, status, header, config){
        $rootScope.$broadcast('DeleteUserGroupDone', data); 
      }).error(function(data, status, header, config){
        //console.log(data);
        $rootScope.$broadcast('DeleteUserGroupNotDone', data);
      });
    };
/*===================Manage USer Starts====================*/
    userhome.SaveUser = function (userDetails){
      console.log(userDetails)
      $http({
      method: "POST",
      url: "/smartquote/createUser?userDetails="+userDetails,
      }).success(function(data, status, header, config){
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
      }).success(function(data, status, header, config){
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
      }).success(function(data, status, header, config){
        $rootScope.$broadcast('GetUserDetailsDone', data); 
      }).error(function(data, status, header, config){
        //console.log(data);
        $rootScope.$broadcast('GetUserDetailsNotDone', data);
      });
    };

    userhome.UpdateUserDetails = function (userDetails){
      $http({
      method: "POST",
      url: "/smartquote/updateUserDetails?userDetails="+userDetails,
      }).success(function(data, status, header, config){
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
      }).success(function(data, status, header, config){
        $rootScope.$broadcast('DeleteUserDone', data); 
      }).error(function(data, status, header, config){
        //console.log(data);
        $rootScope.$broadcast('DeleteUserNotDone', data);
      });
    };
/*===============Manage Customer====================*/
    userhome.GetCustomerList = function (userId){
      $http({
      method: "POST",
      url: "/smartquote/getCustomerList",
      }).success(function(data, status, header, config){
        $rootScope.$broadcast('GetCustomerListDone', data); 
      }).error(function(data, status, header, config){
        //console.log(data);
        $rootScope.$broadcast('GetCustomerListNotDone', data);
      });
    };

    userhome.GetCustomerDetails = function (customerCode){
      $http({
      method: "POST",
      url: "/smartquote/getCustomerDetails?customerCode="+customerCode,
      }).success(function(data, status, header, config){
        $rootScope.$broadcast('GetCustomerDetailsDone', data); 
      }).error(function(data, status, header, config){
        //console.log(data);
        $rootScope.$broadcast('GetCustomerDetailsNotDone', data);
      });
    };

    userhome.CreateCustomer = function (customerDetails){
      $http({
      method: "POST",
      url: "/smartquote/createCustomer?customerDetails="+customerDetails,
      }).success(function(data, status, header, config){
        console.log(data)
        $rootScope.$broadcast('CreateCustomerDone', data); 
      }).error(function(data, status, header, config){
        //console.log(data);
        $rootScope.$broadcast('CreateCustomerNotDone', data);
      });
    };
    
    userhome.UpdateCustomer = function (customerDetails){
      $http({
      method: "POST",
      url: "/smartquote/updateCustomerDetails?customerDetails="+customerDetails,
      }).success(function(data, status, header, config){
        console.log(data)
        $rootScope.$broadcast('UpdateCustomerDone', data); 
      }).error(function(data, status, header, config){
        //console.log(data);
        $rootScope.$broadcast('UpdateCustomerNotDone', data);
      });
    };
    userhome.DeleteCustomer = function (customerCode){
      $http({
      method: "POST",
      url: "/smartquote/deleteCustomer?customerCode="+customerCode,
      }).success(function(data, status, header, config){
        console.log(data)
        $rootScope.$broadcast('DeleteCustomerDone', data); 
      }).error(function(data, status, header, config){
        //console.log(data);
        $rootScope.$broadcast('DeleteCustomerNotDone', data);
      });
    };

    


    return userhome;
  }
]);

