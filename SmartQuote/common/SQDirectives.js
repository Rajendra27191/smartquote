angular.module('sq.SmartQuoteDesktop')
.directive('sqSpinner', [
'$timeout',
function ($timeout) {
  return {
    restrict: 'EA',
    replace: true,
     // template: '<div style="position:fixed;z-index:100;left:0;right:0;width:100%;height:100%;margin:auto;background:#ffffff;opacity:.4;" ng-show="spinner.isShown">' + '<center>' + '<i style="margin:250px auto;" class="fa fa-spinner fa-pulse fa-3x fa-fw">' + '</i>' + '</center>' +'{{info.text}}'+ '</div>',
    scope:{
        info : "=info"
    },
    template: "<div style='position:fixed;z-index:1031;left:0;right:0;width:100%;height:100%;margin:auto;rgba(255,255,255,0.2);opacity:.4;' ng-show='spinner.isShown'><center><i style='margin: auto;margin-top:250px;' class='fa fa-spinner fa-pulse fa-3x fa-fw'></i><p ng-bind='info.text'></p></center></div>",
    controller: [
      '$scope',
      '$rootScope',
      function ($scope, $rootScope) {
        $scope.spinner = { isShown: false };
        $rootScope.showSpinner = function () {
          $scope.spinner.isShown = true;
          // $rootScope.loadingInfo={text:"Loading"};
        };
        $rootScope.hideSpinner = function () {
          $scope.spinner.isShown = false;
        };
      }
    ]
  };
}
])
.directive('loadSpinnerLoad', [
    '$timeout',
    function ($timeout) {
      return {
        restrict: 'EA',
        replace: true,
        template: '<div class="col-md-3" style="position:absolute;z-index:100;left:0;right:0;margin:auto;width:100%;height:100%;" ng-show="spinner.isShown">' + '<center style="margin-top:10%;">' + '<i style="color:#545454;" class="fa fa-circle-o-notch fa-lg fa-spin" aria-hidden="true"></i>' + '</center>'+ '</div>',
        controller: [
          '$scope',
          '$rootScope',
          function ($scope, $rootScope) {
            $scope.spinner = { isShown: false };
            $rootScope.showLoadSpinner = function () {
              $scope.spinner.isShown = true;
            };
            $rootScope.hideLoadSpinner = function () {
              $scope.spinner.isShown = false;
            };
          }
        ]
      };
    }])
.directive('pwCheck', [function () {
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        var firstPassword = '#' + attrs.pwCheck;
        elem.add(firstPassword).on('keyup', function () {
          scope.$apply(function () {
            var v = elem.val()===$(firstPassword).val();
            ctrl.$setValidity('pwmatch', v);
          });
        });
      }
    }
  }])
.directive('stringToNumber', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(value) {
        return '' + value;
      });
      ngModel.$formatters.push(function(value) {
        return parseFloat(value);
      });
    }
  };
})
.directive("regExInput", function(){
    "use strict";
    return {
        restrict: "A",
        require: "?regEx",
        scope: {},
        replace: false,
        link: function(scope, element, attrs, ctrl){
          element.bind('keypress', function (event) {
            var regex = new RegExp(attrs.regEx);
            if(event.which==8){
              return true;
            }else{
              var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
              if(!regex.test(key)) {
                 event.preventDefault();
                 return false;
              }
            }
          });
        }
    };
})
.directive('focusMe', function($timeout) {
  return {
    scope: { trigger: '=focusMe' },
    link: function(scope, element) {
      scope.$watch('trigger', function(value) {
        if(value === true) { 
          //console.log('trigger',value);
          //$timeout(function() {
            element[0].focus();
            scope.trigger = false;
          //});
        }
      });
    }
  };
})
.directive('focus', function() {
  return {
    restrict: 'A',
    link: function($scope,elem,attrs) {
      elem.bind('keydown', function(e) {
        var code = e.keyCode || e.which;
        if (code === 9) {
          e.preventDefault();
          elem.next().focus();
        }
      });
    }
  };
})
.directive('myTable', function () {
    return {
        restrict: 'E, A, C',
        link: function (scope, element, attrs, controller) {
            var dataTable = element.dataTable(scope.options);

            scope.$watch('options.aaData', handleModelUpdates, true);

            function handleModelUpdates(newData) {
                var data = newData || null;
                if (data) {
                    dataTable.fnClearTable();
                    // dataTable.fnAddData(data);
                }
            }
        },
        scope: {
            options: "="
        }
    };
})
.directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                        scope.$apply(function(){
                                scope.$eval(attrs.ngEnter);
                        });
                        
                        event.preventDefault();
                }
            });
        };
})
.directive('altSrc', function() {
  return {
    link: function(scope, element, attrs) {
      var defaultSrc = attrs.src;
      element.bind('error', function() {
        if(attrs.errSrc) {
            element.attr('src', attrs.errSrc);
        }
        else if(attrs.src) {
            element.attr('src', defaultSrc);
        }
      });
    }
  }
})
.directive("fileinput", [function() {
    return {
      scope: {
        fileinput: "=",
        filepreview: "="
      },
      link: function(scope, element, attributes) {
        element.bind("change", function(changeEvent) {
          scope.fileinput = changeEvent.target.files[0];
          var reader = new FileReader();
          reader.onload = function(loadEvent) {
            scope.$apply(function() {
              scope.filepreview = loadEvent.target.result;
            });
          }
          // console.log(scope.fileinput)
          if (scope.fileinput) {
          reader.readAsDataURL(scope.fileinput);
          }
            
        });
      }
    }
  }]);
