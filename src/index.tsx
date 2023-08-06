import React from "react";
import "./index.css";
import { App } from "./components/App";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import * as serviceWorker from "./serviceWorker";
import { store } from "./app/store";
import { enableMapSet } from "immer";

enableMapSet();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
