import { configureStore } from "@reduxjs/toolkit";
import authReducer from  "../slices/user/authSlice"
import organizerAuthReducer from "../slices/organizer/authSlice"
import adminAuthReducer from "../slices/admin/authSlice"
import chatAlertReducer from"../slices/common/chat/chatAlertSlice"

export const store = configureStore({
  reducer:{
    auth:authReducer,
    organizerAuth:organizerAuthReducer,
    adminAuth:adminAuthReducer,
    chatAlert: chatAlertReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;