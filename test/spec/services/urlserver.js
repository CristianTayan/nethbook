'use strict';

describe('Service: urlserver', function () {

  // load the service's module
  beforeEach(module('nextbook20App'));

  // instantiate service
  var urlserver;
  beforeEach(inject(function (_urlserver_) {
    urlserver = _urlserver_;
  }));

  it('should do something', function () {
    expect(!!urlserver).toBe(true);
  });

});
