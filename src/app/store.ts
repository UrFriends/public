import { configureStore } from "@reduxjs/toolkit";

import modalReducer from "../components/features/modalSlice";
import notificationReducer from "../components/features/notificationSlice";
import phonebookReducer from "../components/features/dataSlice";

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    notification: notificationReducer,
    accountData: phonebookReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
