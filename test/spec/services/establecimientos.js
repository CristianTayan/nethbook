'use strict';

describe('Service: seleccionarSucursal', function () {

  // load the service's module
  beforeEach(module('nextbook20App'));

  // instantiate service
  var seleccionarSucursal;
  beforeEach(inject(function (_seleccionarSucursal_) {
    seleccionarSucursal = _seleccionarSucursal_;
  }));

  it('should do something', function () {
    expect(!!seleccionarSucursal).toBe(true);
  });

});
