angular.module('sq.SmartQuoteDesktop')
.factory('SQHomeServices', [
  '$rootScope',
  '$resource',
  '$http',
  '$state',
  '$log',
  function ($rootScope, $resource, $http, $state, $log) {
    var HomeServices = {
        getUserGroupMenu:$resource('/smartquote/getMenuAndSubmenu ',{}, {getUserGroupMenu :{method: 'POST'}}),
        getUserGroup:$resource('/smartquote/getUserGroups',{}, {getUserGroupInfo :{method: 'POST'}})
      };
    var home = {};
    home.GetUserGroupMenu = function () {
      $http({
      method: "POST",
      url: "/smartquote/getMenuAndSubmenu",
      }).success(function(data, status, header, config){
        console.log(data);
        if (data.code=="sessionTimeOut") {
        $rootScope.$broadcast('SessionTimeOut', data);   
        }else{
        $rootScope.$broadcast('GetUserGroupMenuDone', data);     
        }
      }).error(function(data, status, header, config){
        console.log(data);
        $rootScope.$broadcast('GetUserGroupMenuNotDone', data);
          //error
      });
    };

    home.GetUserGroupInfo = function () {
      $http({
      method: "POST",
      url: "/smartquote/getUserGroups",
      }).success(function(data, status, header, config){
        console.log(data);
        if (data.code=="sessionTimeOut") {
        $rootScope.$broadcast('SessionTimeOut', data);   
        }else{
        $rootScope.$broadcast('GetUserGroupInfoDone', data);     
        }
      }).error(function(data, status, header, config){
        console.log(data);
        $rootScope.$broadcast('GetUserGroupInfoNotDone', data);
          //error
      });
    };

    home.userLogIn = function (email,password) {
      //console.log(email,password)
      $http({
      method: "POST",
      url: "/smartquote/login?email="+email+"&password="+password,
      }).success(function(data, status, header, config){
        //console.log("Login Success");
        //console.log(data);
        $rootScope.$broadcast('UserLogInDone', data);          
      }).error(function(data, status, header, config){
        console.log(data);
        $rootScope.$broadcast('UserLogInNotDone', data);
          //error
      });
    };

    home.userLogOut = function () {
      //console.log(email,password)
      $http({
      method: "POST",
      url: "/smartquote/logout",
      }).success(function(data, status, header, config){
        // console.log("Logout Success");
        // console.log(data);
        $rootScope.$broadcast('UserLogOutDone', data);          
      }).error(function(data, status, header, config){
        console.log(data);
        $rootScope.$broadcast('UserLogOutNotDone', data);
          //error
      });
    };

    home.userForgotPassword = function (email) {
      console.log(email)
      $http({
      method: "POST",
      url: "/smartquote/forgotPassword?email="+email,
      }).success(function(data, status, header, config){
        //console.log("userForgotPassword Success");
        // console.log(data);
        $rootScope.$broadcast('UserForgotPasswordDone', data);      
      }).error(function(data, status, header, config){
        console.log(data);
        $rootScope.$broadcast('UserForgotPasswordNotDone', data);
          //error
      });
    };
    
    return home;
  }
]);

