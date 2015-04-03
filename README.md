simflux
=======

Framework-agnostic, simple Flux wrapper on top of Facebook's Flux

simflux-viz
-----------

**[simflux-viz](https://github.com/gilbox/simflux-viz)** is a plugin for
**[vizone](https://github.com/gilbox/vizone)**, a chrome extension and visualization library
that aids developers to understand application flow.

how?
----

    var dispatcher = new simflux.Dispatcher();

    // an object qualifies to be a store if it has methods
    // named the same as the actions it should handle
    var appStore = {
      todos: [],
      addTodo(payload) { 
        dispatcher.waitFor([otherStore, anotherStore]);
        this.todos.push({
          todo: payload.todo,
          priority: payload.priority
        });
      },
      removeTodo(payload) { ... }
    }
    
    // register appStore with Flux
    dispatcher.registerStore(appStore);
    
    // all async ops should be handled by the Action Creator
    var actionCreator = {
      addTodo(todo, priority) {
        doSomethingAsync.then(function() {
          dispatcher.dispatch('addTodo', {todo, priority});
        });
      }
    }

    // register appStore with Flux
    dispatcher.registerActionCreator(actionCreator);
    
    // in the view: do something!
    actionCreator.addTodo({ todo: 'My Todo', priority: 'top priority' });


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
      handleAllActions(payload) {
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
      addTodo(payload) {
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
      handleActions(o) {
        var action = o.action,
            payload = o.args[0];
        
        if (action.indexOf('add') === 0) {
            // do something with args
        }
      }
    }
    
    // register appStore.handleActions with Flux
    dispatcher.fluxDispatcher.register(appStore.handleActions);

demo
----

- [angular-simflux-experiment](https://github.com/gilbox/angular-simflux-experiment): Flux in angularjs

- [angular-flux-routing-example](https://github.com/gilbox/angular-flux-routing-example): Another angularjs demo created for the article [Achieving reasonable and scalable routing in AngularJS with Flux](https://medium.com/@gilbox/achieving-reasonable-and-scalable-routing-in-angularjs-with-flux-2655e06cd5ee)


requirements
------------

- [Facebook's Flux](https://github.com/facebook/flux) Implementation

