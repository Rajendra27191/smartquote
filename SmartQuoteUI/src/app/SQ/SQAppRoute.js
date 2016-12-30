angular.module('sq.SmartQuoteDesktop')
.config(['$stateProvider', function($stateProvider) { 
   console.log("initialise OZAppRoute");
   $stateProvider
   .state('home', {
      abstract: true,
      controller:'SQHomeController',
      templateUrl:'SQ/Home/views/sq.home.view.html',
    })
   .state('home.start', {
      views: {
        'signin-view' : {
          templateUrl: 'SQ/Home/views/sq.signin.view.html',
        }
      }
    })
   .state('userhome', {
      abstract: true,
      controller:'SQUserHomeController',
      templateUrl:'SQ/UserHome/views/sq.user_home.tpl.html',
    })
   .state('userhome.start', {
      views: {
        'userhome-view' : {
          templateUrl: 'SQ/UserHome/views/sq.user_home.tpl.view.html',
        }
      }
    })
   .state('usergroup', {
      controller:'SQManageUserGroupController',
      templateUrl: 'SQ/UserHome/views/sq.manage_user_group.view.html',
    });

}]);