'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:AppCtrl
 * @description
 * # AppCtrl
 * Controller of the nextbook20App
 */
var app = angular.module('nextbook20App');

app.controller('app_Ctrl', function($scope, $mdToast, $translate, menuService, configuracionService, $routeSegment,$localStorage) {

    // ------------------------------------inicio generacion vista menu personalizacion------------------------------------
    $scope.menu= menuService.Get_Vistas_Loged_User();
    $scope.menu = $scope.menu[0].children;

    for (var i = 0; i < $scope.menu.length; i++) {
      if ($scope.menu[i].nombre=="APP") {
        $scope.menu = $scope.menu[i].children;
        break;
      }
    }

    //tipos de menus
    for (var i = 0; i < $scope.menu.length; i++) {
        for (var j = 0; j < $scope.menu[i].children.length; j++) {
                if ($scope.menu[i].children[j].children.length>0) {
                    $scope.menu[i].limit=2;
                }else{
                    $scope.menu[i].limit=1;
                }
        }
    }

    $scope.set_menu=(submenu)=>{
        $localStorage.submenu=submenu;
    }
    // --------------------------------------fin generacion vista menu personalizacion-------------------------------------

        $scope.toppings = [{
            name: 'Pepperoni',
            wanted: true
        }, {
            name: 'Sausage',
            wanted: false
        }, {
            name: 'Black Olives',
            wanted: true
        }, {
            name: 'Green Peppers',
            wanted: false
        }];

        $scope.settings = [{
            name: 'Wi-Fi',
            extraScreen: 'Wi-fi menu',
            icon: 'device:network-wifi',
            enabled: true
        }, {
            name: 'Bluetooth',
            extraScreen: 'Bluetooth menu',
            icon: 'device:bluetooth',
            enabled: false
        }, ];

        $scope.messages = [{
            id: 1,
            title: "Message A",
            selected: false
        }, {
            id: 2,
            title: "Message B",
            selected: true
        }, {
            id: 3,
            title: "Message C",
            selected: true
        }, ];

        $scope.people = [{
            name: 'Janet Perkins',
            img: 'img/100-0.jpeg',
            newMessage: true
        }, {
            name: 'Mary Johnson',
            img: 'img/100-1.jpeg',
            newMessage: false
        }, {
            name: 'Peter Carlsson',
            img: 'img/100-2.jpeg',
            newMessage: false
        }];

        $scope.goToPerson = function(person, event) {
            $mdDialog.show(
                $mdDialog.alert()
                .title('Navigating')
                .textContent('Inspect ' + person)
                .ariaLabel('Person inspect demo')
                .ok('Neat!')
                .targetEvent(event)
            );
        };

        $scope.navigateTo = function(to, event) {
            $mdDialog.show(
                $mdDialog.alert()
                .title('Navigating')
                .textContent('Imagine being taken to ' + to)
                .ariaLabel('Navigation demo')
                .ok('Neat!')
                .targetEvent(event)
            );
        };

        $scope.doPrimaryAction = function(event) {
            $mdDialog.show(
                $mdDialog.alert()
                .title('Primary Action')
                .textContent('Primary actions can be used for one click actions')
                .ariaLabel('Primary click demo')
                .ok('Awesome!')
                .targetEvent(event)
            );
        };

        $scope.doSecondaryAction = function(event) {
            $mdDialog.show(
                $mdDialog.alert()
                .title('Secondary Action')
                .textContent('Secondary actions can be used for one click actions')
                .ariaLabel('Secondary click demo')
                .ok('Neat!')
                .targetEvent(event)
            );
        };

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
        if (isDlgOpen) return;
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