import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ReactQueryProviders from "./ReactQueryProviders";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./redux/store";
import { Toaster } from "./components/ui/toaster";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ReactQueryProviders>
        <App />
        <Toaster />
      </ReactQueryProviders>
    </PersistGate>
  </Provider>
);
