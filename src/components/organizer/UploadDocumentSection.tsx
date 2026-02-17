"use client";

import { useAppDispatch } from "@/redux/hooks";
import { setOrganizer, updateKycStatus } from "@/redux/slices/organizer/authSlice";
import { CLOUDINARY_SERVICE } from "@/services/common/cloudinaryService";
import { uploadKycDocumentToCloudinary } from "@/services/common/uploadDocumentCloudinary";
import { DOCUMENT_SERVICE } from "@/services/organizer/documentService";
import { KycStatus, UploadDocumentStatus } from "@/types/admin/Enums/organizerVerificationEnum";
import { documentTypes } from "@/types/organizer/organizerProfile";
import { showSuccess, showWarning } from "@/utils/toastService";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaClock,
  FaCloudUploadAlt,
  FaTimesCircle,
  FaPaperPlane,
} from "react-icons/fa";
import { toast } from "react-toastify";
import DocumentPreviewModal from "../ui/DocumentPreviewModal";
import { useRouter } from "next/navigation";

interface UploadDocument {
  id: string;
  name: string;
  cloudinaryPublicId: string;
  type: string;
  uploadedAt: string;
  status: UploadDocumentStatus;
}

interface UserDataForUploadDocument {
  id: string;
  name: string;
  isVerified: boolean;
  kycStatus: KycStatus;
  isKycResubmitted: boolean;
  isKycSubmitted?: boolean;
  isSubscribed?:boolean
}

interface Props {
  organizerId: string;
}

export default function UploadDocumentSection({ organizerId }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("");
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<UploadDocument[]>([]);
  const [activePreviewUrl, setActivePreviewUrl] = useState<string | null>(null);
  const router = useRouter()

  const [user, setUser] = useState<UserDataForUploadDocument>({
    id: "",
    name: "",
    isVerified: false,
    kycStatus: KycStatus.NOT_APPLICABLE,
    isKycResubmitted: false,
    isKycSubmitted: false,
    isSubscribed:false
  });

  const dispatch = useAppDispatch();

  // 🔥 fetch docs
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const docs = await DOCUMENT_SERVICE.getDocuments(organizerId);
        const { documents, ...user } = docs.data.data;
        setDocuments(documents);
        setUser(user);
      } catch (err) {
        console.error("Failed to fetch documents", err);
      }
    };
    fetchDocuments();
  }, [organizerId]);

  // 🔥 states
// 🔥 backend driven states
const isRejectedByAdmin = user.kycStatus === KycStatus.REJECTED;
const isPendingByAdmin = user.kycStatus === KycStatus.PENDING;
const isVerified = user.kycStatus === KycStatus.VERIFIED;

// 🔥 doc states
const hasRejectedDocs = documents.some(d => d.status === "Rejected");
const hasPendingDocs = documents.some(d => d.status === "Pending");
const allApproved = documents.length>0 && documents.every(d=>d.status==="Approved");

// 🧠 user reuploaded rejected docs
const reuploadCompleted =
  isRejectedByAdmin &&
  !hasRejectedDocs &&
  hasPendingDocs;

// 🧠 first time send
const enableFirstSend =
  !user.isKycSubmitted &&
  documents.length >= 3 &&
  hasPendingDocs;

// 🧠 RESEND enable ONLY when admin rejected + reuploaded
const enableResend =
  isRejectedByAdmin &&
  reuploadCompleted;

// 🧠 lock upload when under review
const lockUpload =
  (isPendingByAdmin && user.isKycSubmitted) || isVerified;


// 🧠 FINAL disable
const shouldDisable =
 allApproved ||  
  isVerified ||
  (isPendingByAdmin) ||
  (isRejectedByAdmin && !reuploadCompleted);
  // latest map
  const latestStatusMap: Record<string, string> = {};
  documents.forEach((doc) => {
    latestStatusMap[doc.type] = doc.status;
  });
