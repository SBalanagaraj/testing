import {createSlice} from '@reduxjs/toolkit';

const settingSlice = createSlice({
  name: 'setting',
  initialState: {
    userLocation: {},
  },

  reducers: {
    setUserLocation: (state, action) => {
      state.userLocation = action.payload;
    },
  },
});

export const {setUserLocation} = settingSlice.actions;
export default settingSlice.reducer;
