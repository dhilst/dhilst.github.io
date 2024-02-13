---
layout: post
title: How I write React components as state machines
tags: [react, redux, react-hooks, reducer, usereducer]
---

Sometime ago I started working with React again and after
some few weeks I already had one of that components with
dozens of `useState` calls. At that point I learned `useReducer`
hook (I already used Redux before but never this hook). In this
post I show how I write components with `useReducer` as state machines
and how this make it more predictable and easier to manage the
state updates.

[useReducer](https://react.dev/reference/react/useReducer) is 
a React hook to let you use a reducer, i.e. a function that
receives a _state_, and an _action_ and returns a new _state_.

The difference from _useReducer_ to [Redux](https://redux.js.org/) is
that Redux is a full library to manage the **global** state of your
app, while `useReducer` is a hook, and will only manage the state of a
single component. Even in this case it is very useful!

The idea is to replace multiple `useState` by a single `useReducer`.
This helps to organize the state updates. Do you ever faced a problem
where you need to update two states at same time, ex
`setShowError(true); setError("some error")`, and then you need to
consume `showError` and `error` at the same time? ex; `if (showError && error !== null) ...`.

The problem here is that `error` and `showError` depends one on each
other. We want an invariant like: _when `error` is `true`, `showError`
is not null_ but React cannot guarantee that. The solution is to merge
`error` and `showError` states in a single state object and do a
single update. Then we're sure that the dependence between both values
hold because they are updated together.

In this way your component is always in a valid state, there are no
intermediary states were one value is updated but the other is not.

I'm going to show a generic example, I'm using [NextJS 13](https://nextjs.org/) BTW

Here is some code, I'm explaining it in the comments!!

```typescript
"use client";
import { default as axios } from 'axios';
import React, { useReducer } from 'react';

export default function MyComponent() {
  // I define a state for my component. There is only ONE
  // state and ONE reducer function which will update it.
  type State = {
    // I like to add a enum like variable to define the
    // state of my component. All other values depending on
    // the state of the component read it from here
    state: "Init" | "Request" | "Response" | "Error",
    // The other fields depend on the `state` field. For
    // example, `response?` is only present when `state == "Response"`.
    response?: string,
    error?: string,
  };

  // I also define a set of actions that may be triggered in the component
  type Action =
    | { type: "Request" }
    | { type: "Response"; payload: Response }
    | { type: "Close" }
    | { type: "Error", payload: string }
    ;

  // @ts-ignore
  const [state, dispatch]: [State, React.Dispatch<Action>] = useReducer((state: State, action: Action): State => {
    // This is the reducer, it returns a new state based on the `action.type`
    switch (action.type) {
      case "Request":
        return { state: "Request" }
      case "Response":
        // Both fields are updated at same time
        return { state: "Response", response: action.payload }
      case "Error":
        return { state: "Error", error: action.payload };
      case "Close":
        return { state: "Init" }
      default:
        return state;
    };
  }, { state: "Init" });

  const onClick = async (e: any) => {
    e.preventDefault();

    try {
      switch (state.state) {
        case "Init":
          // The reducer is completely synchronous. We
          // dispatch an action to notify that a request
          // will be fired, this can be used to trigger
          // loading state for example
          dispatch({ type: "Request" });
          // Then we wait for the request
          const response = await axios.get("example.com");
          // Finally we dispatch the response results, again,
          // synchronous
          dispatch({ type: "Response", payload: response.data });
          return;
        case "Request":
          return;
        case "Response":
        case "Error":
          dispatch({ type: "Close" });
          return;
        default:
          console.error(`Invalid state ${state.state}`);
          return;
      }
    } catch (e: any) {
      dispatch({ type: "Error", payload: e?.response?.data || e })
      console.error(e);
    }
  };

  switch (state.state) {
    case "Init":
      return <button onClick={onClick}/>Initial state</button>;
    case "Request":
      return <button>Loading ...</button>;
    case "Response":
      return (<div>
        <button onClick={onClick}/>Go back to inital state</button>
        <p>Response: {state.response}</p>
      </div>);
    case "Error":
      return (<div>
        <button onClick={onClick}/>Go back to inital state</button>
        <p>Error: {state.error}</p>
      </div>);
    default:
      return <button onClick={onClick}/>Initial state</button>;
  };
}
```

Because all state is in a single object, all updates are atomic, and
updates can be arbitrarily complex. The `state.state` make clear the
possible states and the actions state the possible state transitions.

If we need a new state variable we add it a field the state type, then
we add an action that will trigger the update of such field, we update
the reducer and the remaining of the code.

This creates a lot of boilerplate, yes, but, at last for me, it make
clear what the state transitions are, what are the possible state
and how to update the code in order to add new states without breaking
everyting else.

The above component works like a state machine with these transitions:

```
Init     -Request->   Request

Request  -Response->  Response
Request  -Error->     Error

Response -Close->     Init
Error    -Close->     Init
```

The word inside the arrows are the actions. For example, in the initial
state `Init` the only valid transition is by the `Request` action
(which is triggered when the user clicks the button). The component goes
then to the `Request` state. In this state it can go to
two possible states `Response` or `Error`. `Reponse` will show the
reponse and `Error` the error.  From `Error` or `Respose` the only
transition is to `Init` triggered by `Close` action (fired by the user
again).

So is very easy to have a mental picture of how your component should
work and this helps a lot into adding new features and debugging.

That's it!


