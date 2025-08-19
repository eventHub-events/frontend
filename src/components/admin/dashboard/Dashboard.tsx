"use client";

import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AdminDashboard = () => {
    const admin = useAppSelector((state)=>state.adminAuth.admin)
    const router= useRouter()

 const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const checking = admin === undefined || admin === null;
  setIsChecking(checking);
console.log("checking admin ",isChecking)
  if (!checking && !admin) {
    
    console.log("re- routing")
    toast.info("Re-routing to login ")
     router.replace("/admin/login");

  }
  }, [admin, router,isChecking]);

  if (isChecking) {
    return <div>Loading...</div>; // Or spinner
  }
  return (
    <div className="space-y-6">
      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Total Users</p>
          <h2 className="text-2xl font-bold">1,230</h2>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Organizers</p>
          <h2 className="text-2xl font-bold">230</h2>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Total Events</p>
          <h2 className="text-2xl font-bold">528</h2>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Revenue</p>
          <h2 className="text-2xl font-bold">$12,340</h2>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Users</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-600 border-b">
              <th className="py-2">Name</th>
              <th className="py-2">Email</th>
              <th className="py-2">Role</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                name: "John Doe",
                email: "john@example.com",
                role: "User",
                status: "Active",
              },
              {
                name: "Jane Smith",
                email: "jane@example.com",
                role: "Organizer",
                status: "Pending",
              },
              {
                name: "Admin User",
                email: "admin@eventhub.com",
                role: "Admin",
                status: "Active",
              },
            ].map((user, index) => (
              <tr key={index} className="border-b hover:bg-gray-100">
                <td className="py-2">{user.name}</td>
                <td className="py-2">{user.email}</td>
                <td className="py-2">{user.role}</td>
                <td className="py-2">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
