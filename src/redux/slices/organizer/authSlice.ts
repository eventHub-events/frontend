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
             if(typeof window!== "undefined"){
          localStorage.setItem("organizerInfo",JSON.stringify(action.payload))

        }
     },
     organizerLogout:(state)=>{
         state.organizer=null
           if (typeof window !== "undefined") {
        localStorage.removeItem("organizerInfo");
      }
         
     }

  }
  
})
export const {setOrganizer,organizerLogout}= organizerAuthSlice.actions  
export default organizerAuthSlice.reducer