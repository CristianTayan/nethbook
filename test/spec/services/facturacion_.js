'use strict';

describe('Service: facturacion', function () {

  // load the service's module
  beforeEach(module('nextbook20App'));

  // instantiate service
  var facturacion;
  beforeEach(inject(function (_facturacion_) {
    facturacion = _facturacion_;
  }));

  it('should do something', function () {
    expect(!!facturacion).toBe(true);
  });

});
