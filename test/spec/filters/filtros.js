'use strict';

describe('Filter: filtros', function () {

  // load the filter's module
  beforeEach(module('nextbook20App'));

  // initialize a new instance of the filter before each test
  var filtros;
  beforeEach(inject(function ($filter) {
    filtros = $filter('filtros');
  }));

  it('should return the input prefixed with "filtros filter:"', function () {
    var text = 'angularjs';
    expect(filtros(text)).toBe('filtros filter: ' + text);
  });

});
