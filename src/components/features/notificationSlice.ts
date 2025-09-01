import { createSlice } from "@reduxjs/toolkit";

export const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    visible: false,
    message: null,
    type: null,
  },
  reducers: {
    setNotification: (state, action) => {
      state.visible = true;
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    hideNotification: (state, action) => {
      state.visible = false;
      state.message = null;
      state.type = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setNotification, hideNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
