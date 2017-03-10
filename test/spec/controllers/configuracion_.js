'use strict';

describe('Controller: ConfiguracionCtrlCtrl', function () {

  // load the controller's module
  beforeEach(module('nextbook20App'));

  var ConfiguracionCtrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConfiguracionCtrlCtrl = $controller('ConfiguracionCtrlCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ConfiguracionCtrlCtrl.awesomeThings.length).toBe(3);
  });
});
