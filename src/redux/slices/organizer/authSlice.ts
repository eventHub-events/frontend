import { KycStatus } from "@/types/admin/Enums/organizerVerificationEnum";
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
     updateKycStatus : (state ,action :PayloadAction<KycStatus>) => {
          if(state.organizer) {
             state.organizer.kycStatus = action .payload ;

              if (typeof window !== "undefined") {
          localStorage.setItem("organizerInfo", JSON.stringify(state.organizer));
        }
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
export const {setOrganizer,organizerLogout,updateKycStatus}= organizerAuthSlice.actions  
export default organizerAuthSlice.reducer