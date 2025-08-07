import { configureStore } from "@reduxjs/toolkit";
import authReducer from  "../slices/user/authSlice"
import organizerAuthReducer from "../slices/organizer/authSlice"
import adminAuthReducer from "../slices/admin/authSlice"
export const store = configureStore({
  reducer:{
    auth:authReducer,
    organizerAuth:organizerAuthReducer,
    adminAuth:adminAuthReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;