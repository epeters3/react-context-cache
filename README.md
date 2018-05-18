# React Context Cache

A pair of components `CacheProvider` and `CacheConsumer` that leverage the [React Context API](https://reactjs.org/docs/context.html), allowing you to easily store, update, and consume asynchronously retrieved data in your React application. No state container needs to be connected to components, and the data does not need to be passed through the React component tree one level at a time. Access, refresh, and add to your app's global state easily from within any of the components in your app's tree.

## Basic Usage

```
npm i react-context-cache
```

```
import { CacheProvider, CacheConsumer } from "react-context-cache";
```

`CacheProvider` and `CacheConsumer` are React components that can be used like a regular React `Context.Provider` and `Context.Consumer` component pair.
