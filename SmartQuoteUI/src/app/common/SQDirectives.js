// angular.module('sq.CommonApp')
// .directive('sqSpinner', [
// '$timeout',
// function ($timeout) {
//   return {
//     restrict: 'EA',
//     replace: true,
//     template: '<div style="position:fixed;z-index:100;left:0;right:0;width:100%;height:100%;margin:auto;background:#ffffff;opacity:.4;" ng-show="spinner.isShown">' + '<center>' + '<i style="margin:250px auto;" class="fa fa-spinner fa-spin fa-3x">' + '</i>' + '</center>' + '</div>',
//     controller: [
//       '$scope',
//       '$rootScope',
//       function ($scope, $rootScope) {
//         $scope.spinner = { isShown: false };
//         $rootScope.showSpinner = function () {
//           $scope.spinner.isShown = true;
//         };
//         $rootScope.hideSpinner = function () {
//           $scope.spinner.isShown = false;
//         };
//       }
//     ]
//   };
// }
// ]);