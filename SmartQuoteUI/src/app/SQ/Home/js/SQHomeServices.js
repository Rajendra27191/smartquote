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
        //console.log(success);
        $rootScope.$broadcast('GetUserGroupInfoDone', success);
      }, function (error) {
        //console.log(error);
        $rootScope.$broadcast('GetUserGroupInfoNotDone', error.status);
      });
    };
    
    return home;
  }
]);

