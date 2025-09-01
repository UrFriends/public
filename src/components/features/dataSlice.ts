import { createSlice } from "@reduxjs/toolkit";

interface AccountData {
  settings: object;
  phonebook: { [tier: string]: any };
}

const initalStateObj: AccountData = {
  settings: {},
  phonebook: {},
};

export const dataSlice = createSlice({
  name: "accountData",
  initialState: initalStateObj,
  reducers: {
    populateData: (state, action) => {
      if (
        Object.hasOwn(action.payload, "settings") &&
        Object.hasOwn(action.payload, "phonebook")
      ) {
        state.settings = action.payload.settings;
        state.phonebook = action.payload.phonebook;
      } else if (Object.hasOwn(action.payload, "settings")) {
        state.settings = action.payload.settings;
      } else if (Object.hasOwn(action.payload, "phonebook")) {
        state.phonebook = action.payload.phonebook;
      }
    },
    addContact: (state, action) => {
      // let idAlreadyExists = state.phonebook.indexOf(action.payload.tier) > -1;
      if (
        Array.isArray(state.phonebook[action.payload.tier]) &&
        state.phonebook[action.payload.tier].length > 0
      ) {
        state.phonebook[action.payload.tier].push(action.payload);
      } else {
        state.phonebook[action.payload.tier] = action.payload;
      }
    },
  },
});

export const { populateData, addContact } = dataSlice.actions;

export default dataSlice.reducer;
