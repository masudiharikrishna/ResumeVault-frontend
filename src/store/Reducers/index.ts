import { combineReducers } from "@reduxjs/toolkit";
import AuthReducer from "./AuthReducer";
import persistReducer from "redux-persist/es/persistReducer";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

// Next.js SSR helper to prevent window-undefined error on server build
const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["AuthReducer"],
};

const reducers = combineReducers({
  AuthReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "AuthReducer/logout") {
    storage.removeItem("persist:root");
    if (typeof window !== "undefined") {
      window.location.reload();
    }
    return reducers(undefined, action);
  }
  return reducers(state, action);
};

export default persistReducer(persistConfig, rootReducer);
