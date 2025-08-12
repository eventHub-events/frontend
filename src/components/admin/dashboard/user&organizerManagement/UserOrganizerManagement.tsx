"use client"
import { authService } from "@/services/authService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
 import {FiEdit, FiSlash, FiUnlock,FiEye } from "react-icons/fi";
import { IUserInfo } from "@/types/authTypes";



const UserOrganizerManagement=()=>{
   const [users,setUsers] = useState< IUserInfo[]>([])
   const[isUpdated,setIsUpdated]=useState(false)

  useEffect(()=>{
    async function fetchUser(){

try{
 const usersList= await authService.usersList()
 console.log( usersList.data.data)
    setUsers(usersList.data?.data)
    
setIsUpdated(false)

}catch(err:unknown){
    const error=  err  instanceof Error? err.message:"something went wrong"
    toast.error(error)

}
    }

   
fetchUser()

  },[isUpdated])

  const handleStatus=async  (id:string,data:boolean)=>{
     console.log("handleStatus called with:", id, data);
  if (!id) {
    console.error(" No ID passed");
    return;
  }
      const result= await authService.changeStatus({id,data:{isBlocked:data}})
      setIsUpdated(true)
      console.log(result)

  }

 return (
    <div className="p-6">
     
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">User & Organizer Management</h1>
        <p className="text-gray-500">
          Manage user accounts and monitor platform activity
        </p>
      </div>

      
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search users..."
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-2 ml-auto">
          <select className="border border-gray-300 rounded-lg px-3 py-2">
            <option>All Users</option>
            <option>Organizer</option>
            <option>Attendee</option>
          </select>
          <select className="border border-gray-300 rounded-lg px-3 py-2">
            <option>All Status</option>
            <option>Active</option>
            <option>Suspended</option>
          </select>
        </div>
      </div>

      
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-3 px-4">Name</th>
            
              <th className="py-3 px-4">Type</th>
               <th className="py-3 px-4">Status</th>
               <th className="py-3 px-4">KYC Status</th> 
              {/* <th className="py-3 px-4">Activity</th>  */}
              <th className="py-3 px-4">Join Date</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr
                key={i}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4 flex items-center gap-3">
                  <img
                    src={`https://i.pravatar.cc/40?img=${i + 1}`}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </td>
                <td className="py-3 px-4">{user.role}</td>

                  <td className="py-3 px-4">
                   <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.isBlocked === false
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.isBlocked?"Blocked":"Active"}
                  </span>  
                </td> 

                 <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.kycStatus === "Verified"
                        ? "bg-green-100 text-green-700"
                        : user.kycStatus === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {user.kycStatus}
                  </span>
                </td> 

                {/* <td className="py-3 px-4 whitespace-pre-line">{user.activity}</td> */}
                <td className="py-3 px-4">{new Date(user.createdAt).toLocaleDateString('en-GB')} </td>
                <td className="py-3 px-4 flex items-center gap-2">
                  <button className="text-blue-500 hover:text-blue-700">
                    <FiEye />
                  </button>
                  <button className="text-green-500 hover:text-green-700">
                    <FiEdit />
                  </button>
                  <button
  onClick={() => handleStatus(user._id, !user.isBlocked)}
  className="text-red-500 hover:text-red-700"
>
  {user.isBlocked ? <FiUnlock /> : <FiSlash />}
</button>
                 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-2xl font-bold">12,847</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">Organizers</p>
          <p className="text-2xl font-bold">2,156</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">Active Users</p>
          <p className="text-2xl font-bold">11,923</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">Suspended</p>
          <p className="text-2xl font-bold">924</p>
        </div>
      </div>
    </div>
  );
};

export default UserOrganizerManagement;

