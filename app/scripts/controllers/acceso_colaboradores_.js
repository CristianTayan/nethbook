'use strict';
var app = angular.module('nextbook20App');
  app.controller('acceso_colaboradores_Ctrl', function ($scope, $rootScope,$location, $routeParams,$mdDialog, mainService, colaboradores_Service,consumirService, $localStorage, menuService) {
    colaboradores_Service.Get_Data_By_Ruc().get({ruc:$routeParams.ruc}).$promise.then((data) => {
      $scope.datosE = data.respuesta;
    });


    $scope.openModalRecuperarClave = () => {
      $scope.data_ingreso_colaborador = {nick: '', clave: ''};

      $mdDialog.show({
        controller: modalRecuperarClaveCtrl,
        templateUrl: 'views/acceso-colaboradores/modaRecuperarClave.html',
        clickOutsideToClose:true,
        locals: {dataModal: $scope.datosE}
      })
      .then(function(respuesta) {
        var objDataInfoUsuario = {'ruc' : $routeParams.ruc , 'nick': null, 'correo': null};
        
        if (validateEmail(respuesta.nick)) {
          objDataInfoUsuario.correo = respuesta.nick;
        }
        if (!validateEmail(respuesta.nick)) {
          objDataInfoUsuario.nick = respuesta.nick;
        }

        mainService.recuperaClave().get(objDataInfoUsuario).$promise.then(function(data){
          if (data.respuesta === true) {
            $mdDialog.show(
              $mdDialog.alert()
              .parent(angular.element(document.querySelector('#dialogContainer')))
              .clickOutsideToClose(true)
              .title('Envio de Credenciales')
              .textContent('Revice el Correo Electronico Propietario de su Cuenta')
              .ok('Entendido')
              .openFrom('#left')
            );                    
          }else if (data.respuesta === false) {
            $mdDialog.show(
              $mdDialog.alert()
              .parent(angular.element(document.querySelector('#dialogContainer')))
              .clickOutsideToClose(true)
              .title('Envio de Credenciales')
              .textContent('Las Credenciales ingresadas no son Validas')
              .ok('Entendido')
              .openFrom('#left')
            );
          }else if (data.respuesta !== false && data.respuesta !== true) {
            $mdDialog.show(
              $mdDialog.alert()
              .parent(angular.element(document.querySelector('#dialogContainer')))
              .clickOutsideToClose(true)
              .title('Envio de Credenciales')
              .textContent(data.respuesta)
              .ok('Entendido')
              .openFrom('#left')
            );
          }
        }); 
      });
    }

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email.toLowerCase());
    }

    function modalRecuperarClaveCtrl($scope, $mdDialog, dataModal) {
      $scope.datos = dataModal;
      $scope.cancel = function() {
        $mdDialog.cancel();
      };

      $scope.guardar = function() {
        $mdDialog.hide($scope.data_ingreso_colaborador);
      };
    }

    var contadorIngreso = 0;
    $scope.ingresar_colaborador = function() {
      $scope.data_ingreso_colaborador.ruc=$routeParams.ruc;
      var obj = $scope.data_ingreso_colaborador;
      colaboradores_Service.Ingresar_Colaborador().acceso({acceso:obj,info_servidor:'', ip_cliente:'192.168.0.1', macadress:'00:00:00:00:00'}).$promise.then(function(data) {
      if (data.respuesta === false && contadorIngreso <= 3) {
          $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#dialogContainer')))
            .clickOutsideToClose(true)
            .title('Lo sentimos :(')
            .textContent('Usuario o password incorrecto, vuelva a intentar')
            .ok('Entendido')
            .openFrom('#left')
        );
        contadorIngreso ++;
      }
      if (data.respuesta === false && contadorIngreso > 3) {
        var obje1 = {'ruc' : null , 'nick': null, 'correo': null};
        var confirm = $mdDialog.prompt()
            .title('¿Recuperar Clave/password de acceso?')
            .textContent('Ingrese su Nick o Correo electronico')
            .placeholder('Nick ó E-mail')               
            .required(true)
            .ok('RECUPERAR')
            .cancel('CANCELAR');
        $mdDialog.show(confirm).then(function(result) {
          if (result.indexOf("@") > 0) {
            obje1.correo = result;
            obje1.nick = 1;
            obje1.ruc = $routeParams.ruc;                                   
          }
          if (result.indexOf("@") < 0) {
            obje1.nick = result;
            obje1.correo = 1;
            obje1.ruc = $routeParams.ruc;
          }
          mainService.recuperaClave().get(obje1).$promise.then(function(data){
            var textorespuesta = data.respuesta;
            if (data.respuesta === true) {
              $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.querySelector('#dialogContainer')))
                .clickOutsideToClose(true)
                .title('Envio de Credenciales')
                .textContent('Revice el Correo Electronico Propietario de su Cuenta')
                .ok('Entendido')
                .openFrom('#left')
              );                    
            }else if (data.respuesta === false) {
              $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.querySelector('#dialogContainer')))
                .clickOutsideToClose(true)
                .title('Envio de Credenciales')
                .textContent('Las Credenciales ingresadas no son Validas')
                .ok('Entendido')
                .openFrom('#left')
              );
            }else if (data.respuesta !== false && data.respuesta !== true) {
              $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.querySelector('#dialogContainer')))
                .clickOutsideToClose(true)
                .title('Envio de Credenciales')
                .textContent(textorespuesta)
                .ok('Entendido')
                .openFrom('#left')
              );
            }
          });               
        }, function() {
          $location.path('/Registro');
        });
      }
      if (data.respuesta == true) {
          $localStorage.token = data.token;
          $localStorage.datosE = data.datosE;
          $localStorage.datosPersona = data.datosPersona;
          $localStorage.hsesion={hora_fin:new Date(data.hora_fin).getTime() / 1000,estado_token:1};          
          // ----------------------------- fin -----------------------------------
          //---------------------- verificar si existe datos de persona-----------
          mainService.Get_Datos_Empresa().get().$promise.then(function(data) {
            if (data.respuesta) {
              //iniciar sesion
              $rootScope.$emit('start_session',{});
                $location.path('/Seleccionar_Sucursal');
            } else {
                $location.path('/Actualizar_Datos');
            }
          });
          // generacion acceso personalizado
          menuService.Generar_Vista().get().$promise.then(function(data) {
            $localStorage.menu = data.respuesta;
          });

        if (!$localStorage.cook_session_init) {
          var obj  =  [{
            'id_empresa': $localStorage.datosE.id,
            'ruc_empresa': $routeParams.ruc,
            'razon_social': $localStorage.datosE.razon_social,
            'datos_usuario': $localStorage.datosPersona.primer_nombre+' '+$localStorage.datosPersona.primer_apellido,
            'nick': $scope.data_ingreso_colaborador.nick,
            'foto': null
          }];
          $localStorage.cook_session_init = obj;
        }else{
          obj  =  {
            'id_empresa': $localStorage.datosE.id,
            'ruc_empresa': $routeParams.ruc,
            'razon_social': $localStorage.datosE.razon_social,
            'datos_usuario': $localStorage.datosPersona.primer_nombre+' '+$localStorage.datosPersona.primer_apellido,
            'nick': $scope.data_ingreso_colaborador.nick,
            'foto': null
          };
          var acumulador = $localStorage.cook_session_init;                       
          var resultado = buscar_existencia(acumulador, obj);
          if (!resultado) {
            acumulador.push(obj);
            $localStorage.cook_session_init = acumulador;
          }
        }
      }
    });
    }
    function buscar_existencia(acumulador, obj){
      for (var i = 0; i < acumulador.length; i++) {
        if ( acumulador[i].ruc_empresa == obj.ruc_empresa && acumulador[i].nick == obj.nick) 
          return true;
      }
    }
  });