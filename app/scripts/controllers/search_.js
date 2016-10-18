'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the nextbook20App
 */
angular.module('nextbook20App')
  	.controller('search_Ctrl', function ($scope, $routeParams, mainService, $location, $routeSegment) {
		mainService.info_perfil_busqueda().get({perfil:$routeParams.id}).$promise.then(function(data){
			$scope.data = data.respuesta;
			console.log(data.respuesta);
		});
		$scope.tabnavigation = function(url) {
	   		$location.path(url);
	   	}
	   	$scope.$routeSegment = $routeSegment;
	   	$scope.tabs = 	[	
	    					{icon : 'public', title : 'Biografia', url:'search/'+$routeParams.id+'/Publicacion'},
	    					{icon : 'account_box', title : 'Info', url:'search/'+$routeParams.id+'/Info'},
	    					{icon : 'location_on', title : '', url:'search/'+$routeParams.id+'/Ubicacion'},
	    					{icon : 'business', title : 'Similares', url:'search/'+$routeParams.id+'/Similares'},
	    					{icon : 'favorite', title : 'Favoritos', url:'search/'+$routeParams.id+'/Favoritos'},
	    					{icon : 'group_work', title : 'Grupos', url:'search/'+$routeParams.id+'/Grupos'},
	    					{icon : 'view_agenda', title : 'Agenda', url:'search/'+$routeParams.id+'/Agenda'}
	    				];
  	});
