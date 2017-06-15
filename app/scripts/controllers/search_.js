'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the nextbook20App
 */
angular.module('nextbook20App')
  	.controller('search_Ctrl', function ($scope, $routeParams, mainService, $location, $routeSegment,colaboradores_Service) {
		mainService.info_perfil_busqueda().get({perfil:$routeParams.id}).$promise.then(function(data){
			$scope.data = data.respuesta;
		});
		$scope.tabnavigation = function(url) {
	   		$location.path(url);
	   	}

	   	$scope.ingresar = function() {
  			var ruc = $scope.email+'001'
  			colaboradores_Service.Get_Data_By_Ruc().get({ruc:ruc}).$promise.then(function(data){
  				if (data.respuesta) {
  					$location.path('/Colaboradores/'+$scope.email+'001');
  				}else{
  					$mdDialog.show(
			            $mdDialog.alert()
			            .parent(angular.element(document.querySelector('#dialogContainer')))
			            .clickOutsideToClose(true)
			            .title('LO SENTIMOS :(')
			            .textContent('NÚMERO DE RUC NO EXISTE')
			            .ok('ENTENDIDO')
			            .openFrom('#left')
			        );
  				}
  			});
	    }

	   	$scope.$routeSegment = $routeSegment;
	   	$scope.tabs = 	[	
	    					{icon : 'public', title : 'Biografia', url:'search/'+$routeParams.id+'/Publicacion'},
	    					{icon : 'account_box', title : 'Info', url:'search/'+$routeParams.id+'/Info'},
	    					{icon : 'location_on', title : '', url:'search/'+$routeParams.id+'/Ubicacion'},
	    					{icon : 'business', title : 'Similares', url:'search/'+$routeParams.id+'/Similares'},
	    					{icon : 'favorite', title : 'Favoritos', url:'search/'+$routeParams.id+'/Favoritos'},
	    					// {icon : 'group_work', title : 'Grupos', url:'search/'+$routeParams.id+'/Grupos'},
	    					// {icon : 'view_agenda', title : 'Agenda', url:'search/'+$routeParams.id+'/Agenda'}
	    				];
	    $scope.tabsini = 	[	
	    					{icon : 'public', title : 'Biografia', url:'nb/search/'+$routeParams.id+'/Publicacion'},
	    					{icon : 'account_box', title : 'Info', url:'nb/search/'+$routeParams.id+'/Info'},
	    					{icon : 'location_on', title : '', url:'nb/search/'+$routeParams.id+'/Ubicacion'},
	    					{icon : 'business', title : 'Similares', url:'nb/search/'+$routeParams.id+'/Similares'},
	    					{icon : 'favorite', title : 'Favoritos', url:'nb/search/'+$routeParams.id+'/Favoritos'},
	    					// {icon : 'group_work', title : 'Grupos', url:'nb/search/'+$routeParams.id+'/Grupos'},
	    					// {icon : 'view_agenda', title : 'Agenda', url:'nb/search/'+$routeParams.id+'/Agenda'}
	    				];
  	});
