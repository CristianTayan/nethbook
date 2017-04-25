'use strict';

describe('Controller: InvServiciosCtrl', function () {

  // load the controller's module
  beforeEach(module('nextbook20App'));

  var InvServiciosCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InvServiciosCtrl = $controller('InvServiciosCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(InvServiciosCtrl.awesomeThings.length).toBe(3);
  });
});
