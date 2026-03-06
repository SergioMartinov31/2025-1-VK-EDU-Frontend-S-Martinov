import { configureStore } from "@reduxjs/toolkit";
import ProfilePartnerReducer from '../../features/show-partner-profile/profileSlice'

export const store = configureStore({
  reducer: {
    showProfilePartner: ProfilePartnerReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

