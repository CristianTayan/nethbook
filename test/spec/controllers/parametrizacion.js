'use strict';

describe('Controller: ParametrizacionCtrl', function () {

  // load the controller's module
  beforeEach(module('nextbook20App'));

  var ParametrizacionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ParametrizacionCtrl = $controller('ParametrizacionCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ParametrizacionCtrl.awesomeThings.length).toBe(3);
  });
});
