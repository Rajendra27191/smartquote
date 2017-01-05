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
      HomeServices.getUserGroupMenu.getUserGroupMenu(function (success) {
        //console.log(success);
        $rootScope.$broadcast('GetUserGroupMenuDone', success);
      }, function (error) {
        //console.log(error);
        $rootScope.$broadcast('GetUserGroupMenuNotDone', error.status);
      });
    };

    home.GetUserGroupInfo = function () {
      HomeServices.getUserGroup.getUserGroupInfo(function (success) {
        $rootScope.$broadcast('GetUserGroupInfoDone', success);
      }, function (error) {
        //console.log(error);
        $rootScope.$broadcast('GetUserGroupInfoNotDone', error.status);
      });
    };

    home.userLogIn = function (email,password) {
      //console.log(email,password)
      $http({
      method: "POST",
      url: "/smartquote/login?email="+email+"&password="+password,
      //data: $scope.additionalCategory.addCatName
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

    home.userForgotPassword = function (email) {
      console.log(email)
      $http({
      method: "POST",
      url: "/smartquote/forgotPassword?email="+email,
      //data: $scope.additionalCategory.addCatName
      }).success(function(data, status, header, config){
        //console.log("userForgotPassword Success");
        console.log(data);
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

