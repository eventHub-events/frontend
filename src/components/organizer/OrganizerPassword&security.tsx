
"use client"

import { useState } from "react"
import { FaLock } from "react-icons/fa";





export const SecurityTab = ({organizerId})=> {
const[form ,setForm]= useState({
  currentPassword:"",
  newPassword:"",
  confirmNewPassword:""
})
const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
  const{name,value} = e.target;
  setForm((prev) => ({ ...prev, [name]: value}));

};

const handleSubmit = () => {

};

return (
  <div className="p-6 bg-white rounded-lg shadow max-w-2xl mx-auto">
     <h2 className="text-xl font-semibold text-gray-800 mb-6">Password & Security</h2>
     <div className="space-y-5">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                  current Password
            </label>
            <input 
                type="password"
                name="currentPassword"
                placeholder="Enter current password"
                value={form.currentPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
           </label>
           <input 
                type="password"
                 name="newPassword"
                 placeholder="Enter new Password"
                 value={form.newPassword}
                 onChange={handleChange}
                 className="w=full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring2 focus:ring-blue-500"/>
                 
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
            </label>
            <input 
                type="password"
                name="confirmNewPassword"
                placeholder="Confirm new password"
                value={form.confirmNewPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <button 
           onClick={handleSubmit}
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2">
              <FaLock />
              Update Password
            </button>

     </div>
  </div>

)



}


















































