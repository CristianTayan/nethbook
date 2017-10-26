'use strict';

describe('Directive: uiTree.js', function () {

  // load the directive's module
  beforeEach(module('nextbook20App'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<ui-tree.js></ui-tree.js>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the uiTree.js directive');
  }));
});
