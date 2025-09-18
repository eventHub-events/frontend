import { IOrganizer } from "@/types/authTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrganizerAuthState {
  organizer: IOrganizer;
}

// Initialize with defaults to avoid null checks
const initialState: OrganizerAuthState = {
  organizer: {
    id: "",
    name: "",
    email: "",
    role: "organizer",
    image: "",
    isVerified: false,
  },
};

const organizerAuthSlice = createSlice({
  name: "organizerAuth",
  initialState,
  reducers: {
    // Accepts partial updates safely
    setOrganizer: (state, action: PayloadAction<Partial<IOrganizer>>) => {
      state.organizer = { ...state.organizer, ...action.payload };

      if (typeof window !== "undefined") {
        localStorage.setItem("organizerInfo", JSON.stringify(state.organizer));
      }
    },

    // Reset to initial state
    organizerLogout: (state) => {
      state.organizer = initialState.organizer;
      if (typeof window !== "undefined") {
        localStorage.removeItem("organizerInfo");
      }
    },
  },
});

export const { setOrganizer, organizerLogout } = organizerAuthSlice.actions;
export default organizerAuthSlice.reducer;
