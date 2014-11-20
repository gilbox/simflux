simflux
=======

Framework-agnostic, simple Flux wrapper on top of Facebook's Flux


how?
----

    var dispatcher = new simflux.dispatcher();

    // an object qualifies to be a store if it has methods
    // named the same as actions
    var appStore = {
      addTodo: function(todo) { ... },
      removeTodo: function(todo) { ... }
    }
    
    // register appStore with Flux
    dispatcher.registerStore(appStore);
    
    // all async ops should be handled by the Action Creator
    var actionCreator = {
      addTodo: function(todo) {
        doSomethingAsync.then(function() {
          dispatcher.waitFor([otherStore, anotherStore]);
          dispatcher.dispatch('addTodo', todo);
        });
      }
    }
    
    // in the view: do something!
    actionCreator.addTodo({ todo: 'My Todo' });


why?
----

- Less boilerplate
- Easier to read


demo
----

[angular-simflux-experiment](https://github.com/gilbox/angular-simflux-experiment): Flux in angularjs


requirements
------------

- [Facebook's Flux](https://github.com/facebook/flux) Implementation

