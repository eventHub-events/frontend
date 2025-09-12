"use client";

import { useEffect, useState } from "react";
import { FiEye, FiDownload, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { organizerVerificationService } from "@/services/admin/organizerVerificationService";
import Image from "next/image";
import { OrganizerDetail, SelectedOrganizerDetail } from "@/types/admin/organizerVerification";
import { TiTick } from "react-icons/ti";






export default function OrganizerVerification() {
  const [organizers, setOrganizers] = useState<OrganizerDetail[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<SelectedOrganizerDetail | null>(null);
  

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await organizerVerificationService.fetchPendingOrganizers();
      
        console.log("res in  is",res)
        setOrganizers(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch pending organizers", err);
      }
    };
    fetchPending();
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      if (selectedId) {
        try {
          const res = await organizerVerificationService.fetchVerificationDetails(selectedId);
          console.log(res)
          setSelectedDetail(res.data?.data);
        } catch (err) {
          console.error("Failed to fetch organizer details", err);
        }
      }
    };
    fetchDetails();
  }, [selectedId]);

  return (
    <div className="p-6">
      <div className="grid grid-cols-3 gap-6">
        {/* Left Panel - List */}
        <div className="col-span-1 bg-white rounded shadow p-4 space-y-4">
          <h3 className="text-lg font-semibold">Verification Requests</h3>
          {organizers.map((org) => (
            <div
              key={org.id}
              onClick={() => setSelectedId(org.id)}
              className={`p-3 rounded cursor-pointer border ${
                selectedId === org.id ? "bg-blue-50 border-blue-400" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Image
                  src={org.organizerProfile.profilePicture||"/avatar-placeholder.png"}
                  alt="profile"
                  width={60}
                  height={70}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold">{org.name}</p>
                  <p className="text-sm text-gray-500">{org.organizerProfile.organization || "Not Provided"}</p>
                  <p className="text-sm text-gray-500">{org.email || "Not Provided"}</p>
                </div>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                    org.kycStatus === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : org.kycStatus === "Verified"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {org.kycStatus === "Pending" && <FiClock className="text-sm" />}
                  {org.kycStatus === "Verified" && <FiCheckCircle className="text-sm" />}
                  {org.kycStatus === "Rejected" && <FiXCircle className="text-sm" />}
                  {org.kycStatus}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(org.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Panel - Details */}
        <div className="col-span-2 bg-white rounded shadow p-6">
          {selectedDetail ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Verification Details</h3>
                <span
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                    selectedDetail.kycVerified
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {selectedDetail.kycVerified ? (
                    <FiCheckCircle className="text-sm" />
                  ) : (
                    <FiClock className="text-sm" />
                  )}
                  {selectedDetail.kycVerified ? "Verified" : "Pending"}
                </span>
              </div>

              {/* Organizer Info */}
               <h4 className="font-semibold mb-2" >Organizer information</h4>
              <div className="border p-4 rounded bg-gray-50 mb-4">
                <p className="font-semibold">{selectedDetail.organizerId.name}</p>
                <p className="text-sm text-gray-500">{selectedDetail.organizerId.email}</p>
                <div className="mt-2">
                <p className="font-semibold">{selectedDetail.organization}</p>
                <p className="text-sm text-gray-500">Business Name</p>
                </div>
              </div>

              {/* Documents */}
              <h4 className="font-semibold mb-2" >Submitted documents</h4>
              <div className="space-y-3 mb-6">
                {selectedDetail.documents.map((doc, i) => (
                  <div key={i} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <p className="font-medium">{doc.type}</p>
                      <p
                        className={`flex items-center gap-1 text-sm ${
                          doc.status === "Approved"
                            ? "text-green-600"
                            : doc.status === "Pending"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {doc.status === "Approved" && <FiCheckCircle className="text-sm" />}
                        {doc.status === "Pending" && <FiClock className="text-sm" />}
                        {doc.status === "Rejected" && <FiXCircle className="text-sm" />}
                        {doc.status}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      
                        <TiTick  className="cursor-pointer text-green-600" />
                      
                      <a href={doc.url} target="_blank" rel="noopener noreferrer">
                        <FiEye className="cursor-pointer" />
                      </a>
                      <a href={doc.url} download>
                        <FiDownload className="cursor-pointer " />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded">
                  ✓ Approve
                </button>
                <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded">
                  ✗ Reject
                </button>
              </div>
            </>
          ) : (
            <div className="text-gray-400 text-center">
              Select an organizer to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
