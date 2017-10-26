'use strict';

describe('Controller: search_Ctrl', function () {

  // load the controller's module
  beforeEach(module('nextbook20App'));

  var search_Ctrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    search_Ctrl = $controller('search_Ctrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(search_Ctrl.awesomeThings.length).toBe(3);
  });
});
