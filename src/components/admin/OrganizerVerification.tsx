"use client";

import { useEffect, useState, useRef } from "react";
import { FiEye, FiDownload, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { TiTick } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import Image from "next/image";

import { organizerVerificationService } from "@/services/admin/organizerVerificationService";
import { OrganizerDetail, SelectedOrganizerDetail } from "@/types/admin/organizerVerification";
import {
  KycStatus,
  UploadDocumentStatus,
  UploadDocumentVerificationStatus
} from "@/types/admin/Enums/organizerVerificationEnum";
import { documentService } from "@/services/organizer/documentService";

export default function OrganizerVerification() {
  const [organizers, setOrganizers] = useState<OrganizerDetail[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<SelectedOrganizerDetail | null>(null);
  const [isUpdated, setIsUpdated] = useState(false);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Separate loading states for different operations
  const [loadingOrganizers, setLoadingOrganizers] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  
  // Track minimum display time for loader
  const loaderTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const MIN_LOADER_TIME = 500; // Minimum time to show loader in ms

  // Combined loading state for UI
  const isLoading = loadingOrganizers || loadingDetails || loadingAction;

  useEffect(() => {
    const fetchPending = async () => {
      setLoadingOrganizers(true);
      const startTime = Date.now();
      
      try {
        const res = await organizerVerificationService.fetchPendingOrganizers();
        console.log("res",res)
        setOrganizers(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch pending organizers", err);
      } finally {
        // Ensure loader shows for minimum time
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < MIN_LOADER_TIME) {
          setTimeout(() => {
            setLoadingOrganizers(false);
            setIsUpdated(false);
          }, MIN_LOADER_TIME - elapsedTime);
        } else {
          setLoadingOrganizers(false);
          setIsUpdated(false);
        }
      }
    };
    fetchPending();
  }, [isUpdated]);

  useEffect(() => {
    const fetchDetails = async () => {
      console.log("selectedUd",selectedId)
      if (!selectedId) {
        setSelectedDetail(null);
        return;
      }

      setLoadingDetails(true);
      const startTime = Date.now();
      
      try {
        const res = await organizerVerificationService.fetchVerificationDetails(selectedId);
        console.log("res doc,doc",res)
        console.log("selectedDetail", res.data.data)
        setSelectedDetail(res.data?.data);
      } catch (err) {
        console.error("Failed to fetch organizer details", err);
        setSelectedDetail(null);
      } finally {
        // Ensure loader shows for minimum time
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < MIN_LOADER_TIME) {
          setTimeout(() => {
            setLoadingDetails(false);
          }, MIN_LOADER_TIME - elapsedTime);
        } else {
          setLoadingDetails(false);
        }
      }
    };
    fetchDetails();
  }, [selectedId, isUpdated]);

  const handleVerification = async (
    docId: string,
    status: string,
    verified: boolean,
    reason = ""
  ) => {
    setLoadingAction(true);
    const startTime = Date.now();
    
    try {
      const data = {
        status,
        verified,
        reviewedBy: "Admin",
        reviewedAt: new Date(),
        reason,
      };
      await organizerVerificationService.updateOrganizerUploadDocuments(docId, data);
      toast.success("Document status updated successfully");
      setIsUpdated(true);
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || "Something went wrong");
      } else {
        toast.error("Unexpected error occurred");
      }
    } finally {
      // Ensure loader shows for minimum time
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < MIN_LOADER_TIME) {
        setTimeout(() => {
          setLoadingAction(false);
        }, MIN_LOADER_TIME - elapsedTime);
      } else {
        setLoadingAction(false);
      }
    }
  };

  const handleRejectSubmit = async () => {
    
    if (!selectedDocId) return;
    await handleVerification(
      selectedDocId,
      UploadDocumentStatus.REJECTED,
      UploadDocumentVerificationStatus.REJECTED,
      rejectionReason
    );
    setShowRejectModal(false);
    setSelectedDocId(null);
    setRejectionReason("");
  };

  const handleOverallStatus = async (
    kycStatus: string,
    kycVerified: boolean,
    isVerified: boolean = false
  ) => {
    if (!selectedId) return;

    setLoadingAction(true);
    const startTime = Date.now();
    
    try {
      const organizerUpdate = {
        kycStatus,
        isVerified,
      };

      const profileUpdate = {
        kycVerified,
      };

      await organizerVerificationService.updateOrganizerVerificationStatus(
        selectedId,
        organizerUpdate,
        profileUpdate
      );

      toast.success("Organizer verification status updated successfully");
      setIsUpdated(true);
      setSelectedId(null);
    } catch (err) {
      console.error("Error updating organizer status", err);
      toast.error("Failed to update organizer verification status");
    } finally {
      // Ensure loader shows for minimum time
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < MIN_LOADER_TIME) {
        setTimeout(() => {
          setLoadingAction(false);
        }, MIN_LOADER_TIME - elapsedTime);
      } else {
        setLoadingAction(false);
      }
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (loaderTimeoutRef.current) {
        clearTimeout(loaderTimeoutRef.current);
      }
    };
  }, []);
  const handlePdfDownload = async (imageUrl: string,docType:string) => {
    
    const response = await documentService.getDocumentsInPdf({imageUrl,docType})
    console.log("respo",response)
     const blob = new Blob([response.data], { type: 'application/pdf' });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'organizer-document.pdf'; // File name
    a.style.display = 'none';

    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

  }

  return (
    <div className="p-6 relative">
      {/* Loader Overlay - with smooth transition */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-200">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="flex flex-col items-center">
              <div className="animate-spin h-10 w-10 border-3 border-blue-600 rounded-full border-t-transparent"></div>
              <p className="mt-3 text-sm font-medium text-gray-700">
                {loadingOrganizers && "Loading organizers..."}
                {loadingDetails && "Loading details..."}
                {loadingAction && "Updating..."}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Left Panel */}
        <div className="col-span-1 bg-white rounded shadow p-4 space-y-4">
          <h3 className="text-lg font-semibold">Verification Requests</h3>
          {!loadingOrganizers && organizers.length === 0 && (
            <h4 className="text-green-500 text-sm text-center mt-4">
              No verification requests pending.
            </h4>
          )}
          {organizers.map((org) => (
            <div
              key={org.id}
              onClick={() => !isLoading && setSelectedId(org.id)}
              className={`p-3 rounded cursor-pointer border transition-colors ${
                selectedId === org.id ? "bg-blue-50 border-blue-400" : "hover:bg-gray-50"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="flex items-center gap-3">
                <Image
                  src={org.organizerProfile.profilePicture || "/avatar-placeholder.png"}
                  alt="profile"
                  width={60}
                  height={70}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold">{org.name}</p>
                  <p className="text-sm text-gray-500">
                    {org.organizerProfile.organization || "Not Provided"}
                  </p>
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

        {/* Right Panel */}
        <div className="col-span-2 bg-white rounded shadow p-6">
          {selectedDetail ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Verification Details</h3>
                <span
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                    selectedDetail.organizerId.kycStatus !== KycStatus.PENDING
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {selectedDetail.organizerId.kycStatus !== KycStatus.PENDING? <FiCheckCircle /> : <FiClock />}
                  {selectedDetail.organizerId.kycStatus === KycStatus.PENDING? "Pending":"Verified"}
                </span>
              </div>

              <h4 className="font-semibold mb-2">Organizer information</h4>
              <div className="border p-4 rounded bg-gray-50 mb-4">
                <p className="font-semibold">{selectedDetail.organizerId.name}</p>
                <p className="text-sm text-gray-500">{selectedDetail.organizerId.email}</p>
                <div className="mt-2">
                  <p className="font-semibold">{selectedDetail.organization}</p>
                  <p className="text-sm text-gray-500">Business Name</p>
                </div>
              </div>

              <h4 className="font-semibold mb-2">Submitted documents</h4>
              <div className="space-y-3 mb-6">
                {selectedDetail.documents.map((doc) => (
                  <div key={doc.id} className="border rounded p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
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
                          {doc.status === "Approved" && <FiCheckCircle />}
                          {doc.status === "Pending" && <FiClock />}
                          {doc.status === "Rejected" && <FiXCircle />}
                          {doc.status}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 ml-4">
                        <button
                          onClick={() =>
                            !isLoading && handleVerification(
                              doc.id,
                              UploadDocumentStatus.APPROVED,
                              UploadDocumentVerificationStatus.VERIFIED
                            )
                          }
                          disabled={isLoading}
                          className={`${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <TiTick className="cursor-pointer text-green-600 hover:text-green-700" />
                        </button>
                        <button
                          onClick={() => {
                            if (!isLoading) {
                              setSelectedDocId(doc.id);
                              setShowRejectModal(true);
                            }
                          }}
                          disabled={isLoading}
                          className={`${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <IoClose className="cursor-pointer text-red-600 hover:text-red-700" />
                        </button>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                          <FiEye className="cursor-pointer hover:text-blue-600" />
                        </a>
                          <div>
                                 <FiDownload onClick={() =>handlePdfDownload(doc.url, doc.type)}  className="cursor-pointer hover:text-blue-600" />
                          </div>
                      </div>
                    </div>

                    {doc.status === "Rejected" && doc.reason && (
                      <div className="mt-3 bg-red-50 border border-red-200 rounded p-2 text-red-600 text-sm">
                        <p className="font-medium text-black">Rejection Reason:</p>
                        <p>{doc.reason}</p>
                      </div>
                    )}

                    {showRejectModal && selectedDocId === doc.id && (
                      <div className="mt-4 bg-white border rounded shadow p-4 w-full">
                        <h3 className="text-sm font-semibold mb-2">Reason for Rejection</h3>
                        <textarea
                          className="w-full border rounded p-2 h-20 resize-none text-sm"
                          placeholder="Enter reason..."
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                        />
                        <div className="flex justify-end gap-2 mt-3">
                          <button
                            onClick={() => {
                              setShowRejectModal(false);
                              setRejectionReason("");
                              setSelectedDocId(null);
                            }}
                            className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleRejectSubmit}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!rejectionReason.trim() || isLoading}
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleOverallStatus("Approved", true, true)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  disabled={isLoading}
                >
                  ✓ Approve
                </button>
                <button
                  onClick={() => handleOverallStatus("Rejected", true)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  disabled={isLoading}
                >
                  ✗ Reject
                </button>
              </div>
            </>
          ) : (
            <div className="text-gray-400 text-center">
              {loadingDetails ? "Loading details..." : "Select an organizer to view details."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}