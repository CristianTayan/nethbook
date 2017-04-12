'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:PerfilCtrl
 * @description
 * # PerfilCtrl
 * Controller of the nextbook20App
 */
angular.module('nextbook20App')
  .controller('perfil_Ctrl', function ($scope, $localStorage, $mdDialog, $timeout, urlService) {
    $scope.imgPortada = 'http://4.bp.blogspot.com/-rf5TPOMiIVQ/VZJ6U22eecI/AAAAAAAAAfA/E1QP30963M0/s1600/Foto-construir-una-gran-empresa-6.png';
    $scope.datos2 = $localStorage.datosE;



    $scope.show_listaimg_modal = function(ev){
    	$mdDialog.show({
	      controller: Dialog_subir_image_Controller,
	      templateUrl: 'views/dashboard/perfil_sucursal/subir_img.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:false,
	      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
	    })
	    .then(function(answer) {
	      $scope.status = 'You said the information was "' + answer + '".';
	    }, function() {
	      $scope.status = 'You cancelled the dialog.';
	    });
    }


    function Dialog_subir_image_Controller($scope, $timeout, urlService, $localStorage,$http){


    	// // -------------------------------elementos acciones show_listaimg_modal-------------------------------
    	// $scope.hide = function() {
	    //   $mdDialog.hide();
	    // };

	    $scope.cancel = function() {
	      $mdDialog.cancel();
	    };

	    // $scope.answer = function(answer) {
	    //   $mdDialog.hide(answer);
	    // };
    	// // -------------------------------elementos acciones upload file-------------------------------
    	// $scope.$watch('files', function () {
	    //     $scope.upload($scope.files);
	    // });
	    // $scope.$watch('file', function () {
	    //     if ($scope.file != null) {
	    //         $scope.files = [$scope.file]; 
	    //     }
	    // });
	    // $scope.log = '';

    	// $scope.upload = function (files) {
   		
<<<<<<< HEAD
	        // if (files) {
	        //   	console.log(files);
	        //     Upload.upload({
	        //         url: urlService.server().appnext()+'Add_Img_Portada',
	        //         method: 'POST',
	        //         // url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
	        //         data: {
	        //           file: files,
	        //           token: $localStorage.token
	        //         }
	        //     }).then(function (resp) {
	        //     	console.log('resp',resp);
	        //         // $timeout(function() {
	        //         //     $scope.log = 'file: ' +
	        //         //     resp.config.data.file.name +
	        //         //     ', Response: ' + JSON.stringify(resp.data) +
	        //         //     '\n' + $scope.log;
	        //         // });
	        //     }, null, function (evt) {
	        //     	console.log('evt', evt);
	        //         // var progressPercentage = parseInt(100.0 *
	        //         // 		evt.loaded / evt.total);
	        //         // $scope.log = 'progress: ' + progressPercentage + 
	        //         // 	'% ' + evt.config.data.file.name + '\n' + 
	        //         //   $scope.log;
	        //     });
	        // }
=======
	    //     if (files) {
	    //       	console.log(files);
	    //         Upload.upload({
	    //             url: urlService.server().appnext()+'Add_Img_Portada',
	    //             method: 'POST',
	    //             // url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
	    //             data: {
	    //               file: files,
	    //               token: $localStorage.token
	    //             }
	    //         }).then(function (resp) {
	    //         	console.log('resp',resp);
	    //             // $timeout(function() {
	    //             //     $scope.log = 'file: ' +
	    //             //     resp.config.data.file.name +
	    //             //     ', Response: ' + JSON.stringify(resp.data) +
	    //             //     '\n' + $scope.log;
	    //             // });
	    //         }, null, function (evt) {
	    //         	console.log('evt', evt);
	    //             // var progressPercentage = parseInt(100.0 *
	    //             // 		evt.loaded / evt.total);
	    //             // $scope.log = 'progress: ' + progressPercentage + 
	    //             // 	'% ' + evt.config.data.file.name + '\n' + 
	    //             //   $scope.log;
	    //         });
	    //     }
>>>>>>> origin/master
	    	
    	// }


    	 $scope.Upload = function(){
            var formData = new FormData();
            formData.append('token', $localStorage.token);

            angular.forEach($scope.files,function(obj){
                if(!obj.isRemote){
                    formData.append('files[]', obj.lfFile);
                }
            });
            $http.post(urlService.server().appnext()+'Add_Img_Portada', formData, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined,Authorization: 'Bearer ' + $localStorage.token}
            }).then(function(result){
                console.log('Datos Guardados Correctamente');               
            },function(err){
                if (err.status==401) {
                    $localStorage.$reset();
                    $location.path('/');
            }
            console.log('Ha ocurrido un error intentalo nuevamente :(');
            });
        };

    }

    $scope.show_recordimg_modal = function(ev){
    	$mdDialog.show({
	      controller: Dialog_recortat_image_Controller,
	      templateUrl: 'views/dashboard/perfil_sucursal/recortar_img.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:false,
	      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
	    })
	    .then(function(answer) {
	      $scope.status = 'You said the information was "' + answer + '".';
	    }, function() {
	      $scope.status = 'You cancelled the dialog.';
	    });
    }

    function Dialog_recortat_image_Controller($scope) {

        var widths = {
            'small': 300,
            'medium': 500,
            'big': 800
          };
          $scope.selectionWidth = 100;
          $scope.selectionHeight = 70;
          $scope.size = 'small';
          $scope.width = widths[$scope.size];
          $scope.image = 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRQO-QX1K8JoXc2sAabnBOmQG1nWK_C_IG7p1SoNrDo-xx8sIHN';

          $scope.$watch('size', function(value) {
            if (value) {
              $scope.width = widths[value]
            }
          });
    }
  });
