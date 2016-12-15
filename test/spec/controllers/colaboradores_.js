'use strict';

describe('Controller: ColaboradoresCtrl', function () {

  // load the controller's module
  beforeEach(module('nextbook20App'));

  var ColaboradoresCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ColaboradoresCtrl = $controller('ColaboradoresCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ColaboradoresCtrl.awesomeThings.length).toBe(3);
  });
});
