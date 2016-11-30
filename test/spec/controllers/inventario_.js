'use strict';

describe('Controller: inventario_Ctrl', function () {

  // load the controller's module
  beforeEach(module('nextbook20App'));

  var inventario_Ctrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    inventario_Ctrl = $controller('inventario_Ctrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(inventario_Ctrl.awesomeThings.length).toBe(3);
  });
});
