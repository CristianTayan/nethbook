'use strict';

describe('Controller: MainCtrlCtrl', function () {

  // load the controller's module
  beforeEach(module('nextbook20App'));

  var MainCtrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrlCtrl = $controller('main_Ctrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MainCtrlCtrl.awesomeThings.length).toBe(3);
  });
});
