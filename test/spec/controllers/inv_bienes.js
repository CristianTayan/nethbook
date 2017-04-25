'use strict';

describe('Controller: InvBienesCtrl', function () {

  // load the controller's module
  beforeEach(module('nextbook20App'));

  var InvBienesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InvBienesCtrl = $controller('InvBienesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(InvBienesCtrl.awesomeThings.length).toBe(3);
  });
});
