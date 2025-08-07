import { createSlice,PayloadAction } from "@reduxjs/toolkit"
import { IUser } from "@/types/authTypes"

interface AuthState {
  user:IUser| null
}
const initialState:AuthState={
  user:null
}

const authSlice = createSlice({
     name:"auth",
     initialState,
     reducers:{
      setUser:(state,action:PayloadAction<IUser>)=>{
         state.user= action .payload
         if(typeof window!==undefined){

           localStorage.setItem("userInfo",JSON.stringify(action.payload))
         }
      },
      clearUser:(state)=>{
        state.user = null
        if(typeof window!=="undefined"){

          localStorage.removeItem("userInfo")
        }
      }
     }
})

export const {setUser,clearUser} =authSlice.actions
export default authSlice.reducer