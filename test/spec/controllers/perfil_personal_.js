'use strict';

describe('Controller: PerfilPersonalCtrl', function () {

  // load the controller's module
  beforeEach(module('nextbook20App'));

  var PerfilPersonalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PerfilPersonalCtrl = $controller('PerfilPersonalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PerfilPersonalCtrl.awesomeThings.length).toBe(3);
  });
});
