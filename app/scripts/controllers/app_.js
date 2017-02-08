'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:AppCtrl
 * @description
 * # AppCtrl
 * Controller of the nextbook20App
 */
var app = angular.module('nextbook20App');

  	app.controller('app_Ctrl', function ($scope, $mdToast, $translate) {
    	// $scope.apps = {}
    	// console.log('test');
    	// $mdToast.show({
     //      hideDelay   : 3000,
     //      position    : 'top right',
     //      controller  : 'ToastCtrl',
     //      templateUrl : 'views/notificaciones/guardar.html'
     //    });
     console.log(app);
    	
  	});
  	app.controller('ToastCtrl', function($scope, $mdToast, $mdDialog) {

		$scope.closeToast = function() {
			$mdToast.hide();
			// console.log(this);
   //      	if (isDlgOpen) return;

   //      	$mdToast
   //        		.hide()
   //        		.then(function() {
   //          	isDlgOpen = false;
   //        	});
      	};

      	$scope.openMoreInfo = function(e) {
	        if ( isDlgOpen ) return;
	        isDlgOpen = true;

	        $mdDialog
	          .show($mdDialog
	            .alert()
	            .title('More info goes here.')
	            .textContent('Something witty.')
	            .ariaLabel('More info')
	            .ok('Got it')
	            .targetEvent(e)
	          )
	          .then(function() {
	            isDlgOpen = false;
	          });
	    };
    });

