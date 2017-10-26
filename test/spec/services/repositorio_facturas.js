'use strict';

describe('Service: repositorioFacturas', function () {

  // load the service's module
  beforeEach(module('nextbook20App'));

  // instantiate service
  var repositorioFacturas;
  beforeEach(inject(function (_repositorioFacturas_) {
    repositorioFacturas = _repositorioFacturas_;
  }));

  it('should do something', function () {
    expect(!!repositorioFacturas).toBe(true);
  });

});
