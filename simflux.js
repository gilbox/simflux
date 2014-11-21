(function() {

  var SimfluxDispatcher = function() {
    this.fluxDispatcher = new Flux.Dispatcher();
  };

  SimfluxDispatcher.prototype.registerStore = function(store) {
    store.$$$dispatcherToken = this.fluxDispatcher.register(function(payload) {
      if (store[payload.action]) store[payload.action].apply(store, payload.args);
    });
    return store;
  };

  SimfluxDispatcher.prototype.unregisterStore = function(store) {
    this.fluxDispatcher.unregister(store.$$$dispatcherToken);
    delete store.$$$dispatcherToken;
    return store;
  };

  // unlike Facebook's dispatcher, the first argument is action and after that
  // we can pass in any number of arguments
  //
  // Original: dispatcher.dispatch({ type: 'ACTION_TYPE', data: {whatever:data} })
  //      New: dispatcher.dispatch('ACTION_TYPE', arg1, arg2, ...)
  SimfluxDispatcher.prototype.dispatch = function(action) {
    return this.fluxDispatcher.dispatch({
      action: action,
      args: Array.prototype.slice.call(arguments, 1)
    });
  };

  // waitFor takes a list of stores instead of tokens
  SimfluxDispatcher.prototype.waitFor = function (stores) {
    var tokens = [];
    for (var i=0; i<stores.length; i++) {
      tokens.push(stores[i].$$$dispatcherToken);
    }
    return this.fluxDispatcher.waitFor(tokens);
  };

  // todo: use prototypical inheritance instead
  SimfluxDispatcher.prototype.isDispatching=function() {
    return this.fluxDispatcher.isDispatching();
  };

  var simflux = {
    version: 'pre-beta',
    Dispatcher: SimfluxDispatcher
  };

  // requirejs compatibility
  // borrowed from lodash:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Expose simflux to the global object even when an AMD loader is present in
    // case simflux is loaded with a RequireJS shim config.
    // See http://requirejs.org/docs/api.html#config-shim
    root.simflux = simflux;

    define(function() {
      return simflux;
    });
  } else {
    window.simflux = simflux;
  }
})();