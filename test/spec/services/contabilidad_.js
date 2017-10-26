'use strict';

describe('Service: contabilidad', function () {

  // load the service's module
  beforeEach(module('nextbook20App'));

  // instantiate service
  var contabilidad;
  beforeEach(inject(function (_contabilidad_) {
    contabilidad = _contabilidad_;
  }));

  it('should do something', function () {
    expect(!!contabilidad).toBe(true);
  });

});
