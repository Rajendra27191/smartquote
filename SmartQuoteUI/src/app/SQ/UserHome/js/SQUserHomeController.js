angular.module('sq.SmartQuoteDesktop')
.controller('SQUserHomeController',['$window','$scope','$rootScope','$log','$state','$timeout','SQHomeServices','$http',function($window,$scope,$rootScope,$log,$state,$timeout,SQHomeServices,$http){
console.log('initialise SQUserHomeController controller');
$window.pageYOffset;


$rootScope.menuClicked=function(menuName){
console.log(menuName);
if(menuName.toLowerCase()==='home'){
  if ($rootScope.isQuoteActivated) {
  $scope.showPromptWindow(menuName);
  }else{
  $scope.confirmChangeView(menuName);
  }
  // $state.transitionTo('userhome.start');
}
};

$rootScope.isQuoteActivated=false;
var changeView=false;
$scope.showPromptWindow=function(subMenuName){
  changeView=false;
  var previousWindowKeyDown = window.onkeydown;
  swal({
  title: 'Confirm Navigation',
  text: "Your unsaved data will be lost. \n Are you sure you want to leave this page ?",
  showCancelButton: true,
  closeOnConfirm: true,
  cancelButtonText:"Stay on Page",
  confirmButtonText:"Leave Page"
  }, function (isConfirm) {
    console.log("isConfirm >" + isConfirm)
  // window.onkeydown = previousWindowKeyDown;
  if (isConfirm) {
    $scope.confirmChangeView(subMenuName);
  } 
  });
};


$scope.confirmChangeView=function(subMenuName){
  if(subMenuName.toLowerCase()==='home'){
   $state.transitionTo('userhome.start');
  }

  if(subMenuName.toLowerCase()==='manage user group'){
  // $state.transitionTo('manageusergroup');  
  $state.go('manageusergroup', {}, {reload: true});
  }
  
  if(subMenuName.toLowerCase()==='manage user'){
  $state.go('manageuser', {}, {reload: true});  
  // $state.transitionTo('manageuser');   
  }
  if(subMenuName.toLowerCase()==='manage customer'){
   $state.go('managecustomer', {}, {reload: true});  
  // $state.transitionTo('managecustomer');    
  }
  if(subMenuName.toLowerCase()==='manage product group'){
    $state.go('manageproductgroup', {}, {reload: true});  
  // $state.transitionTo('manageproductgroup');    
  }
  if(subMenuName.toLowerCase()==='manage product'){
    $state.go('manageproduct', {}, {reload: true});  
  // $state.transitionTo('manageproduct');    
  } 
  if(subMenuName.toLowerCase()==='upload product file'){
  // $state.transitionTo('uploadproductfile');    
  $state.go('uploadproductfile', {}, {reload: true}); 
  }
  if(subMenuName.toLowerCase()==='create/edit terms and conditions'){
  // $state.transitionTo('managetermsconditions');   
  $state.go('managetermsconditions', {}, {reload: true});  
  }
  if(subMenuName.toLowerCase()==='create/edit services'){
  // $state.transitionTo('manageservices');    
  $state.go('manageservices', {}, {reload: true});  
  }
  if(subMenuName.toLowerCase()==='create quote'){
  // $state.transitionTo('createquote');  
  $state.go('createquote', {}, {reload: true});    
  } 
  if(subMenuName.toLowerCase()==='view/edit quote'){
  // $state.transitionTo('vieweditquote');    
  $state.go('vieweditquote', {}, {reload: true});   
  }
  if(subMenuName==='Logout'){
  $rootScope.userSignout(); 
  }
};


$rootScope.subMenuClicked=function(subMenuName){
	console.log(subMenuName);
  console.log("$rootScope.isQuoteActivated >>" +$rootScope.isQuoteActivated)
  if ($rootScope.isQuoteActivated) {
  $scope.showPromptWindow(subMenuName);
  }else{
  $scope.confirmChangeView(subMenuName);
  }

 //  if(subMenuName.toLowerCase()==='manage user group'){
 //  // $state.transitionTo('manageusergroup');  
 //  $state.go('manageusergroup', {}, {reload: true});
 //  }
	
	// if(subMenuName.toLowerCase()==='manage user'){
 //  $state.go('manageuser', {}, {reload: true});  
	// // $state.transitionTo('manageuser');		
	// }
 //  if(subMenuName.toLowerCase()==='manage customer'){
 //   $state.go('managecustomer', {}, {reload: true});  
 //  // $state.transitionTo('managecustomer');    
 //  }
 //  if(subMenuName.toLowerCase()==='manage product group'){
 //    $state.go('manageproductgroup', {}, {reload: true});  
 //  // $state.transitionTo('manageproductgroup');    
 //  }
 //  if(subMenuName.toLowerCase()==='manage product'){
 //    $state.go('manageproduct', {}, {reload: true});  
 //  // $state.transitionTo('manageproduct');    
 //  } 
 //  if(subMenuName.toLowerCase()==='upload product file'){
 //  // $state.transitionTo('uploadproductfile');    
 //  $state.go('uploadproductfile', {}, {reload: true}); 
 //  }
 //  if(subMenuName.toLowerCase()==='create/edit terms and conditions'){
 //  // $state.transitionTo('managetermsconditions');   
 //  $state.go('managetermsconditions', {}, {reload: true});  
 //  }
 //  if(subMenuName.toLowerCase()==='create/edit services'){
 //  // $state.transitionTo('manageservices');    
 //  $state.go('manageservices', {}, {reload: true});  
 //  }
 //  if(subMenuName.toLowerCase()==='create quote'){
 //  // $state.transitionTo('createquote');  
 //  $state.go('createquote', {}, {reload: true});    
 //  } 
 //  if(subMenuName.toLowerCase()==='view/edit quote'){
 //  // $state.transitionTo('vieweditquote');    
 //  $state.go('vieweditquote', {}, {reload: true});   
 //  }
	// if(subMenuName==='Logout'){
	// $rootScope.userSignout();	
	// }
};











$scope.productListArray=[];
var event;
$scope.setEvent = function(ev) {
console.log("setEvent")
console.log(ev)
event=ev;

}
$scope.getProductList = function(val,event) {
      console.log("value >> "+val);
     if(event.keyCode==32){
    $rootScope.showSpinner();
    $http.get('/smartquote/getProductList', {
      params: {
        prodLike: val,
      }
    }).then(function(response){
      console.log(response)
      var productList=angular.copy(response.data.result)
      // $scope.productListArray=$scope.productListArray.concat(productList);
      $scope.productListArray=productList;
      console.log("$scope.productListArray")
      console.log($scope.productListArray.length)
      console.log($scope.productListArray)
      // return response.data.result;
      $rootScope.hideSpinner();
    });
  }
}
$scope.getProduct = function(val) {
  console.log("getProduct");
  console.log(val);
  // if(event.keyCode==32){
    return $http.get('/smartquote/getProductList', {
      params: {
        prodLike: val,
      }
    }).then(function(response){
      console.log(response) 
      return response.data.result;
    });
  // }
  };
$scope.productListArray1=[];
$scope.addProduct={};
//=======================TYPEAHEAD=================================

  
  // instantiate the bloodhound suggestion engine
  // var numbers = new Bloodhound({
  //   datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.num); },
  //   queryTokenizer: Bloodhound.tokenizers.whitespace,
  //   local:  
  //   [
  //     { num: 'one two' },
  //     { num: 'two one' },
  //     { num: 'three five' },
  //     { num: 'four one' },
  //     { num: 'five two' },
  //     { num: 'six' },
  //     { num: 'seven' },
  //     { num: 'eight' },
  //     { num: 'nine 2' },
  //     { num: 'one' },
  //     { num: 'two' },
  //     { num: 'ten 1' }
  //   ]
  // });
   
  // // initialize the bloodhound suggestion engine
  // numbers.initialize();

  // $scope.numbersDataset = {
  //   displayKey: 'num',
  //   source: numbers.ttAdapter(),
  //   templates: {
  //     empty: [
  //       '<div class="tt-suggestion tt-empty-message">',
  //       'No results were found ...',
  //       '</div>'
  //     ].join('\n'),
  //   }
  // };
  
  // $scope.addValue = function () {
  //   numbers.add({
  //     num: 'twenty'
  //   });
  // };
  
  // $scope.setValue = function () {
  //   $scope.selectedNumber = { num: 'seven' };
  // };
  
  // $scope.clearValue = function () {
  //   $scope.selectedNumber = null;
  // };
  
  // // Typeahead options object
  // $scope.exampleOptions = {
  //   displayKey: 'title'
  // };
//=======================TYPEAHEAD=================================

var numbers;
$scope.getProductList1 = function(val,event) {
  $rootScope.showSpinner();
    $http.get('/smartquote/getProductList', {
      params: {
        prodLike: val,
      }
    }).then(function(response){
      console.log(response)
      var productList=angular.copy(response.data.result)
      // $scope.productListArray=$scope.productListArray.concat(productList);
      $scope.productListArray1=productList;
      console.log("$scope.productListArray1")
      console.log($scope.productListArray1.length)
      // $scope.productArray=[];
      //  angular.forEach($scope.productListArray1, function(item, key){
      //    var num1;
      //    num1={val:item.value.toUpperCase(),code:item.code};
      //    $scope.productArray.push(num1)
      //  });
      //  console.log(JSON.stringify($scope.productArray));
      //  // instantiate the bloodhound suggestion engine
      //  var proArray=angular.copy($scope.productArray);
      //  console.log("PRO ARRAY >>")
      //  console.log(proArray.length)
      numbers = new Bloodhound({
        datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.value); },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: $scope.productListArray1
      });
        // initialize the bloodhound suggestion engine
        numbers.initialize();
        $scope.noRecordsFound=0;
        $scope.numbersDataset = {
          displayKey: 'value',
          limit: $scope.productListArray1.length,
          source: numbers.ttAdapter(),
          templates: {
            // notFound:' no records',
            empty: [
              '<div class="tt-suggestion tt-empty-message">',
              'No results were found ...',
              +$scope.noRecordsFound+'</div>'
            ].join('\n'),
          }
        };
        // Typeahead options object
        $scope.exampleOptions = {
          displayKey: 'title',
          highlight: true
        };


       // numbers.initialize();

      $rootScope.hideSpinner();
    });
}

// $('.typeahead').bind('typeahead:select', function(ev, suggestion) {
//   console.log('Selection: ' + suggestion);
// });

$scope.productChanged=function(product){
console.log("Selected Product")
console.log(product)
if (product) {
  if (product.code) {
    console.log("old product");
    $scope.selectedNumber = product;
  }else{
    console.log("new product")
  }
}
}
// $scope.getProductList1('a4 sheet');
   

$scope.filterFn = function(product,input)
{
    // Do some tests
    console.log(product)
    angular.forEach(input, function (item) {
            angular.forEach(values, function (txtBoxVal) {
            if (item.value.indexOf(txtBoxVal)) {
                return true;
            } 
            });
        });

    return false; // otherwise it won't be within the results
};
$scope.$on('$destroy', function(event, message) {
	
 
});
}])
.filter('custom', function() {
  return function(input, search) {
    if (!input) return input;
    if (!search) return input;
    var expected = ('' + search).toLowerCase();
    var result = {};
    angular.forEach(input, function(value, key) {
      var actual = ('' + value).toLowerCase();
      if (actual.indexOf(expected) !== -1) {
        result[key] = value;
      }
    });
    return result;
  }
})
.filter('mySearchFilter', function () {
return function (input, txtVal) {
        var output = [];
        console.log("myCustomFilter")
        // console.log(input)
        console.log(txtVal)
        var strItem=txtVal;
        var values = strItem.split(" ");
        console.log("Input Box Value >>")
        console.log(values)
        // arrayElement=item;
        angular.forEach(input, function (item) {
            angular.forEach(values, function (txtBoxVal) {
            if (item.value.indexOf(txtBoxVal)) {
                output.push(item)
            } 
            });
        });
        if (output.length>0) {
        var finalOutput=[];
        var flag=false;
        angular.forEach(output, function(outValue, key){
          angular.forEach(values, function (txtBoxVal) {
            if (outValue.value.indexOf(txtBoxVal)) {
              flag=true;
            } 
          });
          if (flag) {
            // finalOutput=move(output,key,0)
          }
        });
        }
          
        // move([10, 20, 30, 40, 50], 0, 2)
        // console.log(output);
        return output;
        // return finalOutput;
    }
})
.filter('myCustomFilter', function () {
  //   function move(arr, old_index, new_index) {
  //   console.log("MOVE")
  //   while (old_index < 0) {
  //       old_index += arr.length;
  //   }
  //   while (new_index < 0) {
  //       new_index += arr.length;
  //   }
  //   if (new_index >= arr.length) {
  //       var k = new_index - arr.length;
  //       while ((k--) + 1) {
  //           arr.push(undefined);
  //       }
  //   }
  //    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);  
  //  return arr;
  // }
    return function (input, txtVal) {
        var output = [];
        console.log("myCustomFilter")
        console.log(output)
        console.log(txtVal)
        var strItem=txtVal;
        var values = strItem.split(" ");
        console.log("Input Box Value >>")
        console.log(values)
        // arrayElement=item;
        var flag=false;
        for (var i = 0; i < input.length; i++) {
          for (var j = 0; j < values.length; j++) {  
           if (input[i].value.indexOf(values[j])) {
           flag=true;
           } 
          }
           if (flag) {
            output.push(input[i]); 
           }
        }
        // angular.forEach(input, function (item) {
        //     angular.forEach(values, function (txtBoxVal) {
        //     if (item.value.indexOf(txtBoxVal)) {
        //         output.push(item);
        //     } 
        //     });
        // });
        if (output.length>0) {
        var finalOutput=[];
        var flag2=false;
        console.log("OUTPUT")
        console.log(output.length)
        console.log(output)
        var arrCount=0;
        // for (var i = 0; i < output.length; i++) {
        //   if (output[i].value.indexOf(strItem)) {
        //    flag2=true;
        //    arrCount++;
        //   } 
        //   if (flag2) {
        //     finalOutput=move(output,i,arrCount);
        //   }
        // }
        
        // output.sort(function(a,b){
        // if(a.indexOf(txtVal) < b.indexOf(txtVal)) return -1;
        // else if(a.indexOf(txtVal) > b.indexOf(txtVal)) return 1;
        // else return 0;
        // });

        // angular.forEach(output, function(outValue, key){
        //   angular.forEach(values, function (txtBoxVal) {
        //     if (outValue.value.indexOf(txtBoxVal)) {
        //       flag=true;
        //     } 
        //   });
        //   if (flag) {
        //     finalOutput=move(output,key,0)
        //   }
        // });


        }
          
        // move([10, 20, 30, 40, 50], 0, 2)
        // console.log(output);
        // return finalOutput;
        return output;
    }





    
});
