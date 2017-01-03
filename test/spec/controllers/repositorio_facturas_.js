'use strict';

describe('Controller: RepositorioFacturasCtrl', function () {

  // load the controller's module
  beforeEach(module('nextbook20App'));

  var RepositorioFacturasCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepositorioFacturasCtrl = $controller('RepositorioFacturasCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RepositorioFacturasCtrl.awesomeThings.length).toBe(3);
  });
});
