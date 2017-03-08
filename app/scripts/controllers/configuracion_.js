'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:ConfiguracionCtrl
 * @description
 * # ConfiguracionCtrl
 * Controller of the nextbook20App
 */
angular.module('nextbook20App')
  	.controller('configuracionCtrl', function ($mdExpansionPanel) {
  		/// async 
		  $mdExpansionPanel().waitFor('panelOne').then(function (instance) {
		    instance.expand();
		    instance.collapse({animation: false});
		    instance.remove();
		    instance.isOpen();
		  });
		 
		  // sync 
		  $mdExpansionPanel('panelOne').expand();
  	});
