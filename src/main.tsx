// src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { persistor, store } from "./redux-toolkit-store/store/store";
import { PersistGate } from "redux-persist/integration/react";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <PersistGate loading={<h1>Loading...</h1>} persistor={persistor}>
      <Provider store={store}>
        <App />
      </Provider>
    </PersistGate>
  </React.StrictMode>
);
