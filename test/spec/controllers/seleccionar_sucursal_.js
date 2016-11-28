'use strict';

describe('Controller: seleccionar_sucursal_', function () {

  // load the controller's module
  beforeEach(module('nextbook20App'));

  var seleccionar_sucursal_,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    seleccionar_sucursal_ = $controller('seleccionar_sucursal_', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(seleccionar_sucursal_.awesomeThings.length).toBe(3);
  });
});
