'use strict';

describe('Controller: seleccionar_sucursal_Ctrl', function () {

  // load the controller's module
  beforeEach(module('nextbook20App'));

  var seleccionar_sucursal_Ctrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    seleccionar_sucursal_Ctrl = $controller('seleccionar_sucursal_Ctrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(seleccionar_sucursal_Ctrl.awesomeThings.length).toBe(3);
  });
});
