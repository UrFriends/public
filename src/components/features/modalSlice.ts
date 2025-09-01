import { createSlice } from "@reduxjs/toolkit";

const default_emptyPerson = {
      name: {
        first: "",
        last: "",
      },
      id: "",
      user: "",
      tier:   "",
      phoneNumber:   "",
      lastConvo: {},
      docID: "",
      email: "",
}


export const modalSlice = createSlice({
  name: "modal",
  initialState: {
    visible: false,
    type: "no content",
    person: default_emptyPerson,
    topic: null,
    title: null,
    unsavedChanges: false,
  },
  reducers: {
    setVisibleModal: (state, action) => {
      if (Object.hasOwn(action.payload, "person")) {
        state.person = action.payload.person;
      }
      if (Object.hasOwn(action.payload, "topic")) {
        state.topic = action.payload.topic;
      }
      if (Object.hasOwn(action.payload, "title")) {
        state.title = action.payload.title;
      }
      state.type = action.payload.modalContentType;
      state.visible = true;
    },
    hideModal: (state, action) => {
      state.visible = false;
      state.type = "no content";
      state.person = default_emptyPerson;
      state.topic = null;
      state.title = null;
    },
    setUnsavedChanges: (state, action) => {
      state.unsavedChanges = true;
    },
    clearUnsavedChanges: (state, action) => {
      state.unsavedChanges = false;
    }
  },
});

// Action creators are generated for each case reducer function
export const { setVisibleModal, hideModal, clearUnsavedChanges, setUnsavedChanges } = modalSlice.actions;

export default modalSlice.reducer;
