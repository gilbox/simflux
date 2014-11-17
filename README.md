simflux
=======

simple Flux implementation


how?
----

    var Flux = simflux.Flux,
        dispatcher = Flux.dispatcher;

    // an object qualifies to be a store if it has name and actions
    var appStore = {
      name: 'appStore',
      actions: [ 'addTodo', 'removeTodo' ],
      addTodo: function(todo) { ... },
      removeTodo: function(todo) { ... }
    }
    
    // register appStore with Flux
    dispatcher.registerStore(appStore);
    
    // all async ops should be handled by the Action Creator
    var actionCreator = {
      addTodo: function(todo) {
        doSomethingAsync.then(function() {
          dispatcher.dispatch('addTodo', todo);
        });
      }
    }
    
    // do something!
    actionCreator.addTodo({ todo: 'My Todo' });


why?
----

- Less boilerplate
- Does not facilitate async Stores
- Easily list action dependencies without needing to rely on `waitFor`
- Circular dependency detection
- Tiny footprint


demo
----

[angular-simflux-experiment](https://github.com/gilbox/angular-simflux-experiment): Flux in angularjs


requirements
------------

- lodash

