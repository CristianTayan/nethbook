'use strict';

describe('Controller: InventarioBienesCtrl', function () {

  // load the controller's module
  beforeEach(module('nextbook20App'));

  var InventarioBienesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InventarioBienesCtrl = $controller('InventarioBienesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(InventarioBienesCtrl.awesomeThings.length).toBe(3);
  });
});