// 🚫 lock upload when verification already sent


  // 🔥 upload
  const handleUpload = async () => {
    if (!selectedFile || !documentType) {
      toast.error("Select file & document type");
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      showWarning("Only image allowed");
      return;
    }

    setUploading(true);

    try {
      const uploadResult = await uploadKycDocumentToCloudinary(
        selectedFile,
        organizerId
      );
      if (!uploadResult) return;

      const { publicId } = uploadResult;
      // find rejected doc of same type
 const rejectedDoc = documents.find(
    (d) => d.type === documentType && d.status === "Rejected"
  );

  let savedDoc;

  // 🔥 IF REJECTED EXISTS → UPDATE SAME DOC
  if (rejectedDoc) {
    savedDoc = await DOCUMENT_SERVICE.updateDocumentDetails(rejectedDoc.id, {
      cloudinaryPublicId: publicId,
      status: UploadDocumentStatus.PENDING, // important
    });
  } else {
    // 🆕 FIRST TIME UPLOAD
    savedDoc = await DOCUMENT_SERVICE.saveDocuments({
      organizerId,
      type: documentType,
      cloudinaryPublicId: publicId,
      name: selectedFile.name,
    });
  }

  const newDocData = {
    ...savedDoc.data.data,
    cloudinaryPublicId: publicId,
  };

  // replace same type doc
  setDocuments((prev) => {
    const filtered = prev.filter((d) => d.type !== documentType);
    return [...filtered, newDocData];
  });

  toast.success(`${documentType} uploaded`);
  setSelectedFile(null);
  setDocumentType("");
    } catch (err) {
      if (isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Upload failed");
      } else toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // 🔥 send verification
  const handleVerificationRequest = async () => {
    try {
      if (documents.length < 3) {
        showWarning("Upload all documents");
        return;
      }

      const data = {
        kycStatus: KycStatus.PENDING,
        isKycResubmitted: hasRejectedDocs,
      };

      const result = await DOCUMENT_SERVICE.sentVerificationRequest(
        organizerId,
        data
      );

      if (result) {
        showSuccess(
          hasRejectedDocs
            ? "Re-verification request sent"
            : "Verification request sent"
        );

        dispatch(updateKycStatus(KycStatus.PENDING));

        dispatch(
          setOrganizer({
            ...(JSON.parse(localStorage.getItem("organizerInfo") || "{}")),
            isKycSubmitted: true,
          })
        );

        setUser((prev) => ({ ...prev, isKycSubmitted: true }));
        if(!user.isSubscribed){
            setTimeout(() => { router.push("/organizer/subscription-plans"); }, 1200);
        }
      }
    } catch {
      toast.error("Failed to send verification");
    }
  };

  // preview
  const handleViewDocument = async (doc: UploadDocument) => {
    try {
      const res = await CLOUDINARY_SERVICE.getDocumentSignedUrl(
        doc.cloudinaryPublicId
      );
      setActivePreviewUrl(res.data.data);
    } catch {
      toast.error("Preview failed");
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">
        Upload Verification Documents
      </h3>

      {/* rejected msg */}
      {hasRejectedDocs && !hasPendingDocs && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Some documents rejected. Re-upload and resend verification.
        </div>
      )}

      {/* pending msg */}
      {hasPendingDocs && user.isKycSubmitted && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
          ⏳ Documents under admin review
        </div>
      )}

      {/* upload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <select
  value={documentType}
  disabled={lockUpload}
  onChange={(e) => setDocumentType(e.target.value)}
  className="border px-4 py-2 rounded-md"
>
  <option value="" disabled>
    Select Document Type
  </option>

  {documentTypes.map((type) => {
    const status = latestStatusMap[type];

    return (
      <option
        key={type}
        value={type}
        disabled={Boolean(status && status !== "Rejected")}
      >
        {type} {status && status !== "Rejected" ? "(Uploaded)" : ""}
      </option>
    );
  })}
</select>


        <input
          type="file"
          accept="image/*"
           disabled={lockUpload}
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          className="border px-4 py-2 rounded-md"
        />
      </div>

      {/* buttons */}
      <div className="flex justify-between mt-4">
        <button
          disabled={uploading||lockUpload}
          onClick={handleUpload}
          className="bg-blue-600 text-white px-6 py-2 rounded-md flex items-center gap-2"
        >
          <FaCloudUploadAlt />
          {uploading ? "Uploading..." : "Upload"}
        </button>

        {documents.length >= 3 && (
          <button
            onClick={handleVerificationRequest}
            disabled={shouldDisable}
            className={`px-4 py-2 rounded-md flex items-center gap-2 text-white ${
              shouldDisable
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            <FaPaperPlane />
        {isVerified ||allApproved 
  ? "Verification Completed"
  : isRejectedByAdmin && !reuploadCompleted
  ? "Re-upload Rejected Document"
  : enableResend
  ? "Re-send Verification Request"
  : isPendingByAdmin
  ? "Verification Sent"
  : "Send Verification Request"}



          </button>
        )}
      </div>

      {/* docs */}
      {documents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {documents.map((doc) => {
            const status =
              doc.status === "Approved"
                ? { icon: <FaCheckCircle />, color: "text-green-600 bg-green-50", text: "Approved" }
                : doc.status === "Rejected"
                ? { icon: <FaTimesCircle />, color: "text-red-600 bg-red-50", text: "Rejected" }
                : { icon: <FaClock />, color: "text-yellow-600 bg-yellow-50", text: "Pending" };

            return (
              <div key={doc.id} className="border rounded-xl p-4 bg-white shadow">
                <div className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${status.color}`}>
                  {status.icon}
                  {status.text}
                </div>

                <p className="font-semibold mt-3">{doc.type}</p>

                <button
                  onClick={() => handleViewDocument(doc)}
                  className="text-blue-600 text-sm mt-2"
                >
                  👁 View
                </button>
              </div>
            );
          })}
        </div>
      )}

      {activePreviewUrl && (
        <DocumentPreviewModal
          url={activePreviewUrl}
          onClose={() => setActivePreviewUrl(null)}
        />
      )}
    </div>
  );
}
