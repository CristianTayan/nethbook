'use strict';

describe('Controller: ActualizarDatos_Ctrl', function () {

  // load the controller's module
  beforeEach(module('nextbook20App'));

  var ActualizarDatos_Ctrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ActualizarDatos_Ctrl = $controller('ActualizarDatos_Ctrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ActualizarDatos_Ctrl.awesomeThings.length).toBe(3);
  });
});
