simflux
=======

Framework-agnostic, simple Flux wrapper on top of Facebook's Flux

simflux-viz
-----------

**[simflux-viz](https://github.com/gilbox/simflux-viz)** is a chrome extension and visualization library
for simflux that aids developers to understand application flow.

how?
----

    var dispatcher = new simflux.Dispatcher();

    // an object qualifies to be a store if it has methods
    // named the same as the actions it should handle
    var appStore = {
      todos: [],
      addTodo: function(todo, priority) { 
        dispatcher.waitFor([otherStore, anotherStore]);
        this.todos.push({
          todo: todo,
          priority: priority
        });
      },
      removeTodo: function(todo) { ... }
    }
    
    // register appStore with Flux
    dispatcher.registerStore(appStore);
    
    // all async ops should be handled by the Action Creator
    var actionCreator = {
      addTodo: function(todo, priority) {
        doSomethingAsync.then(function() {
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



access the flux dispatcher
--------------------------

Occasionally, you might want the extra power that Facebook's dispatcher gives you, in which case you can access the instance of the Facebook dispatcher that simflux uses internally via: `dispatcher.fluxDispatcher`

For example, if you want a store to handle any action that begins with `add`:

    var dispatcher = new simflux.Dispatcher();
    
    var appStore = {
      handleActions: function(payload) {
        var action = payload.action,
            args = payload.args;
        
        if (action.indexOf('add') === 0) {
            // do something with args
        }
      }
    }
    
    // register appStore.handleActions with Flux
    dispatcher.fluxDispatcher.register(appStore.handleActions);

demo
----

[angular-simflux-experiment](https://github.com/gilbox/angular-simflux-experiment): Flux in angularjs


requirements
------------

- [Facebook's Flux](https://github.com/facebook/flux) Implementation

