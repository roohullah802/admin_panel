// src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { persistor, store } from "./redux-toolkit-store/store/store";
import { PersistGate } from "redux-persist/integration/react";
import {ClerkProvider} from '@clerk/clerk-react'

const VITE_CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <PersistGate loading={<h1>Loading...</h1>} persistor={persistor}>
      <Provider store={store}>
        <ClerkProvider publishableKey={VITE_CLERK_PUBLISHABLE_KEY}>
        <App />
        </ClerkProvider>
      </Provider>
    </PersistGate>
  </React.StrictMode>
);
