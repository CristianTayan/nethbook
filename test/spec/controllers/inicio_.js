'use strict';

describe('Controller: inicio_Ctrl', function () {

  // load the controller's module
  beforeEach(module('nextbook20App'));

  var inicio_Ctrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    inicio_Ctrl = $controller('inicio_Ctrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(inicio_Ctrl.awesomeThings.length).toBe(3);
  });
});
