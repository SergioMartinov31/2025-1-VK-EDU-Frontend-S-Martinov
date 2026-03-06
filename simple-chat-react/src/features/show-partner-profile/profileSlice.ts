import { createSlice } from '@reduxjs/toolkit'

export const profileSlice = createSlice({
  name: 'show-partner-profile',
  initialState: {
    value: false,
  },
  reducers: {
    openPartnerProfile: (state) => {
      state.value = true;
    },
    closePartnerProfile: (state) => {
      state.value = false;
    }
  }
})


export const {openPartnerProfile, closePartnerProfile} = profileSlice.actions;

export default profileSlice.reducer