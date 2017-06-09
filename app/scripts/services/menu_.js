'use strict';

/**
 * @ngdoc service
 * @name nextbook20App.menu
 * @description
 * # menu_service
 * Service in the nextbook20App.
 */

angular.module('nextbook20App')
  	.service('menuService', function ($localStorage, $resource, urlService) {
    	
	    // ---------------------------------------------------------------GET VISTAS--------------------------------------------------------------//
	    	this.Get_Vistas = function() {
		        return $resource(urlService.server().appnext()+'Get_Vistas', {} , {
		            get: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};

	    	this.Get_Vistas_Loged_User = function() {
		        return $localStorage.menu;
	    	};

	    	this.Generar_Vista = function() {
		        return $resource(urlService.server().appnext()+'Get_Vistas_Loged_User', {} , {
		            get: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    	
	});

// //------------------------------------ SERVICIOS COMPARTIDOS DE MENU--------------------------------------
// app.factory('Servicios_SubMenu', function($localStorage) {
//     var obj_serv_modal = {};
   	
//    	obj_serv_modal.actualizar_submenu = function(array) {
//           obj_serv_modal.menu=array;
//     };
//     return obj_serv_modal;
// });
