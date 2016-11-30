'use strict';

describe('Controller: registro_Ctrl', function () {

  // load the controller's module
  beforeEach(module('nextbook20App'));

  var registro_Ctrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    registro_Ctrl = $controller('registro_Ctrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(registro_Ctrl.awesomeThings.length).toBe(3);
  });
});
