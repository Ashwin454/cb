import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import RootReducers from "./reducers/index.js";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SocketProvider } from "./context/Socket.jsx";

const store = configureStore({
  reducer: RootReducers,
});

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <GoogleOAuthProvider
        clientId={
          import.meta.env.VITE_GOOGLE_CLIENT_ID ||
          "72046563484-fcss19uvb0rs35kknigoodu0oevegvlo.apps.googleusercontent.com"
        }
      >
        <SocketProvider>
          <App />
        </SocketProvider>
      </GoogleOAuthProvider>
      <Toaster />
    </BrowserRouter>
  </Provider>
);
