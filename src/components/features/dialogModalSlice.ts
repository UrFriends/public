import { createSlice } from "@reduxjs/toolkit";

export const dialogModalSlice = createSlice({
  name: "dialog",
  initialState: {
    visible: false,
    message: null,
    confirmed: false,
  },
  reducers: {
    showDialog: (state, action) => {
      state.message = action.payload.message;
      state.visible = true;
    },
    hideDialog: (state, action) => {
      state.visible = false;
      state.message = null;
    },
    confirmDialog: (state, action) => {
      state.confirmed = true;
    },
    deconfirmDialog: (state, action) => {
      state.confirmed = false;
      state.message = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { showDialog, hideDialog, confirmDialog, deconfirmDialog } =
  dialogModalSlice.actions;

export default dialogModalSlice.reducer;
