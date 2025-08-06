import { IOrganizer } from "@/types/authTypes";
import { createSlice,PayloadAction } from "@reduxjs/toolkit";



 interface OrganizerAuthState{
    organizer: IOrganizer | null
}

const initialState:OrganizerAuthState={
  organizer:null
}

const organizerAuthSlice = createSlice({
  name:"organizerAuth",
  initialState,
  reducers:{
     setOrganizer:(state,action:PayloadAction<IOrganizer>)=>{
            state.organizer=action.payload
     },
     clearOrganizer:(state)=>{
         state.organizer=null
     }

  }
  
})
export const {setOrganizer,clearOrganizer}= organizerAuthSlice.actions  
export default organizerAuthSlice.reducer