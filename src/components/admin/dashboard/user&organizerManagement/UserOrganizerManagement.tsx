import { useEffect, useState } from "react";


const UserOrganizerManagement=()=>{
   const [users] = useState([
    {
      name: "John Smith",
      email: "john@example.com",
      type: "Organizer",
      status: "Active",
      kycStatus: "Verified",
      activity: "12 events\n$45,600",
      joinDate: "1/15/2024",
    },
    {
      name: "Sarah Johnson",
      email: "sarah@example.com",
      type: "Attendee",
      status: "Active",
      kycStatus: "N/A",
      activity: "8 attended\n$1,240",
      joinDate: "2/20/2024",
    },
    {
      name: "Mike Chen",
      email: "mike@example.com",
      type: "Organizer",
      status: "Suspended",
      kycStatus: "Pending",
      activity: "3 events\n$8,900",
      joinDate: "11/10/2023",
    },
  ]);

  useEffect(()=>{

    const users=

  },[])

 return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">User & Organizer Management</h1>
        <p className="text-gray-500">
          Manage user accounts and monitor platform activity
        </p>
      </div>

      {/* Search + Filters */}
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

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">KYC Status</th>
              <th className="py-3 px-4">Activity</th>
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
                <td className="py-3 px-4">{user.type}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status}
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
                <td className="py-3 px-4 whitespace-pre-line">{user.activity}</td>
                <td className="py-3 px-4">{user.joinDate}</td>
                <td className="py-3 px-4 flex items-center gap-2">
                  <button className="text-blue-500 hover:text-blue-700">
                    <FiEye />
                  </button>
                  <button className="text-green-500 hover:text-green-700">
                    <FiEdit />
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <FiTrash2 />
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

