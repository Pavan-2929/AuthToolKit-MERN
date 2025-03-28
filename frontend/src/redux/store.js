import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer, { logout } from "./auth/authSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "auth",
  storage,
};

const rootReducer = combineReducers({
  auth: persistReducer(persistConfig, authReducer),
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

persistor.subscribe(() => {
  const state = store.getState();

  if (state.auth.tokenExpiry && Date.now() > state.auth.tokenExpiry) {
    store.dispatch(logout());
  }
});
export { store, persistor };
