'use strict';

describe('Service: consumirService', function () {

  // load the service's module
  beforeEach(module('nextbook20App'));

  // instantiate service
  var consumirService;
  beforeEach(inject(function (_consumirService_) {
    consumirService = _consumirService_;
  }));

  it('should do something', function () {
    expect(!!consumirService).toBe(true);
  });

});
