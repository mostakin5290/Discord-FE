import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import serverReducer from "./slices/serverSlice";
import messageReducer from "./slices/messageSlice";
import modalReducer from "./slices/modalSlice";
import friendReducer from "./slices/friendSlice";
import dmReducer from "./slices/dmSlice";
import callReducer from "./slices/callSlice";
import groupCallReducer from "./slices/mediaChannelSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    server: serverReducer,
    message: messageReducer,
    modal: modalReducer,
    friends: friendReducer,
    dm: dmReducer,
    call: callReducer,
    groupCall: groupCallReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
