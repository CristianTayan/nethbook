'use strict';

describe('Service: inventario', function () {

  // load the service's module
  beforeEach(module('nextbook20App'));

  // instantiate service
  var inventario;
  beforeEach(inject(function (_inventario_) {
    inventario = _inventario_;
  }));

  it('should do something', function () {
    expect(!!inventario).toBe(true);
  });

});
