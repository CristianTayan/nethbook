'use strict';

describe('Service: configuracionService', function () {

  // load the service's module
  beforeEach(module('nextbook20App'));

  // instantiate service
  var configuracionService;
  beforeEach(inject(function (_configuracionService_) {
    configuracionService = _configuracionService_;
  }));

  it('should do something', function () {
    expect(!!configuracionService).toBe(true);
  });

});
