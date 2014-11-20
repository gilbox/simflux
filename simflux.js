(function() {

  var SimDispatcher = function() {
    this.fluxDispatcher = new Flux.Dispatcher();
  };

  SimDispatcher.prototype.registerStore = function(store) {
    store.$$$dispatcherToken = this.fluxDispatcher.register(function(payload) {
      if (store[payload.action]) store[payload.action](payload.data);
    });
    return store;
  };

  SimDispatcher.prototype.unregisterStore = function(store) {
    this.fluxDispatcher.unregister(store.$$$dispatcherToken);
    delete store.$$$dispatcherToken;
    return store;
  };

  SimDispatcher.prototype.dispatch = function(action, data) {
    return this.fluxDispatcher.dispatch({
      action: action,
      data: data
    });
  };

  SimDispatcher.prototype.waitFor = function (stores) {
    var tokens = [];
    for (var i=0; i<stores.length; i++) {
      tokens.push(stores[i].$$$dispatcherToken);
    }
    return this.fluxDispatcher.waitFor(tokens);
  };

  // todo: use prototypical inheritance instead
  SimDispatcher.prototype.isDispatching=function() {
    return this.fluxDispatcher.isDispatching();
  };

  window.simflux = {
    version: 'pre-beta',
    Dispatcher: SimDispatcher
  };

})();