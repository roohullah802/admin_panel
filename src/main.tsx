// src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { persistor, store } from "./redux-toolkit-store/store/store";
import { PersistGate } from "redux-persist/integration/react";
import { ClerkProvider } from "@clerk/clerk-react";
import ClipLoader from "react-spinners/ClipLoader";

const VITE_CLERK_PUBLISHABLE_KEY =
  "pk_test_Ym9sZC1kdWNrbGluZy03MC5jbGVyay5hY2NvdW50cy5kZXYk";

if (!VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <PersistGate
      loading={
        <div className="flex justify-center items-center w-full h-screen">
          <ClipLoader color="black" size={50} />
        </div>
      }
      persistor={persistor}
    >
      <Provider store={store}>
        <ClerkProvider publishableKey={VITE_CLERK_PUBLISHABLE_KEY}>
          <App />
        </ClerkProvider>
      </Provider>
    </PersistGate>
  </React.StrictMode>
);
