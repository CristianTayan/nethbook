'use strict';

describe('Controller: main_Ctrl', function () {

  // load the controller's module
  beforeEach(module('nextbook20App'));

  var main_Ctrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    main_Ctrl = $controller('main_Ctrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(main_Ctrl.awesomeThings.length).toBe(3);
  });
});
