'use strict';

describe('Controller: dashboard_Ctrl', function () {

  // load the controller's module
  beforeEach(module('nextbook20App'));

  var dashboard_Ctrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    dashboard_Ctrl = $controller('dashboard_Ctrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(dashboard_Ctrl.awesomeThings.length).toBe(3);
  });
});
