'use strict';

describe('Controller: InvProductosCtrl', function () {

  // load the controller's module
  beforeEach(module('nextbook20App'));

  var InvProductosCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InvProductosCtrl = $controller('InvProductosCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(InvProductosCtrl.awesomeThings.length).toBe(3);
  });
});
