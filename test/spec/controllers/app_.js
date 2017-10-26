'use strict';

describe('Controller: app_Ctrl', function () {

  // load the controller's module
  beforeEach(module('nextbook20App'));

  var app_Ctrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    app_Ctrl = $controller('app_Ctrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(app_Ctrl.awesomeThings.length).toBe(3);
  });
});
