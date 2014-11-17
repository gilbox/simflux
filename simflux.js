/**
 * simflux
 * @author: Gil Birman
 */
(function() {
  function Dispatcher() {
    this.stores = [];
    this.storesHash = {};
    this.storeActionsHash = {};
    this.actionStoresHash = {};
  }

  Dispatcher.prototype.registerStore = function (store) {
    if (this.storesHash[store.name]) throw new Error('simflux: attempt to register store "'+store.name+'" but it was already registered.');

    this.stores.push(store);
    this.storesHash[store.name] = store;

    var actions;

    if (_.isArray(store.actions)) {

      // convert array of actions to objects

      actions = {};
      _.each(store.actions, function (action) {
        actions[action] = { action: action, deps: [] };
      });

    } else {

      // actions property is in object form

      actions = _.cloneDeep(store.actions);
      _.each(actions, function (v,k) {
        // convert array or string values to action
        if (_.isArray(v)) v = actions[k] = { action: k, deps: v };
        else if (_.isString(v)) v = actions[k] = { action: v, deps: [] };
        else
          // add empty deps array if it doesn't exist
          v.deps = v.deps || [];
      });

    }

    // now all actions are in format { action: '___', deps: [ ____, ____, ... ] }

    // add actions to actionStoresHash
    for (var action in actions) {
      if (this.actionStoresHash[action]) {
        this.actionStoresHash[action].push(store);
      } else {
        this.actionStoresHash[action] = [store];
      }
    }

    this.storeActionsHash[store.name] = actions;
  };

  // depth-first traversal of store actions dependency trees
  Dispatcher.prototype._dispatch = function (progress, action, store, args) {
    // Skip this store if it's already been dispatched
    if (progress.done[store.name]) return;

    // add this store to the progress chain (can be used to track down circular dependencies)
    progress.chain.unshift(store.name);

    // If this store was already visited, then we have found a circular dependency
    if (progress.visited[store.name]) {
      throw new Error('simflux: (' + action + ') circular dependencies ' + progress.chain.join('-->'));
    }

    // mark this store as visited
    progress.visited[store.name] = true;


    var actions = this.storeActionsHash[store.name]; // actions for this store
    var actionObj = actions[action];
    var deps = actionObj.deps;

    // recursively process this store's dependencies
    for (var i = 0; i<deps.length; i++) {
      this._dispatch(progress, action, this.storesHash[deps[i]], args);
    }

    // execute this store's action handler
    store[actionObj.action].apply(store, args);

    // add this store to the list of stores for which this action has been executed
    progress.done[store.name] = true;

    // remove this store from the progress chain
    progress.chain.shift();
  };

  Dispatcher.prototype.dispatch = function (action) {
    var self = this,
        args = Array.prototype.slice.call(arguments, 1),
        progress = {
          done: {},     // stores for which action was executed
          visited: {},  // stores visited
          chain: []     // current chain of stores visited
        };

    _.each(this.actionStoresHash[action], function (store) {
      self._dispatch(progress, action, store, args);
    });
  };

  function Flux() {
    this.dispatcher = new Dispatcher();
  }

  Flux.prototype.createStore = function (o) {
    this.dispatcher.registerStore(o);
    return {store:o};
  };

  window.simflux = {
    version: 'pre-beta',
    Flux: new Flux()
  };
})();