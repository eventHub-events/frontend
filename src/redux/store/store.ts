import { configureStore } from "@reduxjs/toolkit";
import authReducer from  "../slices/user/authSlice"
import organizerAuthReducer from "../slices/organizer/authSlice"
export const store = configureStore({
  reducer:{
    auth:authReducer,
    organizerAuth:organizerAuthReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;