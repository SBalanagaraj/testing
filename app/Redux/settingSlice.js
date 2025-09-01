import {createSlice} from '@reduxjs/toolkit';

const settingSlice = createSlice({
  name: 'setting',
  initialState: {
    list: [],
    savedAddress: [],
  },

  reducers: {
    addFile: (state, action) => {
      state.list.push(action.payload);
    },
    removeFile: (state, action) => {
      state.list = state.list.filter(file => file.uri !== action.payload);
    },
    clearFiles: state => {
      state.list = [];
    },

    // addAddress
    addAddressFile: (state, action) => {
      state.savedAddress.push(action.payload);
    },
    removeAddressFile: (state, action) => {
      state.savedAddress = state.savedAddress.filter(
        file => file.uri !== action.payload,
      );
    },
    clearAddressFiles: state => {
      state.savedAddress = [];
    },
  },
});

export const {
  addFile,
  removeFile,
  clearFiles,
  addAddressFile,
  removeAddressFile,
  clearAddressFiles,
} = settingSlice.actions;
export default settingSlice.reducer;
