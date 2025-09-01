import { Dispatch } from "@reduxjs/toolkit";
import {
  hideNotification,
  setNotification,
} from "../components/features/notificationSlice";

export const sendNotification = (dispatcher: Dispatch, messageDispatch : object) => {
  dispatcher(setNotification(messageDispatch));

  setTimeout(() => {
    dispatcher(hideNotification(1));
  }, 5000);
}