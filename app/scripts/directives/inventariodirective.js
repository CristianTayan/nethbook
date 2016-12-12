'use strict';

/**
 * @ngdoc directive
 * @name nextbook20App.directive:inventarioDirective
 * @description
 * # inventarioDirective
 */
var app = angular.module('nextbook20App');
  app.directive('inventarioDirective', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the inventarioDirective directive');
      }
    };
  });
  app.directive('tipocategoriaValidator', function($q, inventario_Service) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$asyncValidators.campo = function(modelValue, viewValue) {
            	return inventario_Service.Existencia_Tipo_Categoria().consulta({name: viewValue}).$promise.then(function(data){
                    if (!data.respuesta) {
                        return $q.reject('proceso');
                    }
        			return true;
		    	     });
            };
        }
    };
  });

  //------------------------------------------------------------------ INICIO TIPO GARANTIA ------------------------------------------------------------------//
    app.directive('tipogarantiaValidator', function($q, inventario_Service) {
      return {
          require: 'ngModel',
          link: function(scope, element, attrs, ngModel) {
              ngModel.$asyncValidators.campo = function(modelValue, viewValue) {
                return inventario_Service.Existencia_Tipo_Garantia().consulta({nombre: viewValue}).$promise.then(function(data){
                      if (!data.respuesta) {
                          return $q.reject('proceso');
                      }
                return true;
                 });
              };
          }
      };
    });
  //-------------------------------------------------------------------- FIN TIPO GARANTIA ------------------------------------------------------------------//

  //------------------------------------------------------------------ INICIO TIPO CONSUMO ------------------------------------------------------------------//
    app.directive('tipoconsumoValidator', function($q, inventario_Service) {
      return {
          require: 'ngModel',
          link: function(scope, element, attrs, ngModel) {
              ngModel.$asyncValidators.campo = function(modelValue, viewValue) {
                return inventario_Service.Existencia_Tipo_Consumo().consulta({nombre: viewValue}).$promise.then(function(data){
                      if (!data.respuesta) {
                          return $q.reject('proceso');
                      }
                return true;
                 });
              };
          }
      };
    });
  //-------------------------------------------------------------------- FIN TIPO CONSUMO ------------------------------------------------------------------//
  
  //------------------------------------------------------------------ INICIO TIPO PRODUCTOS ------------------------------------------------------------------//
    app.directive('tipoproductosValidator', function($q, inventario_Service) {
      return {
          require: 'ngModel',
          link: function(scope, element, attrs, ngModel) {
              ngModel.$asyncValidators.campo = function(modelValue, viewValue) {
                return inventario_Service.Existencia_Tipo_Productos().consulta({nombre: viewValue}).$promise.then(function(data){
                      if (!data.respuesta) {
                          return $q.reject('proceso');
                      }
                return true;
                });
              };
          }
      };
    });
  //-------------------------------------------------------------------- FIN TIPO PRODUCTOS ------------------------------------------------------------------//
  //------------------------------------------------------------------ INICIO TIPO PRODUCTOS ------------------------------------------------------------------//
    app.directive('tipocatalogoValidator', function($q, inventario_Service) {
      return {
          require: 'ngModel',
          link: function(scope, element, attrs, ngModel) {
              ngModel.$asyncValidators.campo = function(modelValue, viewValue) {
                return inventario_Service.Existencia_Tipo_Catalogo().consulta({nombre: viewValue}).$promise.then(function(data){
                      if (!data.respuesta) {
                          return $q.reject('proceso');
                      }
                return true;
                });
              };
          }
      };
    });
  //-------------------------------------------------------------------- FIN TIPO PRODUCTOS ------------------------------------------------------------------//
  //------------------------------------------------------------------ INICIO TIPO PRODUCTOS ------------------------------------------------------------------//
    app.directive('marcaValidator', function($q, inventario_Service) {
      return {
          require: 'ngModel',
          link: function(scope, element, attrs, ngModel) {
              ngModel.$asyncValidators.campo = function(modelValue, viewValue) {
                return inventario_Service.Existencia_Marca().consulta({nombre: viewValue}).$promise.then(function(data){
                      if (!data.respuesta) {
                          return $q.reject('proceso');
                      }
                return true;
                });
              };
          }
      };
    });
  //-------------------------------------------------------------------- FIN TIPO PRODUCTOS ------------------------------------------------------------------//
  //------------------------------------------------------------------ INICIO TIPO MODELOS ------------------------------------------------------------------//
    app.directive('modelosValidator', function($q, inventario_Service) {
      return {
          require: 'ngModel',
          link: function(scope, element, attrs, ngModel) {
              ngModel.$asyncValidators.campo = function(modelValue, viewValue) {
                return inventario_Service.Existencia_Modelos().consulta({nombre: viewValue}).$promise.then(function(data){
                      if (!data.respuesta) {
                          return $q.reject('proceso');
                      }
                return true;
                });
              };
          }
      };
    });
  //-------------------------------------------------------------------- FIN TIPO MODELOS ------------------------------------------------------------------//

  //------------------------------------------------------------------ INICIO TIPO UBICACION ------------------------------------------------------------------//
    app.directive('ubicacionValidator', function($q, inventario_Service) {
      return {
          require: 'ngModel',
          link: function(scope, element, attrs, ngModel) {
              ngModel.$asyncValidators.campo = function(modelValue, viewValue) {
                return inventario_Service.Existencia_Ubicacion().consulta({nombre: viewValue}).$promise.then(function(data){
                      if (!data.respuesta) {
                          return $q.reject('proceso');
                      }
                return true;
                });
              };
          }
      };
    });
  //-------------------------------------------------------------------- FIN TIPO UBICACION ------------------------------------------------------------------//

  //------------------------------------------------------------------ INICIO TIPO UBICACION ------------------------------------------------------------------//
    app.directive('garantiaValidator', function($q, inventario_Service) {
      return {
          require: 'ngModel',
          link: function(scope, element, attrs, ngModel) {
              ngModel.$asyncValidators.campo = function(modelValue, viewValue) {
                return inventario_Service.Existencia_Garantia().consulta({nombre: viewValue}).$promise.then(function(data){
                      if (!data.respuesta) {
                          return $q.reject('proceso');
                      }
                return true;
                });
              };
          }
      };
    });
  //-------------------------------------------------------------------- FIN TIPO UBICACION ------------------------------------------------------------------//

  //------------------------------------------------------------------ INICIO ESTADO DESCRIPTIVO ------------------------------------------------------------------//
    app.directive('estadodescriptivoValidator', function($q, inventario_Service) {
      return {
          require: 'ngModel',
          link: function(scope, element, attrs, ngModel) {
              ngModel.$asyncValidators.campo = function(modelValue, viewValue) {
                return inventario_Service.Existencia_Estado_Descriptivo().consulta({nombre: viewValue}).$promise.then(function(data){
                      if (!data.respuesta) {
                          return $q.reject('proceso');
                      }
                return true;
                });
              };
          }
      };
    });
  //-------------------------------------------------------------------- FIN ESTADO DESCRIPTIVO ------------------------------------------------------------------//