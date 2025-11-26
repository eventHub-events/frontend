"use client";

import { authService } from "@/services/authService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiEdit, FiSlash, FiUnlock, FiEye } from "react-icons/fi";
import { IUserInfo } from "@/types/authTypes";
import { confirmAction } from "@/services/common/alert";
import Image from "next/image";
import { useAdminSocket } from "@/hooks/useAdminSocket";
import Pagination from "@/components/ui/Pagination";
import { FilterBar } from "@/components/ui/FilterBar";
import OrganizerReviewsForAdmin from "../../review/OrganizerReviewsForAdmin";

const UserOrganizerManagement = () => {
  const [users, setUsers] = useState<IUserInfo[]>([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const { blockUser } = useAdminSocket();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
const [selectedOrganizerId, setSelectedOrganizerId] = useState<string | null>(null);



 useEffect(() => {
  const handler = setTimeout(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 500);

  return () => clearTimeout(handler);
}, [searchTerm]);
useEffect(() => {
  async function fetchUser() {
    try {
      const usersList = await authService.usersList({
        page: currentPage,
        limit: 5,
        search: debouncedSearchTerm,
        role: roleFilter,
        status: statusFilter,
      });
       console.log("res", usersList)
      setUsers(usersList.data?.data.usersList);
      setTotalPages(Math.ceil(usersList.data?.data.total / 5));
      setIsUpdated(false);
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : "Something went wrong";
      toast.error(error);
    }
  }

  fetchUser();
}, [isUpdated, currentPage, debouncedSearchTerm, roleFilter, statusFilter]);

  // useEffect(() => {
  //   const timer = setTimeout(() => setCurrentPage(1), 300);
  //   return () => clearTimeout(timer);
  // }, [searchTerm]);

  const handleBlockToggle = async (userId: string, isBlocked: boolean) => {
    const action = isBlocked ? "unblock" : "block";
    const confirmed = await confirmAction(
      `Are you sure you want to ${action} this user?`,
      `This will ${isBlocked ? "reactivate" : "suspend"} their access.`,
      isBlocked ? "Unblock" : "Block"
    );

    if (confirmed) {
      await blockUser(userId, !isBlocked);
      setIsUpdated(true);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">User & Organizer Management</h1>
        <p className="text-gray-500">Manage user accounts and monitor platform activity</p>
      </div>

      {/* FilterBar */}
      <FilterBar
        filters={[
          { label: "Search", name: "search", type: "text" },
          { label: "Role", name: "role", type: "select", options: ["organizer", "attendee"] },
          { label: "Status", name: "status", type: "select", options: ["active", "suspended"] },
        ]}
        onApply={(filters) => {
          setSearchTerm(filters.search || "");
          setRoleFilter(filters.role || "");
          setStatusFilter(filters.status || "");
          setCurrentPage(1);
        }}
      />

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto mt-4">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">KYC Status</th>
              <th className="py-3 px-4">Join Date</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No {roleFilter==="organizer"?"organizer":"user"} found.
                </td>
              </tr>
            ) : (
              users?.map((user, i) => (
                <tr key={i} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <Image
                      src={`https://i.pravatar.cc/40?img=${i + 1}`}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="rounded-full"
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
                        user.isBlocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                      }`}
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
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
                  <td className="py-3 px-4">
                    {new Date(user.createdAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="py-3 px-4 flex items-center gap-2">
                   <button 
  className="text-blue-500 hover:text-blue-700"
  onClick={() => {
    if (user.role === "organizer") {
      setSelectedOrganizerId(user.id);
      setShowReviewModal(true);
    }
  }}
>
  <FiEye />
</button>

                    <button className="text-green-500 hover:text-green-700">
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleBlockToggle(user.id, user.isBlocked)}
                      className="text-red-500 hover:text-red-700"
                    >
                      {user.isBlocked ? <FiUnlock /> : <FiSlash />}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
      {showReviewModal && selectedOrganizerId && (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-3">
    
    <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Organizer Reviews</h2>
        <button 
          className="text-gray-600 hover:text-black text-xl"
          onClick={() => setShowReviewModal(false)}
        >
          ✕
        </button>
      </div>

      {/* Review Component */}
      <OrganizerReviewsForAdmin organizerId={selectedOrganizerId} isAdmin={true} />
    </div>
  </div>
)}

    </div>
  );
};

export default UserOrganizerManagement;
