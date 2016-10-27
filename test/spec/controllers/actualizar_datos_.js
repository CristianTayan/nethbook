'use strict';

describe('Controller: ActualizarDatosCtrl', function () {

  // load the controller's module
  beforeEach(module('nextbook20App'));

  var ActualizarDatosCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ActualizarDatosCtrl = $controller('ActualizarDatos_Ctrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ActualizarDatosCtrl.awesomeThings.length).toBe(3);
  });
});
