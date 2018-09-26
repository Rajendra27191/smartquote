angular.module('sq.SmartQuoteDesktop')
.factory('SQHomeServices', [
  '$rootScope',
  '$resource',
  '$http',
  '$state',
  '$log',
  function ($rootScope, $resource, $http, $state, $log) {
   // console.log($rootScope.projectName);
    var HomeServices = {
        getUserGroupMenuAPI:$resource($rootScope.projectName+'/getMenuAndSubmenu ',{}, {getUserGroupMenuMethod :{method: 'GET'}}),
        getUserGroupAPI:$resource($rootScope.projectName+'/getUserGroups',{}, {getUserGroupInfoMethod :{method: 'GET'}}),
        userLoginAPI:$resource($rootScope.projectName+'/login?email=:email&password=:password', {}, {userLoginMethod :{method: 'GET'},params:{email:'@email',password:'@password'}}),
        userLogoutAPI:$resource($rootScope.projectName+'/logout', {}, {userLogoutMethod :{method: 'POST'}}),
        userForgotPasswordAPI:$resource($rootScope.projectName+'/forgotPassword?email=:email', {}, {userForgotPasswordMethod :{method: 'GET'},params:{email:'@email'}}),
        checkSessionActiveAPI:$resource($rootScope.projectName+'/checkSessionActive', {}, {checkSessionActiveMethod :{method: 'POST'}}),
        getUpdatedDataAPI:$resource($rootScope.projectName+'/getUpdatedData', {}, {getUpdatedDataMethod :{method: 'POST'}}),
      };
    var home = {};
    // console.log($rootScope.projectName)
    home.GetUserGroupMenu = function () {
       HomeServices.getUserGroupMenuAPI.getUserGroupMenuMethod(function (success) {
        // console.log(success);
        if (success.code=="sessionTimeOut") {
        $rootScope.$broadcast('SessionTimeOut', success);   
        }else{
        $rootScope.$broadcast('GetUserGroupMenuDone', success);     
        }
        }, function (error) {
          // console.log(data);
        $rootScope.$broadcast('GetUserGroupMenuNotDone', error);
        });
    };

    home.GetUserGroupInfo = function () {
      HomeServices.getUserGroupAPI.getUserGroupInfoMethod(function (success) {
        // console.log(success);
        if (success.code=="sessionTimeOut") {
        $rootScope.$broadcast('SessionTimeOut', success);   
        }else{
        $rootScope.$broadcast('GetUserGroupInfoDone', success);     
        }
        }, function (error) {
          // console.log(data);
        $rootScope.$broadcast('GetUserGroupInfoNotDone', error);
        });

    };

    home.userLogIn = function (email,password) {
       HomeServices.userLoginAPI.userLoginMethod({email:email,password:password},function (success) {
        // console.log("Login Success");
        // console.log(success);
        $rootScope.$broadcast('UserLogInDone', success); 
        }, function (error) {
          // console.log(error);
          $rootScope.$broadcast('UserLogInNotDone', error);
        });
    };

    home.userLogOut = function () {
        HomeServices.userLogoutAPI.userLogoutMethod(function (success) {
          console.log("Logout Success");
        //console.log(data);
        $rootScope.$broadcast('UserLogOutDone', success); 
        }, function (error) {
          $rootScope.$broadcast('UserLogOutNotDone', error);
        });
    };

    home.userForgotPassword = function (email) {
      console.log(email)
      // $http({
      // method: "POST",
      // url: "/forgotPassword?email="+email,
      // }).success(function(data, status, header, config){
      //   //console.log("userForgotPassword Success");
      //   // console.log(data);
      //   $rootScope.$broadcast('UserForgotPasswordDone', data);      
      // }).error(function(data, status, header, config){
      //   console.log(data);
      //   $rootScope.$broadcast('UserForgotPasswordNotDone', data);
      //     //error
      // });
      HomeServices.userForgotPasswordAPI.userForgotPasswordMethod({email:email},function (success) {
        console.log("Logout Success");
      //console.log(success);
     $rootScope.$broadcast('UserForgotPasswordDone', success);  
      }, function (error) {
        $rootScope.$broadcast('UserForgotPasswordNotDone', error);
      });

    };

    home.apiCallToCheckUserSession=function(){
       // HomeServices.checkSessionActiveAPI.checkSessionActiveMethod(function (success) {
        HomeServices.getUpdatedDataAPI.getUpdatedDataMethod(function (success) {
        // console.log(success);
        $rootScope.$broadcast('sesssion', success);   
        }, function (error) {
          console.log(error);
          // $rootScope.alertServerError("Server error");
          $rootScope.SQNotify("Server Error", 'error')
        });
    };

    home.getUpdatedUserData = function () {
       HomeServices.getUpdatedDataAPI.getUpdatedDataMethod(function (success) {
        // console.log("Login Success");
        // console.log(success);
        if (success.code=="sessionTimeOut") {
        $rootScope.$broadcast('SessionTimeOut', success);   
        }else{
        $rootScope.$broadcast('GetUpdatedUserDataDone', success); 
        }
        }, function (error) {
          // console.log(error);
          $rootScope.$broadcast('GetUpdatedUserDataNotDone', error);
        });
    };

    return home;
  }
]);

