simflux
=======

Framework-agnostic, simple Flux wrapper on top of Facebook's Flux


how?
----

    var dispatcher = new simflux.dispatcher();

    // an object qualifies to be a store if it has methods
    // named the same as actions
    var appStore = {
      addTodo: function(todo, priority) { ... },
      removeTodo: function(todo) { ... }
    }
    
    // register appStore with Flux
    dispatcher.registerStore(appStore);
    
    // all async ops should be handled by the Action Creator
    var actionCreator = {
      addTodo: function(todo, priority) {
        doSomethingAsync.then(function() {
          dispatcher.waitFor([otherStore, anotherStore]);
          dispatcher.dispatch('addTodo', todo, priority);
        });
      }
    }
    
    // in the view: do something!
    actionCreator.addTodo({ todo: 'My Todo' }, 'top priority');


why?
----

- Less boilerplate
- Easier to read

differences
-----------

### dispatch

Flux:

    dispatcher.dispatch( { type: 'ACTION_TYPE', data: { allthe: data} );

simflux:

    dispatcher.dispatch('ACTION_TYPE', arg1, arg2, ... );

### register, waitFor

Flux:

    var todoStore = {
      handleAllActions: function(payload) {
        switch(payload.type) {
          case 'addTodo':
            dispatcher.waitFor([anotherStore.dispatcherToken]);
            ...
            break;
        }
      }
    };

    todoStore.dispatcherToken = dispatcher.register(todoStore.handleAllActions);

simflux:

    var todoStore = {
      addTodo: function(todo) {
        dispatcher.waitFor([anotherStore])
        ...
      }
    }

    dispatcher.registerStore(todoStore);



demo
----

[angular-simflux-experiment](https://github.com/gilbox/angular-simflux-experiment): Flux in angularjs


requirements
------------

- [Facebook's Flux](https://github.com/facebook/flux) Implementation

