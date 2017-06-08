'use strict';

describe('Controller: AdministracionCtrl', function () {

  // load the controller's module
  beforeEach(module('nextbook20App'));

  var AdministracionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdministracionCtrl = $controller('AdministracionCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AdministracionCtrl.awesomeThings.length).toBe(3);
  });
});
