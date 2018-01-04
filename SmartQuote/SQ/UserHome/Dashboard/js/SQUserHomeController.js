angular.module('sq.SmartQuoteDesktop')
.controller('SQUserHomeController',['$window','$scope','$rootScope','$log','$state','$timeout','SQHomeServices','$http',function($window,$scope,$rootScope,$log,$state,$timeout,SQHomeServices,$http){
console.log('initialise SQUserHomeController controller');
// $rootScope.initAuotoComplete();
$window.pageYOffset;

//CODE STARTS===============================================================================================================
$rootScope.menuClicked=function(menuName){
// console.log(menuName);
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
  }
  if(subMenuName.toLowerCase()==='manage customer'){
   $state.go('managecustomer', {}, {reload: true});  
  }
  if(subMenuName.toLowerCase()==='manage product group'){
    $state.go('manageproductgroup', {}, {reload: true});   
  }
  if(subMenuName.toLowerCase()==='manage product'){
    $state.go('manageproduct', {}, {reload: true});  
  } 
  if(subMenuName.toLowerCase()==='upload product file'){
  $state.go('uploadproductfile', {}, {reload: true}); 
  }
  if(subMenuName.toLowerCase()==='create/edit terms and conditions'){  
  $state.go('managetermsconditions', {}, {reload: true});  
  }
  if(subMenuName.toLowerCase()==='create/edit services'){
  $state.go('manageservices', {}, {reload: true});  
  }
  if(subMenuName.toLowerCase()==='manage alternate product'){
  $state.go('managealternateproduct', {}, {reload: true});  
  }
  if(subMenuName.toLowerCase()==='create/edit offers'){
	  $state.go('manageoffers', {}, {reload: true});  
  }
  if(subMenuName.toLowerCase()==='create proposal'){
  $state.go('createquote', {}, {reload: true});    
  } 
  if(subMenuName.toLowerCase()==='view/edit proposal'){
  // $state.transitionTo('vieweditquote');    
  $state.go('vieweditquote', {}, {reload: true});   
  } 
  if(subMenuName.toLowerCase()==='payment reminder'){
  // $state.transitionTo('vieweditquote');    
  $state.go('paymentreminder.start', {}, {reload: true});   
  }
  if(subMenuName==='Logout'){
  $rootScope.userSignout(); 
  }
};


$rootScope.subMenuClicked=function(subMenuName){
  console.log(subMenuName);
  console.log("isQuoteActivated >>" +$rootScope.isQuoteActivated)
  if ($rootScope.isQuoteActivated) {
  $scope.showPromptWindow(subMenuName);
  }else{
  $scope.confirmChangeView(subMenuName);
  }
};

//CODE ENDS===============================================================================================================











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
 

// var numbers;
// $scope.getProductList1 = function(val,event) {
// // console.log("getProductList1")  
// //   $rootScope.showSpinner();
// //     $http.get('//getProductList', {
// //       params: {
// //         prodLike: val,
// //       }
// //     }).then(function(response){
// //       console.log(response)
// //       var productList=angular.copy(response.data.result)
// //       // $scope.productListArray=$scope.productListArray.concat(productList);
// //       $scope.productListArray1=productList;
// //       console.log("$scope.productListArray1")
// //       console.log($scope.productListArray1.length)
//       // $scope.productArray=[];
//       //  angular.forEach($scope.productListArray1, function(item, key){
//       //    var num1;
//       //    num1={val:item.value.toUpperCase(),code:item.code};
//       //    $scope.productArray.push(num1)
//       //  });
//       //  console.log(JSON.stringify($scope.productArray));
//       //  // instantiate the bloodhound suggestion engine
//       //  var proArray=angular.copy($scope.productArray);
//       //  console.log("PRO ARRAY >>")
//       //  console.log(proArray.length)
//       // numbers = new Bloodhound({
//       //   datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.value); },
//       //   queryTokenizer: Bloodhound.tokenizers.whitespace,
//       //   local: $scope.productListArray1
//       // });
//       //   // initialize the bloodhound suggestion engine
//       //   numbers.initialize();
//       //   $scope.noRecordsFound=0;
//       //   $scope.numbersDataset = {
//       //     displayKey: 'value',
//       //     limit: $scope.productListArray1.length,
//       //     source: numbers.ttAdapter(),
//       //     templates: {
//       //       // notFound:' no records',
//       //       empty: [
//       //         '<div class="tt-suggestion tt-empty-message">',
//       //         'No results were found ...',
//       //         +$scope.noRecordsFound+'</div>'
//       //       ].join('\n'),
//       //     }
//       //   };
//       //   // Typeahead options object
//       //   $scope.exampleOptions = {
//       //     displayKey: 'title',
//       //     highlight: true
//       //   };


//        // numbers.initialize();

//       $rootScope.hideSpinner();
//     });
// }

$scope.productList=[{"code":"3DE-EDICUSEMB1","key":0,"value":"3DE-EDICUSEMB1 ( EMBROIDERY BLACK TEXT EDI INTERNATIONAL POSITION: LHS CHEST )"},{"code":"3DE-EDICUSEMB1a","key":0,"value":"3DE-EDICUSEMB1a ( TEST31 No Description No Description )"},{"code":"3DE-HYT001EMB1","key":0,"value":"3DE-HYT001EMB1 ( EMBROIDERY LOGO HYTECO POSITION: LHS CHEST )"},{"code":"3DE-LOSCAMEMB1","key":0,"value":"3DE-LOSCAMEMB1 ( EMBROIDERY LOGO LOSCAM - )"},{"code":"abcs","key":0,"value":"abcs ( aaa  No Description )"},{"code":"ABL-11887","key":0,"value":"ABL-11887 ( ALPHA SUPER PREMIUM MACHINE PACKAGING TAPE 65UM 48MM x 1000M CLEAR )"},{"code":"ABL-12126","key":0,"value":"ABL-12126 ( ALPHA PREMIUM MACHINE PACKAGING TAPE 50UM 48mm x 1000mtr CLEAR )"},{"code":"ABL-2529","key":0,"value":"ABL-2529 ( SHIPPING CARTON 700x500x350mm - - )"},{"code":"ABL-3030","key":0,"value":"ABL-3030 ( JIFFY G1 GUSSETED UTILITY HEAVY DUTY PAPER MAILERS 405x405x75mm BX100 )"},{"code":"ABL-3264","key":0,"value":"ABL-3264 ( LABELTAPE HEAVY YELLOW\/BLACK 75mm x 100mm 500 LABEL - )"},{"code":"ABL-3726","key":0,"value":"ABL-3726 ( POLY BAG 450x610mm 50UM BX500 - )"},{"code":"ABL-3940","key":0,"value":"ABL-3940 ( TEFLON TAPE NON-ADHESIVE 38MM WIDE 1 METRE *FOR HEAT SEALING MACHINES* )"},{"code":"ABL-4030","key":0,"value":"ABL-4030 ( POLYCELL BUBBLE LINED MAILING BAGS 127x229MM SIZE 00 CTN300 - )"},{"code":"ABL-4031","key":0,"value":"ABL-4031 ( TEMPEST BUBBLE LINED MAILING BAGS 151x229mm SIZE 1 CTN300 - )"},{"code":"ABL-4032","key":0,"value":"ABL-4032 ( TEMPEST BUBBLE LINED MAILING BAGS 215x280mm SIZE 2 CTN100 - )"},{"code":"ABL-4033","key":0,"value":"ABL-4033 ( TEMPEST BUBBLE LINED MAILING BAGS 266x381mm SIZE 5 CTN100 - )"},{"code":"ABL-4034","key":0,"value":"ABL-4034 ( TEMPEST BUBBLE LINED MAILING BAGS 241x343mm SIZE 4 CTN100 - )"},{"code":"ABL-4035","key":0,"value":"ABL-4035 ( TEMPEST BUBBLE LINED MAILING BAGS 317x381mm SIZE 6 CTN100 - )"},{"code":"ABL-4036","key":0,"value":"ABL-4036 ( TEMPEST BUBBLE LINED MAILING BAGS 361x483mm SIZE 7 CTN50 - )"},{"code":"ABL-4680","key":0,"value":"ABL-4680 ( POLYCELL BUBBLE LINED MAILING BAGS 100x180MM SIZE 000 CTN300 - )"},{"code":"ABL-5157","key":0,"value":"ABL-5157 ( SINGLE WALLED CARDBOARD SHEET 1.5M X 3.0M - )"},{"code":"ABL-5651","key":0,"value":"ABL-5651 ( BAG SEALER TAPE 12MM X 66M GREEN - )"},{"code":"ABL-6133","key":0,"value":"ABL-6133 ( QUILTED FABRIC PAD FOR TRANSPORTATION OF FURNITURE 1.8M X 3.4M )"},{"code":"ABS-MF85550","key":0,"value":"ABS-MF85550 ( ALCO MF85-550 CAR BATTERY 12V 55AH (20HR) - )"},{"code":"ABS-RT12260","key":0,"value":"ABS-RT12260 ( RITAR RT12260 AGM BATTERY - - )"},{"code":"ACE-CWWP0005L","key":0,"value":"ACE-CWWP0005L ( ACE COVERALLS PVC YELLOW LARGE - )"},{"code":"ACE-CWWP0005M","key":0,"value":"ACE-CWWP0005M ( ACE COVERALLS PVC YELLOW MEDIUM - )"},{"code":"ACE-CWWP00103XL","key":0,"value":"ACE-CWWP00103XL ( RAINCOAT YELLOW FULL LENGTH PVC WITH DETACHABLE HOOD 3XL - )"},{"code":"ACE-CWWP0010L","key":0,"value":"ACE-CWWP0010L ( RAINCOAT YELLOW FULL LENGTH PVC WITH DETACHABLE HOOD LARGE - )"},{"code":"ACE-CWWP0010M","key":0,"value":"ACE-CWWP0010M ( RAINCOAT YELLOW FULL LENGTH PVC WITH DETACHABLE HOOD MEDIUM )"},{"code":"ACE-CWWP0010XL","key":0,"value":"ACE-CWWP0010XL ( RAINCOAT YELLOW FULL LENGTH PVC WITH DETACHABLE HOOD XL - )"},{"code":"ACE-CWWP0045L","key":0,"value":"ACE-CWWP0045L ( RAINCOAT YELLOW 3\/4 LENGTH PVC WITH DETACHABLE HOOD LARGE - )"},{"code":"ACE-CWWP0045M","key":0,"value":"ACE-CWWP0045M ( RAINCOAT YELLOW 3\/4 LENGTH PVC WITH DETACHABLE HOOD MEDIUM - )"},{"code":"ACE-CWWP0045S","key":0,"value":"ACE-CWWP0045S ( RAINCOAT YELLOW 3\/4 LENGTH PVC WITH DETACHABLE HOOD SMALL - )"},{"code":"ACE-CWWP0045XL","key":0,"value":"ACE-CWWP0045XL ( RAINCOAT YELLOW 3\/4 LENGTH PVC WITH DETACHABLE HOOD XL - )"},{"code":"ACE-CWWP0055M","key":0,"value":"ACE-CWWP0055M ( WATERPROOF PANTS PVC YELLOW MEDIUM - )"},{"code":"ACE-CWWP0065XL","key":0,"value":"ACE-CWWP0065XL ( RAINCOAT YELLOW 3\/4 LENGTH PVC WITH REFLECTIVE TAPE AND DETACHABLE HOOD XL )"},{"code":"ACE-LP801355","key":0,"value":"ACE-LP801355 ( ACE ELBOW PADS LEATHER WELD - - )"},{"code":"ACO-0173035","key":0,"value":"ACO-0173035 ( RAPID R33 HEAVY DUTY TACKER *TAKES RAPID 13\/6-14 STAPLES* - )"},{"code":"ACO-0275730","key":0,"value":"ACO-0275730 ( JASTEK SUPER DELUXE PILE CARPET CHAIRMAT KEYHOLE 114X135CM )"},{"code":"ACO-0375230","key":0,"value":"ACO-0375230 ( JASTEK REPLACEMENT SAFETY GUARD TO SUIT 2044 - )"},{"code":"ACO-0378190","key":0,"value":"ACO-0378190 ( FLOORTEX RECYCLED HARD FLOOR CHAIRMAT RECTANGULAR 120X150CM - )"},{"code":"ACO-0404050","key":0,"value":"ACO-0404050 ( LEITZ ILAM EASY LAMINATOR A4 - - )"},{"code":"ACO-0404060","key":0,"value":"ACO-0404060 ( LEITZ ILAM EASY LAMINATOR A3 - - )"},{"code":"ACO-1001001","key":0,"value":"ACO-1001001 ( MARBIG STANDARD FLAT FILE A4 BLUE - )"},{"code":"ACO-1001002","key":0,"value":"ACO-1001002 ( MARBIG STANDARD FLAT FILE A4 BLACK - )"},{"code":"ACO-1001003","key":0,"value":"ACO-1001003 ( MARBIG STANDARD FLAT FILE A4 RED - )"},{"code":"ACO-1001004","key":0,"value":"ACO-1001004 ( MARBIG STANDARD FLAT FILE A4 GREEN - )"},{"code":"ACO-1001005","key":0,"value":"ACO-1001005 ( MARBIG STANDARD FLAT FILE A4 YELLOW - )"},{"code":"ACO-102009","key":0,"value":"ACO-102009 ( ST JOHN FIRST AID KIT REFILL ELASTIC GAUZE BANDAGE 7.5cm x 1.5mtr )"},{"code":"ACO-102088","key":0,"value":"ACO-102088 ( NESTLE BEVERAGE BAR WITH STARTER PACK - )"},{"code":"ACO-102097","key":0,"value":"ACO-102097 ( NESTLE HOT CHOCOLATE 750gm BAG - )"},{"code":"ACO-102282","key":0,"value":"ACO-102282 ( KOOL MINTS 5KG INDIVIDUALLY WRAPPED CARTON - )"},{"code":"ACO-102295","key":0,"value":"ACO-102295 ( NESCAFE BLEND 43 COFFEE 1kg TIN  CCC-051284 - )"},{"code":"ACO-102296","key":0,"value":"ACO-102296 ( NESTLE MILO 1.9kg TIN - - )"},{"code":"ACO-102299","key":0,"value":"ACO-102299 ( INTERNATIONAL ROAST COFFEE 1kg CATERERS BLEND TIN - )"},{"code":"ACO-102344","key":0,"value":"ACO-102344 ( NESCAFE FOODSERVICE BLEND COFFEE 1KG TIN - )"},{"code":"ACO-102345","key":0,"value":"ACO-102345 ( NESCAFE ESPRESSO COFFEE 375GM TIN - )"},{"code":"ACO-102347","key":0,"value":"ACO-102347 ( NESCAFE DECAF COFFEE 375GM TIN - - )"},{"code":"ACO-102744","key":0,"value":"ACO-102744 ( NESCAFE BLEND 43 COFFEE 500GM TIN - )"},{"code":"ACO-10435","key":0,"value":"ACO-10435 ( *** SOLD OUT FOR 2017 *** SASCO ERASABLE WALL PLANNER COMPACT 594x420mm YEAR TO VIEW )"},{"code":"ACO-10470","key":0,"value":"ACO-10470 ( SASCO 12 MONTH PLANNER UNDATED 910x605mm - )"},{"code":"ACO-105109","key":0,"value":"ACO-105109 ( ST JOHN FIRST AID KIT REFILL HEAVY BANDAGE 7.5cm x 1.5mtr - )"},{"code":"ACO-10552","key":0,"value":"ACO-10552 ( SASCO DELUXE DESK PLANNER 512x376mm MONTH TO A VIEW 2017 *** SOLD OUT FOR 2017 *** )"},{"code":"ACO-10552RFL","key":0,"value":"ACO-10552RFL ( SASCO DELUXE DESK PLANNER REFILL 512x376mm FOR 10552 2017 *** SOLD OUT FOR 2017 *** )"},{"code":"ACO-1056","key":0,"value":"ACO-1056 ( SASCO EXECUTIVE YEAR PLANNER ALUM FRAMED EXECUTIVE 2017\/2018 )"},{"code":"ACO-10585702","key":0,"value":"ACO-10585702 ( ***  SOLD  OUT  FOR 2017  *** OFFICE CHOICE WALL PLANNER YEAR 2017 ( SASCO ) 870x610mm )"},{"code":"ACO-10587","key":0,"value":"ACO-10587 ( *** SOLD OUT FOR 2017 *** SASCO ERASABLE WALL PLANNER FRAMED SMALL 700x500mm 2017 )"},{"code":"ACO-10588","key":0,"value":"ACO-10588 ( SASCO ERASABLE WALL PLANNER FRAMED LARGE 1000x700mm 2017 *** SOLD OUT FOR 2017 *** )"},{"code":"ACO-10596","key":0,"value":"ACO-10596 ( *** SOLD OUT FOR 2017 *** SASCO ERASABLE WALL PLANNER ENVIRO 870x610mm YEAR TO VIEW )"},{"code":"ACO-10597","key":0,"value":"ACO-10597 ( *** SOLD OUT FOR 2017 *** ERASABLE WALL PLANNER UNFRAMED 700x500mm 2017 )"},{"code":"ACO-106009","key":0,"value":"ACO-106009 ( ST JOHN FIRST AID KIT REFILL HEAVY CREPE BANDAGE 10cm x 1.5mtr )"},{"code":"ACO-10730","key":0,"value":"ACO-10730 ( SASCO DESK CALENDAR 1 MONTH TO A VIEW 210x170mm 2017 *** SOLD OUT FOR 2017 *** )"},{"code":"ACO-109095","key":0,"value":"ACO-109095 ( ALLENS JELLY BABIES 1.3kg BAG - - )"},{"code":"ACO-109099","key":0,"value":"ACO-109099 ( ALLENS PARTY MIX 1.3kg BAG - - )"},{"code":"ACO-109108","key":0,"value":"ACO-109108 ( ALLENS SNAKES ALIVE 1.3kg BAG - - )"},{"code":"ACO-109110","key":0,"value":"ACO-109110 ( ALLENS STRAWBERRIES & CREAM 1.3kg BAG - )"},{"code":"ACO-109566","key":0,"value":"ACO-109566 ( NESCAFE GOLD BLEND COFFEE 440GM TIN - )"},{"code":"ACO-1102002","key":0,"value":"ACO-1102002 ( % MARBIG PRESENTATION FOLDERS LEATHERGRAIN BLACK PK10 - )"},{"code":"ACO-1104108","key":0,"value":"ACO-1104108 ( MARBIG PRESENTATION FOLDERS PRO SERIES A4 GLOSS WHITE DOUBLE POCKET PK10 )"},{"code":"ACO-1104208","key":0,"value":"ACO-1104208 ( MARBIG PRESENTATION FOLDERS PRO SERIES A4 GLOSS WHITE WITH WINDOW PK10 )"},{"code":"ACO-1104308","key":0,"value":"ACO-1104308 ( MARBIG PRESENTATION FOLDERS PRO SERIES A4 GLOSS WHITE BX50 - )"},{"code":"ACO-1104408","key":0,"value":"ACO-1104408 ( MARBIG PRESENTATION FOLDERS PRO SERIES A4 GLOSS WHITE PK20 - )"},{"code":"ACO-1106208","key":0,"value":"ACO-1106208 ( MARBIG PRESENTATION FOLDERS PRO SERIES A4 MATT WHITE BX50 - )"},{"code":"ACO-1106302","key":0,"value":"ACO-1106302 ( MARBIG PRESENTATION FOLDERS PRO SERIES A4 MATT BLACK PK20 - )"},{"code":"ACO-1106308","key":0,"value":"ACO-1106308 ( MARBIG PRESENTATION FOLDERS PRO SERIES A4 MATT WHITE PK20 - )"},{"code":"ACO-1107007","key":0,"value":"ACO-1107007 ( MARBIG A4 MANILLA FOLDERS BUFF BX100 - )"},{"code":"ACO-1108101","key":0,"value":"ACO-1108101 ( MARBIG F\/CAP MANILLA FOLDERS BLUE BX100 - )"},{"code":"ACO-1108103","key":0,"value":"ACO-1108103 ( MARBIG F\/CAP MANILLA FOLDERS RED BX100 - )"},{"code":"ACO-1108104","key":0,"value":"ACO-1108104 ( MARBIG F\/CAP MANILLA FOLDERS GREEN BX100 - )"},{"code":"ACO-1108105","key":0,"value":"ACO-1108105 ( MARBIG F\/CAP MANILLA FOLDERS YELLOW BX100 - )"},{"code":"ACO-1108106","key":0,"value":"ACO-1108106 ( MARBIG F\/CAP MANILLA FOLDERS ORANGE BX100 - )"},{"code":"ACO-1108109","key":0,"value":"ACO-1108109 ( MARBIG F\/CAP MANILLA FOLDERS PINK BX100 - )"},{"code":"ACO-1108111","key":0,"value":"ACO-1108111 ( MARBIG F\/CAP MANILLA FOLDERS GREY BX100 - )"},{"code":"ACO-1108117","key":0,"value":"ACO-1108117 ( MARBIG F\/CAP MANILLA FOLDERS LIGHT BLUE BX100 - )"},{"code":"ACO-1108119","key":0,"value":"ACO-1108119 ( MARBIG F\/CAP MANILLA FOLDERS PURPLE BX100 - )"},{"code":"ACO-1108129","key":0,"value":"ACO-1108129 ( MARBIG F\/CAP MANILLA FOLDERS LIGHT GREEN BX100 - )"},{"code":"ACO-1108507","key":0,"value":"ACO-1108507 ( MARBIG F\/CAP MANILLA FOLDERS BUFF PK20  No. 88200 - )"},{"code":"ACO-1108601","key":0,"value":"ACO-1108601 ( MARBIG F\/CAP MANILLA FOLDERS BLUE PK20 - )"},{"code":"ACO-1108603","key":0,"value":"ACO-1108603 ( MARBIG F\/CAP MANILLA FOLDERS RED PK20 - )"},{"code":"ACO-1108604","key":0,"value":"ACO-1108604 ( MARBIG F\/CAP MANILLA FOLDERS GREEN PK20 - )"},{"code":"ACO-1108605","key":0,"value":"ACO-1108605 ( MARBIG F\/CAP MANILLA FOLDERS YELLOW PK20 - )"},{"code":"ACO-1108606","key":0,"value":"ACO-1108606 ( MARBIG F\/CAP MANILLA FOLDERS ORANGE PK20 - )"},{"code":"ACO-1108609","key":0,"value":"ACO-1108609 ( MARBIG F\/CAP MANILLA FOLDERS PINK PK20 - )"},{"code":"ACO-1108611","key":0,"value":"ACO-1108611 ( MARBIG F\/CAP MANILLA FOLDERS GREY PK20 - )"},{"code":"ACO-1108617","key":0,"value":"ACO-1108617 ( MARBIG F\/CAP MANILLA FOLDERS LIGHT BLUE PK20 - )"},{"code":"ACO-1108619","key":0,"value":"ACO-1108619 ( MARBIG F\/CAP MANILLA FOLDERS PURPLE PK20 - )"},{"code":"ACO-1108629","key":0,"value":"ACO-1108629 ( MARBIG F\/CAP MANILLA FOLDERS LIGHT GREEN PK20 - )"},{"code":"ACO-1108699","key":0,"value":"ACO-1108699 ( MARBIG F\/CAP MANILLA FOLDERS ASSORTED COLOURS PK20 - )"},{"code":"ACO-1109907OC","key":0,"value":"ACO-1109907OC ( OFFICE CHOICE MANILLA FOLDERS FOOLSCAP BUFF BX100 - )"},{"code":"ACO-11100002OC","key":0,"value":"ACO-11100002OC ( OFFICE CHOICE SUSPENSION FILES F\/CAP COMPLETE BX50 ACO-111130C )"},{"code":"ACO-11105002OC","key":0,"value":"ACO-11105002OC ( OFFICE CHOICE SUSPENSION FILES F\/CAP FILES ONLY BX50 ACO-111190C )"},{"code":"ACO-111190C","key":0,"value":"ACO-111190C ( CRYSTALFILE SUSPENSION FILES ENVIRO CLASSIC F\/C FILES ONLY BX50 )"},{"code":"ACO-111191","key":0,"value":"ACO-111191 ( CRYSTALFILE ENVIRO SUSPENSION FILES F\/CAP COMPLETE PK10 - )"},{"code":"ACO-111221Y","key":0,"value":"ACO-111221Y ( CRYSTALFILE SUSPENSION FILES F\/CAP COMPLETE RED PK10 - )"},{"code":"ACO-111222Y","key":0,"value":"ACO-111222Y ( CRYSTALFILE SUSPENSION FILES F\/CAP COMPLETE BLUE PK10 - )"},{"code":"ACO-111223Y","key":0,"value":"ACO-111223Y ( CRYSTALFILE SUSPENSION FILES F\/CAP COMPLETE PURPLE PK10 - )"},{"code":"ACO-111224Y","key":0,"value":"ACO-111224Y ( CRYSTALFILE SUSPENSION FILES F\/CAP COMPLETE YELLOW PK10 - )"},{"code":"ACO-111250CY","key":0,"value":"ACO-111250CY ( CYSTALFILE SUSPENSION FILES DOUBLE CAP COMPLETE BX50 - )"},{"code":"ACO-11126CY","key":0,"value":"ACO-11126CY ( CRYSTALFILE SUSPENSION FILES ENVIRO A4 COMPLETE PK20 - )"},{"code":"ACO-11127CY","key":0,"value":"ACO-11127CY ( CYRSTALFILE SUSPENSION FILES DOUBLE CAP F\/CAP COMPLETE PK10 - )"},{"code":"ACO-111280C","key":0,"value":"ACO-111280C ( CRYSTALFILE SUSPENSION FILES A4 FILES ONLY  BX50 - )"},{"code":"ACO-111310Y","key":0,"value":"ACO-111310Y ( CRYSTALFILE SUSPENSION FILES F\/CAP EXPANDING GREEN COMPLETE 90MM PK10 )"},{"code":"ACO-111360","key":0,"value":"ACO-111360 ( TWINLOCK  CRYSTALTABS CLEAR BX50 - )"},{"code":"ACO-111360C","key":0,"value":"ACO-111360C ( CRYSTALFILE INDICATOR TABS (NEW STYLE) CLEAR BX50 - )"},{"code":"ACO-111540","key":0,"value":"ACO-111540 ( CRYSTALFILE SUSPENSION FILE TAB INSERTS WHITE PK52 - )"},{"code":"ACO-111540C","key":0,"value":"ACO-111540C ( CRYSTALFILE INDICATOR TAB INSERTS (NEW STYLE) A-Z WHITE PK60 )"},{"code":"ACO-111541C","key":0,"value":"ACO-111541C ( % CRYSTALFILE TAB INSERTS RED PK60 - )"},{"code":"ACO-111542C","key":0,"value":"ACO-111542C ( % CRYSTALFILE TAB INSERTS BLUE PK60 - )"},{"code":"ACO-111543C","key":0,"value":"ACO-111543C ( % CRYSTALFILE TAB INSERTS GREEN PK60 - )"},{"code":"ACO-111544C","key":0,"value":"ACO-111544C ( % CRYSTALFILE TAB INSERTS YELLOW PK60 - )"},{"code":"ACO-111545C","key":0,"value":"ACO-111545C ( # CRYSTALFILE TAB INSERTS ORANGE PK52 *** CLEARANCE *** )"},{"code":"ACO-111546C","key":0,"value":"ACO-111546C ( # CRYSTALFILE TAB INSERTS PINK PK52 *** CLEARANCE *** )"},{"code":"ACO-111601","key":0,"value":"ACO-111601 ( CRYSTALFILE SUSPENSION FILES EXTRA PP COMPLETE BLUE BX20 - )"},{"code":"ACO-111902","key":0,"value":"ACO-111902 ( CRYSTALFILE SUSPENSION FILES EXTRA PP DOUBLE CAPACITY BX10 - )"},{"code":"ACO-111906","key":0,"value":"ACO-111906 ( CRYSTALFILE SUSPENSION FILES PP COMPLETE EX\/ WIDE 50MM BX10 - )"},{"code":"ACO-112478Y","key":0,"value":"ACO-112478Y ( CRYSTALFILE SUSPENSION FILES RAINBOW F\/CAP COMPLETE PK25 - )"},{"code":"ACO-112610CY","key":0,"value":"ACO-112610CY ( CRYSTALFILE SUSPENSION FILES TOPFILE COMPLETE BX50 - )"},{"code":"ACO-1128","key":0,"value":"ACO-1128 ( ST JOHN FIRST AID KIT REFILL MICROPORE TAPE 25MM - )"},{"code":"ACO-11365C","key":0,"value":"ACO-11365C ( TWINLOCK CRYSTALTABS RAINBOW BX50 - )"},{"code":"ACO-113675C","key":0,"value":"ACO-113675C ( CRYSTALFILE CABINETFILE SUSPENSION FILES F\/CAP BX50 - )"},{"code":"ACO-11450","key":0,"value":"ACO-11450 ( SUSPENSION FILE FRAMES METAL ADJUSTABLE - )"},{"code":"ACO-118109","key":0,"value":"ACO-118109 ( ST JOHN FIRST AID KIT REFILL TRIANGLUAR COTTON BANDAGE - )"},{"code":"ACO-120101601","key":0,"value":"ACO-120101601 ( # DAY-TIMER AVALON REFILL DESK 1 DAY TO PAGE REFILL *** DISCONTINUED *** )"},{"code":"ACO-12073061","key":0,"value":"ACO-12073061 ( NESCAFE BLEND 43 SINGLE SERVE COFFEE STICKS 1.7GM BX1000 - )"},{"code":"ACO-12086132","key":0,"value":"ACO-12086132 ( NESTLE HOT CHOCOLATE 2KG TIN CCC-010856 - )"},{"code":"ACO-1210","key":0,"value":"ACO-1210 ( ST JOHN FIRST AID KIT REFILL INSTANT COLD PACK - )"},{"code":"ACO-12188795","key":0,"value":"ACO-12188795 ( # NESCAFE FROTHY COFFEE INDIVIDUAL PORTIONS VANILLA *** DISCONTINUED *** )"},{"code":"ACO-12188799","key":0,"value":"ACO-12188799 ( # NESCAFE FROTHY COFFEE INDIVIDUAL PORTIONS MOCHA *** DISCONTINUED *** )"},{"code":"ACO-12189047","key":0,"value":"ACO-12189047 ( # NESCAFE FROTHY COFFEE INDIVIDUAL PORTIONS LATTE *** DISCONTINUED *** )"},{"code":"ACO-12189071","key":0,"value":"ACO-12189071 ( # NESCAFE FROTHY COFFEE INDIVIDUAL PORTIONS CARAMEL *** DISCONTINUED *** )"},{"code":"ACO-12194384","key":0,"value":"ACO-12194384 ( ALLENS MINTIES 1kg BAG - - )"},{"code":"ACO-12195435","key":0,"value":"ACO-12195435 ( NESTLE ALEGRIA COFFEE MACHINE REFILL 115gm - )"},{"code":"ACO-12204963","key":0,"value":"ACO-12204963 ( NESCAFE DOLCE GUSTO CAPSULES HOT CHOCOLATE PK8 - )"},{"code":"ACO-12204964","key":0,"value":"ACO-12204964 ( NESCAFE DOLCE GUSTO CAPSULES LATTE MACCHIATO PK8 COFFEE & 8 MILK )"},{"code":"ACO-12204965","key":0,"value":"ACO-12204965 ( NESCAFE DOLCE GUSTO CAPSULES CAFE AU LAIT PK16 - )"},{"code":"ACO-12204966","key":0,"value":"ACO-12204966 ( NESCAFE DOLCE GUSTO CAPSULES AMERICANO PK16 - )"},{"code":"ACO-12204967","key":0,"value":"ACO-12204967 ( NESCAFE DOLCE GUSTO CAPSULE CAPUCCINO PK8 COFFEE & 8 MILK - )"},{"code":"ACO-12214330","key":0,"value":"ACO-12214330 ( NESCAFE DOLCE GUSTO MACHINE MELODY COFFEE MACHINE - )"},{"code":"ACO-12231966","key":0,"value":"ACO-12231966 ( NESCAFE DOLCE GUSTO CAPSULES ESPRESSO INTENSO PK16 - )"},{"code":"ACO-12256783","key":0,"value":"ACO-12256783 ( ALLENS JELLY BEANS 1KG BAG - - )"},{"code":"ACO-12257651","key":0,"value":"ACO-12257651 ( COFFEE NESCAFE BLEND 43 STICKS 120 STICK DISPLAY PACK - )"},{"code":"ACO-12285808","key":0,"value":"ACO-12285808 ( ALLEN'S SHERBIES 850gm BAG - - )"},{"code":"ACO-123010OC","key":0,"value":"ACO-123010OC ( OFFICE CHOICE CONVENTION CARD HOLDER WITH PIN & CLIP BX50 - )"},{"code":"ACO-123020OC","key":0,"value":"ACO-123020OC ( OFFICE CHOICE A4 DIVIDERS PP 5TAB MULTI-COLOURED - )"},{"code":"ACO-123021OC","key":0,"value":"ACO-123021OC ( OFFICE CHOICE A4 DIVIDERS PP 10TAB MULTI-COLOURED - )"},{"code":"ACO-123022OC","key":0,"value":"ACO-123022OC ( OFFICE CHOICE DIVIDERS MANILLA A4 BRIGHT 5TAB MULTI-COLOR - )"},{"code":"ACO-123023OC","key":0,"value":"ACO-123023OC ( OFFICE CHOICE DIVIDERS MANILLA A4 BRIGHT 10TAB MULTI-COLOR - )"},{"code":"ACO-123024OC","key":0,"value":"ACO-123024OC ( OFFICE CHOICE DIVIDERS MANILLA A4 WHITE 5TAB - )"},{"code":"ACO-123025OC","key":0,"value":"ACO-123025OC ( OFFICE CHOICE DIVIDERS MANILLA A4 WHITE 10TAB - )"},{"code":"ACO-123030OC","key":0,"value":"ACO-123030OC ( OFFICE CHOICE FOLDBACK CLIPS 15MM BX12 No.87075 - )"},{"code":"ACO-123031OC","key":0,"value":"ACO-123031OC ( OFFICE CHOICE FOLDBACK CLIPS 19MM BX12 No.87070 - )"},{"code":"ACO-123032OC","key":0,"value":"ACO-123032OC ( OFFICE CHOICE FOLDBACK CLIPS 25MM BX12 No.87065 - )"},{"code":"ACO-123033OC","key":0,"value":"ACO-123033OC ( OFFICE CHOICE FOLDBACK CLIPS 32MM BX12 No.87060 - )"},{"code":"ACO-123034OC","key":0,"value":"ACO-123034OC ( OFFICE CHOICE FOLDBACK CLIPS 41MM BX12 No.87055 - )"},{"code":"ACO-123035OC","key":0,"value":"ACO-123035OC ( OFFICE CHOICE FOLDBACK CLIPS 50MM BX12 No.87050 - )"},{"code":"ACO-123040OC","key":0,"value":"ACO-123040OC ( OFFICE CHOICE PAPER CLIPS 50MM GIANT BX100  No.87090 - )"},{"code":"ACO-123041OC","key":0,"value":"ACO-123041OC ( OFFICE CHOICE PAPER CLIPS 33MM LARGE BX100  No.87085 - )"},{"code":"ACO-123042OC","key":0,"value":"ACO-123042OC ( OFFICE CHOICE PAPER CLIPS 28MM SMALL BX100  No.87080 - )"},{"code":"ACO-123050OC","key":0,"value":"ACO-123050OC ( OFFICE CHOICE PLASTIC RULER CLEAR 30CM - )"},{"code":"ACO-123060OC","key":0,"value":"ACO-123060OC ( OFFICE CHOICE MAGNETIC WHITEBOARD 450 x 600MM - )"},{"code":"ACO-123061OC","key":0,"value":"ACO-123061OC ( OFFICE CHOICE MAGNETIC WHITEBOARD 900 x 600MM - )"},{"code":"ACO-123062OC","key":0,"value":"ACO-123062OC ( OFFICE CHOICE MAGNETIC WHITEBOARD 1200 x 900MM - )"},{"code":"ACO-123063OC","key":0,"value":"ACO-123063OC ( OFFICE CHOICE MAGNETIC WHITEBOARD 900 x 1500MM - )"},{"code":"ACO-123064OC","key":0,"value":"ACO-123064OC ( OFFICE CHOICE MAGNETIC WHITEBOARD 900 x 1800MM - )"},{"code":"ACO-123065OC","key":0,"value":"ACO-123065OC ( OFFICE CHOICE MAGNETIC WHITEBOARD 1200 x 1800MM - )"},{"code":"ACO-123070OC","key":0,"value":"ACO-123070OC ( OFFICE CHOICE GLUE STICK 36GM - - )"},{"code":"ACO-123071OC","key":0,"value":"ACO-123071OC ( OFFICE CHOICE GLUE STICK 21gm - - )"},{"code":"ACO-123072OC","key":0,"value":"ACO-123072OC ( OFFICE CHOICE GLUE STICK 8GM - - )"},{"code":"ACO-123080OC","key":0,"value":"ACO-123080OC ( OFFICE CHOICE SELF-STICK NOTES REPOSITIONABLE NEON 75x75mm ASSORTED  PK5 )"},{"code":"ACO-123090OC","key":0,"value":"ACO-123090OC ( OFFICE CHOICE FLAGS TWIN PACK 24x43mm RED PK100 - )"},{"code":"ACO-123091OC","key":0,"value":"ACO-123091OC ( OFFICE CHOICE FLAGS TWIN PACK 24x43mm YELLOW PK100 - )"},{"code":"ACO-123092OC","key":0,"value":"ACO-123092OC ( OFFICE CHOICE FLAGS TWIN PACK 24x43mm BLUE TWIN PK100 - )"},{"code":"ACO-123093OC","key":0,"value":"ACO-123093OC ( OFFICE CHOICE FLAGS TWIN PACK 24x43mm GREEN PK100 - )"},{"code":"ACO-123100OC","key":0,"value":"ACO-123100OC ( OFFICE CHOICE FLAGS TWIN PACK 24x43mm SIGN HERE PK100 - )"},{"code":"ACO-1231102OC","key":0,"value":"ACO-1231102OC ( OFFICE CHOICE FLIP CHART PAD ECONOMY 585mm x 815mm 50 SHEETS NON BLEED )"},{"code":"ACO-123120OC","key":0,"value":"ACO-123120OC ( OFFICE CHOICE MINI FLAGS ASSTD COLOURS 13x43mm PK4 - )"},{"code":"ACO-123130OC","key":0,"value":"ACO-123130OC ( OFFICE CHOICE INSERT LEVER ARCH PVC A4 WHITE ACO-6405008 )"},{"code":"ACO-123140OC","key":0,"value":"ACO-123140OC ( OFFICE CHOICE COPYSAFE SHEET PROTECTORS A4 BX300 - )"},{"code":"ACO-123141OC","key":0,"value":"ACO-123141OC ( OFFICE CHOICE HEAVY DUTY A4 SHEET PROTECTORS COPYSAFE BX100 ** SUB PRODUCT 25100 ** )"},{"code":"ACO-123150OC","key":0,"value":"ACO-123150OC ( OFFICE CHOICE INVISIBLE TAPE 18MM x 33M  IN DISPENSER - )"},{"code":"ACO-123151OC","key":0,"value":"ACO-123151OC ( OFFICE CHOICE INVISIBLE TAPE 18MM x 33M - )"},{"code":"ACO-123152OC","key":0,"value":"ACO-123152OC ( OFFICE CHOICE INVISIBLE TAPE 18MM x 66M - )"},{"code":"ACO-123160OC","key":0,"value":"ACO-123160OC ( OFFICE CHOICE CHAIRMAT SMALL KEYHOLE 910x1210mm FOR CARPET - )"},{"code":"ACO-123161OC","key":0,"value":"ACO-123161OC ( OFFICE CHOICE CHAIRMAT LARGE KEYHOLE 1140x1340mm FOR CARPET - )"},{"code":"ACO-123170OC","key":0,"value":"ACO-123170OC ( OFFICE CHOICE STANDARD ARCHIVE BOX UP TO 25KG PK5 W315 x L420 x H260MM )"},{"code":"ACO-123180OC","key":0,"value":"ACO-123180OC ( OFFICE CHOICE STAPLER H\/DUTY FULL STRIP BLACK - )"},{"code":"ACO-123190OC","key":0,"value":"ACO-123190OC ( OFFICE CHOICE 2 HOLE PUNCH 20 SHEET BLACK - )"},{"code":"ACO-123191OC","key":0,"value":"ACO-123191OC ( OFFICE CHOICE 2 HOLE PUNCH 40 SHEET BLACK - )"},{"code":"ACO-123192OC","key":0,"value":"ACO-123192OC ( OFFICE CHOICE 2 HOLE PUNCH HEAVY DUTY 65 SHEET BLACK - )"},{"code":"ACO-123193OC","key":0,"value":"ACO-123193OC ( OFFICE CHOICE 3 HOLE PUNCH 10 SHEET BLACK - )"},{"code":"ACO-123194OC","key":0,"value":"ACO-123194OC ( OFFICE CHOICE 4 HOLE PUNCH 25 SHEET BLACK - )"},{"code":"ACO-12396","key":0,"value":"ACO-12396 ( PICKWICK CHAI LATTE TEA 1.5kg TIN - )"},{"code":"ACO-128001601","key":0,"value":"ACO-128001601 ( DAY-TIMER AVALON RFL PORTABLE 1 DAY TO PAGE REFILL *** DISCONTINUED *** )"},{"code":"ACO-12S10","key":0,"value":"ACO-12S10 ( SMA VUESTAMP S10 16x38mm RUBBER ONLY - )"},{"code":"ACO-136295","key":0,"value":"ACO-136295 ( SASCO PERPETUAL YEAR PLANNER 917x610mm  ANY YEAR \/ UNDATED YEAR TO VIEW )"},{"code":"ACO-136610","key":0,"value":"ACO-136610 ( SASCO WORK BOARD LARGE 910 x 600mm WHITE - )"},{"code":"ACO-140101601","key":0,"value":"ACO-140101601 ( DAY-TIMER AVALON REFILL FOLIO 1 DAY TO PAGE REFILL *** DISCONTINUED *** )"},{"code":"ACO-14016270","key":0,"value":"ACO-14016270 ( NOBO ENCLOSED FABRIC NOTICEBOARD 615x915mm 1 DOOR - )"},{"code":"ACO-14016280","key":0,"value":"ACO-14016280 ( NOBO ENCLOSED FABRIC NOTICEBOARD 910x1220mm 2 DOOR - )"},{"code":"ACO-1712099","key":0,"value":"ACO-1712099 ( MARBIG COLOURHIDE NOTEBOOK A4 4 SUBJECT 320pg SIDE BOUND - )"},{"code":"ACO-1712299F","key":0,"value":"ACO-1712299F ( MARBIG COLOURHIDE NOTEBOOK A4 LECTURE BOOK 140PG SIDE BOUND - )"},{"code":"ACO-1713399F","key":0,"value":"ACO-1713399F ( COLOURHIDE NOTEBOOK JOURNAL A4 192 Page ASSORTED - )"},{"code":"ACO-1713799F","key":0,"value":"ACO-1713799F ( COLOURHIDE NOTEBOOK JOURNAL A5 192PG ASSORTED - )"},{"code":"ACO-1714899F","key":0,"value":"ACO-1714899F ( % COLOURHIDE NOTEBOOK A4 Sketch Book 60 Page Asst - )"},{"code":"ACO-1715499F","key":0,"value":"ACO-1715499F ( MARBIG COLOURHIDE NOTEBOOK 112x77mm 96PG TOP BOUND PK5 - )"},{"code":"ACO-1715799F","key":0,"value":"ACO-1715799F ( MARBIG COLOURHIDE NOTEBOOK 200x127mm 200PG TOP BOUND - )"},{"code":"ACO-1715899","key":0,"value":"ACO-1715899 ( COLOURHIDE PP NOTEBOOK A4 5 SUBJECT SIDE BOUND ASSORTED - )"},{"code":"ACO-1715999F","key":0,"value":"ACO-1715999F ( MARBIG COLOURHIDE NOTEBOOK A4 240PG ASSORTED - )"},{"code":"ACO-1716099","key":0,"value":"ACO-1716099 ( COLOURHIDE 3 SUBJECT NOTEBOOK 3 SUBJECT NOTEBOOK - )"},{"code":"ACO-1716199F","key":0,"value":"ACO-1716199F ( MARBIG COLOURHIDE NOTEBOOK A4 120PG SIDE BOUND - )"},{"code":"ACO-1716299F","key":0,"value":"ACO-1716299F ( MARBIG COLOURHIDE NOTEBOOK A4 400PG SIDE BOUND WITH 3 PP DIVIDERS )"},{"code":"ACO-1716599F","key":0,"value":"ACO-1716599F ( MARBIG COLOURHIDE NOTEBOOK 140x100mm 400PG SIDE BOUND - )"},{"code":"ACO-1716601G","key":0,"value":"ACO-1716601G ( COLOURHIDE PP NOTEBOOK A4 LECTURE BOOK 200PG BLUE - )"},{"code":"ACO-1716602G","key":0,"value":"ACO-1716602G ( COLOURHIDE PP NOTEBOOK A4 LECTURE BOOK 200PG BLACK - )"},{"code":"ACO-1716604G","key":0,"value":"ACO-1716604G ( COLOURHIDE PP NOTEBOOK A4 LECTURE BOOK 200PG GREEN - )"},{"code":"ACO-1716609G","key":0,"value":"ACO-1716609G ( COLOURHIDE PP NOTEBOOK A4 LECTURE BOOK 200PG PINK - )"},{"code":"ACO-1716619G","key":0,"value":"ACO-1716619G ( COLOURHIDE PP NOTEBOOK A4 LECTURE BOOK 200PG PURPLE - )"},{"code":"ACO-1716699F","key":0,"value":"ACO-1716699F ( COLOURHIDE PP NOTEBOOK A4 LECTURE BOOK 200PG ASSORTED SIDE BOUND )"},{"code":"ACO-1716999F","key":0,"value":"ACO-1716999F ( COLOURHIDE NOTEBOOK WITH 4 PLASTIC POCKETS A4 - )"},{"code":"ACO-1717199F","key":0,"value":"ACO-1717199F ( COLOURHIDE NOTEBOOK WITH CLEAR CASE ASSTD A4 - )"},{"code":"ACO-1717699F","key":0,"value":"ACO-1717699F ( MARBIG COLOURHIDE NOTEBOOK A5 200PG SIDE BOUND *ASSORTED* - )"},{"code":"ACO-1717899G","key":0,"value":"ACO-1717899G ( COLOURHIDE NOTEBOOK A5 4 Section 200 Page Asstd - )"},{"code":"ACO-17180E","key":0,"value":"ACO-17180E ( ACCOHIDE PP COVER SPIRAL A4 NOTEBOOK LECTURE 250PG - )"},{"code":"ACO-17182E","key":0,"value":"ACO-17182E ( # ACCOHIDE PP COVER SPIRAL NOTEBOOK REPORTER 300PG *** CLEARANCE *** )"},{"code":"ACO-17183E","key":0,"value":"ACO-17183E ( ACCOHIDE PP COVER SPIRAL NOTEBOOK REPORTER 200PG - )"},{"code":"ACO-17184E","key":0,"value":"ACO-17184E ( # ACCOHIDE PP COVER SPIRAL NOTEBOOK 200x127mm REPORTER *** CLEARANCE *** )"},{"code":"ACO-17185E","key":0,"value":"ACO-17185E ( ACCOHIDE PP COVER SPIRAL NOTEBOOK POCKET 112x77mm 96PG )"},{"code":"ACO-17186E","key":0,"value":"ACO-17186E ( ACCOHIDE PP COVER SPIRAL A5 NOTEBOOK 200PG - )"},{"code":"ACO-17187E","key":0,"value":"ACO-17187E ( ACCOHIDE PP COVER SPIRAL A4 NOTEBOOK 120PG - )"},{"code":"ACO-17188E","key":0,"value":"ACO-17188E ( #ACCOHIDE PP COVER SPIRAL A4 NOTEBOOK 240PG - )"},{"code":"ACO-17190E","key":0,"value":"ACO-17190E ( ACCOHIDE PP COVER SPIRAL NOTEBOOK CHUNKY 400PG - )"},{"code":"ACO-1719401F","key":0,"value":"ACO-1719401F ( COLOURHIDE PP NOTEBOOK A4 120PG BLUE - )"},{"code":"ACO-1719402F","key":0,"value":"ACO-1719402F ( COLOURHIDE PP NOTEBOOK A4 120PG BLACK - )"},{"code":"ACO-1719404F","key":0,"value":"ACO-1719404F ( COLOURHIDE PP NOTEBOOK A4 120PG GREEN - )"},{"code":"ACO-1719409F","key":0,"value":"ACO-1719409F ( COLOURHIDE PP NOTEBOOK A4 120PG PINK - )"},{"code":"ACO-1719419F","key":0,"value":"ACO-1719419F ( COLOURHIDE PP NOTEBOOK A4 120PG PURPLE - )"},{"code":"ACO-1719601F","key":0,"value":"ACO-1719601F ( COLOURHIDE PP NOTEBOOK A4 5 SUBJECT 250PG BLUE - )"},{"code":"ACO-1719602F","key":0,"value":"ACO-1719602F ( COLOURHIDE PP NOTEBOOK A4 5 SUBJECT 250PG BLACK - )"},{"code":"ACO-1719619G","key":0,"value":"ACO-1719619G ( COLOURHIDE NOTEBOOK 5 SUBJECT A4 250Pg Purple - )"},{"code":"ACO-1719804F","key":0,"value":"ACO-1719804F ( COLOURHIDE PP NOTEBOOK A4 120PG MY DESIGNER GREEN STRIPE - )"},{"code":"ACO-1719805F","key":0,"value":"ACO-1719805F ( COLOURHIDE PP NOTEBOOK A4 120PG MY DESIGNER YELLOW CHEVRON )"},{"code":"ACO-1719806F","key":0,"value":"ACO-1719806F ( COLOURHIDE PP NOTEBOOK A4 120PG MY DESIGNER ORANGE SCALE )"},{"code":"ACO-1719809F","key":0,"value":"ACO-1719809F ( COLOURHIDE PP NOTEBOOK A4 120PG MY DESIGNER PINK DOTS - )"},{"code":"ACO-1760049","key":0,"value":"ACO-1760049 ( REXEL SHREDDER OIL 473ML - - )"},{"code":"ACO-1765029EU","key":0,"value":"ACO-1765029EU ( REXEL AUTO+250 WASTE BAGS 400x295x315mm RECYCLABLE - )"},{"code":"ACO-1765030EU","key":0,"value":"ACO-1765030EU ( REXEL AUTO+500 SHREDDER BAGS 450x400x390mm RECYCLABLE - )"},{"code":"ACO-1765031EU","key":0,"value":"ACO-1765031EU ( REXEL AUTO+200X SHREDDER BAGS 400x295x315mm RECYCLABLE PK20. - )"},{"code":"ACO-1801701","key":0,"value":"ACO-1801701 ( # MARBIG TWIN WIRE SPIRAL BOOK INDEXED A4 BLUE *** CLEARANCE *** )"},{"code":"ACO-18091OC","key":0,"value":"ACO-18091OC ( OFFICE CHOICE SPIRAL NOTEBOOK 112x77mm 96PG TOP BOUND POCKET - )"},{"code":"ACO-18092OC","key":0,"value":"ACO-18092OC ( OFFICE CHOICE SPIRAL NOTEBOOK 200x127mm 200PG TOP BOUND - )"},{"code":"ACO-18093OC","key":0,"value":"ACO-18093OC ( OFFICE CHOICE SPIRAL NOTEBOOK A4 297x210mm 120PG SIDE BOUND - )"},{"code":"ACO-1810699","key":0,"value":"ACO-1810699 ( MARBIG BRILLIANT SELF STICK NOTES 75x75mm PK5 - )"},{"code":"ACO-1810799","key":0,"value":"ACO-1810799 ( MARBIG BRILLIANT CUBE NOTES 75x75mm 320Sht ASSorted - )"},{"code":"ACO-1810899","key":0,"value":"ACO-1810899 ( MARBIG PASTEL CUBE NOTES 75x75mm  ADHESIVE - )"},{"code":"ACO-1811099","key":0,"value":"ACO-1811099 ( MARBIG RAINBOW CUBE NOTES 75x75mm  ADHESIVE - )"},{"code":"ACO-1811105","key":0,"value":"ACO-1811105 ( MARBIG BRILLIANT COLOUR PAGE MARKERS 4 ASSTD COLOURS 20x50mm PK160 )"},{"code":"ACO-1811399","key":0,"value":"ACO-1811399 ( MARBIG RAINBOW COLOUR PAGE MARKERS 4 ASSTD COLOURS 20x50mm PK160 )"},{"code":"ACO-1811405","key":0,"value":"ACO-1811405 ( MARBIG TRANSPARENT COLOUR PAGE MARKERS 4 ASSTD COLOURS 20x50mm PK160 )"},{"code":"ACO-1811899","key":0,"value":"ACO-1811899 ( MARBIG BRILLIANT MINI NOTES 40x50mm - )"},{"code":"ACO-1812005","key":0,"value":"ACO-1812005 ( OFFICE CHOICE SELF-STICK NOTES REMOVABLE YELLOW 40 x 50mm SMALL )"},{"code":"ACO-1812105","key":0,"value":"ACO-1812105 ( OFFICE CHOICE SELF-STICK NOTES REMOVABLE YELLOW 75 x 75mm MEDIUM )"},{"code":"ACO-1812205","key":0,"value":"ACO-1812205 ( OFFICE CHOICE SELF-STICK NOTES REMOVABLE YELLOW 75 x 125mm LARGE )"},{"code":"ACO-1812305","key":0,"value":"ACO-1812305 ( OFFICE CHOICE SELF-STICK NOTES REPOSITIONABLE MEMO CUBE BRIGHT COLOURS 75 x 75mm )"},{"code":"ACO-18741","key":0,"value":"ACO-18741 ( MARBIG WRITING PAD FLURO A6 ASSORTED 40LEAF PK10 - )"},{"code":"ACO-18742","key":0,"value":"ACO-18742 ( MARBIG WRITING PAD FLURO A4 ASSORTED 40LEAF PK10 - )"},{"code":"ACO-18743","key":0,"value":"ACO-18743 ( MARBIG WRITING PAD FLURO A5 ASSORTED 40LEAF PK10 - )"},{"code":"ACO-18920","key":0,"value":"ACO-18920 ( # MARBIG PROFESSIONAL SERIES VIEW TAB NOTEBOOK A4 200PG *** CLEARANCE *** )"},{"code":"ACO-18930","key":0,"value":"ACO-18930 ( # MARBIG PROFESSIONAL SERIES FOLIO WITH NOTEPAD *** CLEARANCE *** )"},{"code":"ACO-1901031","key":0,"value":"ACO-1901031 ( NOBO MOBILE REVERSIBLE MAGNETIC WHITEBOARD 1500mm x 1200mm )"},{"code":"ACO-1901438","key":0,"value":"ACO-1901438 ( NOBO NOBOCLENE WHITEBOARD CLEANING WIPES PK100 - )"},{"code":"ACO-1901805","key":0,"value":"ACO-1901805 ( NOBO EXTERNAL NOTICE BOARD HVY DUTY SINGLE DOOR LOCKABLE 1034mm x 977mm )"},{"code":"ACO-1901924","key":0,"value":"ACO-1901924 ( NOBO WELCOME FOYER BOARD 600 x 900mm BLUE - )"}]
// console.log("$scope.productList.length : "+$scope.productList.length)
$scope.localSearchProduct = function(str, productList) {
  var matches = [];
  productList.forEach(function(product) {
    // var fullString = product.itemCode + ' ' + product.itemDescription + ' ' + product.description2 +' '+product.description3;
    var fullString = product.value;
    if ((product.value.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0) ||
        // (product.itemDescription.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0) ||
        // (product.description2.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0) ||
        // (product.description3.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0) ||
        (fullString.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0)) {
      matches.push(product);
    }
  });
  return matches;
};

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
   
//     var states = ['Alabama one two', 'Alaska', 'Arizona', 'Arkansas', 'California',
//   'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
//   'Idaho', 'Illinois', 'Indiana one two', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
//   'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
//   'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
//   'New Jersey', 'New Mexico', 'New York one two', 'North Carolina', 'North Dakota',
//   'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
//   'South Carolina', 'South Dakota', 'Tennessee one two', 'Texas', 'Utah', 'Vermont',
//   'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
// ];

//   var substringMatcher = function(strs) {
//     console.log("substringMatcher")
//   return function findMatches(q, cb) {
//     var matches, substringRegex;

//     // an array that will be populated with substring matches
//     matches = [];

//     // regex used to determine if a string contains the substring `q`
//     substrRegex = new RegExp(q, 'i');

//     // iterate through the pool of strings and for any string that
//     // contains the substring `q`, add it to the `matches` array
//     $.each(strs, function(i, str) {
//       if (substrRegex.test(str)) {
//         matches.push(str);
//       }
//     });

//     cb(matches);
//   };
// };
  
// $('#the-basics .typeahead').typeahead({
//   hint: true,
//   highlight: true,
//   minLength: 1
// },
// {
//   name: 'states',
//   source: substringMatcher(states)
// });



$scope.colors = ["rgb(159,204,0)","rgb(250,109,33)","rgb(154,154,154)"];
// $scope.labels = ["Green", "Orange", "Grey"];
// $scope.data = [300, 500,300];


$scope.labels = ['2006', '2007', '2008'];
// $scope.series = ['Series A', 'Series B'];

$scope.data = [
[65, 59, 80, 81],
[28, 48, 40, 19]
];

$scope.$on('$destroy', function(event, message) {
	
 
});

}]);

