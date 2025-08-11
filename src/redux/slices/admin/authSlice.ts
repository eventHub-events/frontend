import { IAdmin } from "@/types/authTypes";
import { createSlice,PayloadAction } from "@reduxjs/toolkit";


interface IOrganizerAuthState{
  admin:IAdmin| null
}

const storedUser = typeof window !== "undefined" ? localStorage.getItem("adminInfo") : null;
const initialState:IOrganizerAuthState={
  admin: storedUser?JSON.parse(storedUser):null
}

const adminAuthSlice= createSlice({
    name:"adminAuth",
    initialState,
    reducers:{
       setAdmin:(state,action:PayloadAction<IAdmin>)=>{
        state.admin=action.payload
        if(typeof window!== "undefined"){
          localStorage.setItem("adminInfo",JSON.stringify(action.payload))

        }
       },
       clearAdmin:(state)=>{
          state.admin=null
          if (typeof window !== "undefined") {
        localStorage.removeItem("adminInfo");
      }
       }
    }
})

export const{setAdmin,clearAdmin}=adminAuthSlice.actions
export default adminAuthSlice.reducer