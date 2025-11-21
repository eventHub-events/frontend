import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatAlertState {
  unread: { [conversationId: string]: boolean };
  communityUnread: boolean;
}

const initialState: ChatAlertState = {
  unread: {},
  communityUnread: false
};

const chatAlertSlice = createSlice({
  name: "chatAlert",
  initialState,
  reducers: {
    setUnread(state, action: PayloadAction<string>) {
      state.unread[action.payload] = true;
    },
    clearUnread(state, action: PayloadAction<string>) {
      delete state.unread[action.payload];
    },

    // ⭐ ADD THIS ⭐
    setCommunityUnread(state) {
      state.communityUnread = true;
    },
    clearCommunityUnread(state) {
      state.communityUnread = false;
    }
  }
});

export const {
  setUnread,
  clearUnread,
  setCommunityUnread,
  clearCommunityUnread
} = chatAlertSlice.actions;

export default chatAlertSlice.reducer
