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
      var data = menuService.Get_Vistas_By_Tipo_User();
      $scope.menu = data.respuesta[0].children[0];
      // --------------------------------------fin generacion vista menu personalizacion-------------------------------------


      $scope.toppings = [
        { name: 'Pepperoni', wanted: true },
        { name: 'Sausage', wanted: false },
        { name: 'Black Olives', wanted: true },
        { name: 'Green Peppers', wanted: false }
      ];

      $scope.settings = [
        { name: 'Wi-Fi', extraScreen: 'Wi-fi menu', icon: 'device:network-wifi', enabled: true },
        { name: 'Bluetooth', extraScreen: 'Bluetooth menu', icon: 'device:bluetooth', enabled: false },
      ];

      $scope.messages = [
        {id: 1, title: "Message A", selected: false},
        {id: 2, title: "Message B", selected: true},
        {id: 3, title: "Message C", selected: true},
      ];

      $scope.people = [
        { name: 'Janet Perkins', img: 'img/100-0.jpeg', newMessage: true },
        { name: 'Mary Johnson', img: 'img/100-1.jpeg', newMessage: false },
        { name: 'Peter Carlsson', img: 'img/100-2.jpeg', newMessage: false }
      ];

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



      $(document).ready(function() {
        var preloadbg = document.createElement("img");
        preloadbg.src = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/245657/timeline1.png";

        $("#searchfield").focus(function() {
            if ($(this).val() == "Search contacts...") {
                $(this).val("");
            }
        });
        $("#searchfield").focusout(function() {
            if ($(this).val() == "") {
                $(this).val("Search contacts...");

            }
        });

        $("#sendmessage input").focus(function() {
            if ($(this).val() == "Send message...") {
                $(this).val("");
            }
        });
        $("#sendmessage input").focusout(function() {
            if ($(this).val() == "") {
                $(this).val("Send message...");

            }
        });

        $(".friend").each(function() {
            $(this).click(function() {
                var childOffset = $(this).offset();
                var parentOffset = $(this).parent().parent().offset();
                var childTop = childOffset.top - parentOffset.top;
                var clone = $(this).find('img').eq(0).clone();
                var top = childTop + 12 + "px";

                $(clone).css({
                    'top': top
                }).addClass("floatingImg").appendTo("#chatbox");

                setTimeout(function() {
                    $("#profile p").addClass("animate");
                    $("#profile").addClass("animate");
                }, 100);
                setTimeout(function() {
                    $("#chat-messages").addClass("animate");
                    $('.cx, .cy').addClass('s1');
                    setTimeout(function() {
                        $('.cx, .cy').addClass('s2');
                    }, 100);
                    setTimeout(function() {
                        $('.cx, .cy').addClass('s3');
                    }, 200);
                }, 150);

                $('.floatingImg').animate({
                    'width': "68px",
                    'left': '108px',
                    'top': '20px'
                }, 200);

                var name = $(this).find("p strong").html();
                var email = $(this).find("p span").html();
                $("#profile p").html(name);
                $("#profile span").html(email);

                $(".message").not(".right").find("img").attr("src", $(clone).attr("src"));
                $('#friendslist').fadeOut();
                $('#chatview').fadeIn();

                $('#close').unbind("click").click(function() {
                    $("#chat-messages, #profile, #profile p").removeClass("animate");
                    $('.cx, .cy').removeClass("s1 s2 s3");
                    $('.floatingImg').animate({
                        'width': "40px",
                        'top': top,
                        'left': '12px'
                    }, 200, function() {
                        $('.floatingImg').remove()
                    });

                    setTimeout(function() {
                        $('#chatview').fadeOut();
                        $('#friendslist').fadeIn();
                    }, 50);
                });

            });
        });
    });
    	// $scope.apps = {}
    	// console.log('test');
    	// $mdToast.show({
     //      hideDelay   : 3000,
     //      position    : 'top right',
     //      controller  : 'ToastCtrl',
     //      templateUrl : 'views/notificaciones/guardar.html'
     //    });
    var imagePath = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/245657/1_copy.jpg';
    $scope.todos = [
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
    ];

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

