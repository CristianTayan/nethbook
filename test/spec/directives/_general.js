'use strict';

describe('Directive: General', function () {

  // load the directive's module
  beforeEach(module('nextbook20App'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<-general></-general>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the General directive');
  }));
});
