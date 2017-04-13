'use strict';

describe('Directive: parametrizacion', function () {

  // load the directive's module
  beforeEach(module('nextbook20App'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<parametrizacion></parametrizacion>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the parametrizacion directive');
  }));
});
