import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducers"
import storageSession from "redux-persist/lib/storage/session";

import { persistStore, persistReducer } from "redux-persist";
const persistConfig = {
    key: "root", 
    storage: storageSession, 
  };

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
    reducer: persistedReducer
});


export type RootState = ReturnType<typeof store.getState>;
export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
export default store;
