'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:AppCtrl
 * @description
 * # AppCtrl
 * Controller of the nextbook20App
 */
var app = angular.module('nextbook20App');

  	app.controller('app_Ctrl', function ($scope, $mdToast, $translate, menuService, configuracionService, $routeSegment) {
      
      // ------------------------------------inicio generacion vista menu personalizacion------------------------------------
      var data = menuService.Get_Vistas_Loged_User();
      $scope.menu = data.respuesta[0].children[0];
      // --------------------------------------fin generacion vista menu personalizacion-------------------------------------
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

