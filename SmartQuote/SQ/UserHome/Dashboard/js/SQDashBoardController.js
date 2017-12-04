angular.module('sq.SmartQuoteDesktop')
.controller('SQDashBoardController',function($scope,$rootScope,SQUserHomeServices){
// console.log('initialise SQDashBoardController controller');
// $scope.userArray=$rootScope.userList;
// $scope.agent={};
// $scope.options= {
//         scales: {
//             yAxes: [{
//                 ticks: {
//                     min:0,
//                 }
//             }]
//         }
//  };
// //==================DATE===============
// $scope.today = function() {
//     $scope.dt = new Date();
//     return $scope.dt;
// };

//  $scope.example = {
//          value: new Date(2013, 9, 22)
//        };
// $scope.popup1={};
// $scope.popup2={};
// $scope.buttonstatus='add';
// $scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd.MM.yyyy', 'shortDate'];
// // $scope.format = $scope.formats[1];
// $scope.format = "dd-MM-yyyy";
// $scope.dateOptions = {
// formatYear: 'yy',
// startingDay: 1,
// showWeeks: false
// };
// $scope.dateValid=true;

// $scope.validToDate=function(){
// var currentDate=$scope.today();
// var toDate=new Date(currentDate.getFullYear()+1,currentDate.getMonth(),currentDate.getDate());
// return toDate;
// };
// $scope.agent={'fromDate':$scope.today(),'toDate':$scope.validToDate()};
// // toDate.setYear($scope.today().getYear()+1);


// //$scope.today();
// $scope.open1 = function() {
// $scope.popup1.opened = true;
// };
// $scope.open2 = function() {
// $scope.popup2.opened = true;
// };

// $scope.fromDateChanged=function(userValidFromDate){
// //console.log(userValidFrom)
// };

// $scope.validateDate=function(dateFrom,dateTo){
// 	//console.log("validateDate")
// 	if(dateFrom&&dateTo){
// 		var date1=moment(dateFrom).format('YYYY-MM-DD');
// 		var date2=moment(dateTo).format('YYYY-MM-DD');
// 		//console.log(date1,date2);
// 		if (date2>date1) {
// 			$scope.dateValid=true;
// 		}else{
// 			$scope.dateValid=false;
// 		}
// 	}

// }
// $scope.colors = ['#f0ad4e', '#5cb85c', '#d9534f','#636c72'];
// //  $scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
// // $scope.series = ['Series A', 'Series B'];

// // $scope.data = [65, 59, 80, 81, 56, 55, 40];

// $scope.init=function(){
// 	$rootScope.showSpinner();
// 	SQUserHomeServices.GetChartData();
// };
// // $scope.init();


// $scope.barLables=[];
// $scope.barData=[];
// function formatData(response){
// console.log("formatData")
// $scope.barLables=[];
// $scope.data=[];
// if (response.pipeline) {
// $scope.barLables.push('Pipeline');
// $scope.barData.push(response.pipeline.totalQuote);
// }
// if (response.won) {
// $scope.barLables.push('Won');
// $scope.barData.push(response.won.totalQuote);
// };
// if (response.lost) {
// $scope.barLables.push('Lost');
// $scope.barData.push(response.lost.totalQuote);
// }	
// if (response.lost) {
// $scope.barLables.push('Closed');
// $scope.barData.push(response.closed.totalQuote);
// }
// };

// $scope.handleGetChartDataDoneResponse=function(data){
// 	$scope.productDetails={};
// 	if(data){
// 		if (data.code) {
// 			if(data.code.toUpperCase()=='SUCCESS'){
// 				formatData(data);
// 				$rootScope.hideSpinner();
// 			}else{
// 				$rootScope.hideSpinner();
// 			}
// 		}
// 	}
// };
// var cleanupEventGetChartDataDone = $scope.$on("GetChartDataDone", function(event, message){
// 	$scope.handleGetChartDataDoneResponse(message);      
// });

// var cleanupEventGetProductDetailsNotDone = $scope.$on("GetChartDataNotDone", function(event, message){
// 	$rootScope.alertServerError("Server error");
// 	$rootScope.hideSpinner();
// });



});