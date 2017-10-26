'use strict';

describe('Service: parametrizacion', function () {

  // load the service's module
  beforeEach(module('nextbook20App'));

  // instantiate service
  var parametrizacion;
  beforeEach(inject(function (_parametrizacion_) {
    parametrizacion = _parametrizacion_;
  }));

  it('should do something', function () {
    expect(!!parametrizacion).toBe(true);
  });

});
