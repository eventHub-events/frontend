import { useAppDispatch } from "@/redux/hooks";
import { updateKycStatus } from "@/redux/slices/organizer/authSlice";
import { uploadImageToCloudinary } from "@/services/common/cloudinary";
import { documentService } from "@/services/organizer/documentService";
import { KycStatus, UploadDocumentStatus } from "@/types/admin/Enums/organizerVerificationEnum";
import { documentTypes } from "@/types/organizer/organizerProfile";
import { showSuccess, showWarning } from "@/utils/toastService";
import { AxiosError, isAxiosError } from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaClock, FaCloudUploadAlt, FaTimesCircle, FaTimes, FaPaperPlane } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

interface UploadDocument {
  id: string;
  name: string;
  url: string | null;
  type: string;
  uploadedAt: string;
  status: UploadDocumentStatus;
}
interface UserDataForUploadDocument {
  id: string,
  name : string,
  isVerified: boolean,
  kycStatus: KycStatus,
  isKycResubmitted: boolean
}

interface Props {
  organizerId: string;
}


export default function UploadDocumentSection({ organizerId }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("");
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<UploadDocument[]>([]);
  const [user, setUser]= useState<UserDataForUploadDocument>({
    id:"",
    name:"",
    isVerified: false,
    kycStatus :KycStatus.NOT_APPLICABLE,
    isKycResubmitted: false

  })

  const uploadedTypes = documents.map(doc => doc.type);
  const rejectedDocs  = documents. filter(doc => doc.status === "Rejected");
  const [rejectedDocType ,setRejectedDocType] = useState("")
  const [rejectedDocId, setRejectedDocId] = useState("") 
  const[isUpdating, setIsUpdating] = useState(false)
  const dispatch  = useAppDispatch()


  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const docs = await documentService.getDocuments(organizerId);
        console.log("docs is",docs)
        const {documents,...user} = docs.data.data
        setDocuments(documents);
        setUser(user)
        console.log("rejectedDocs is",rejectedDocs)

        console.log("user is",user);
        console.log("documents", documents);
      } catch (err) {
        console.error("Failed to fetch documents", err);
      }
    };
    fetchDocuments();
    setIsUpdating(false)
  }, [uploading, organizerId,isUpdating]);

  const latestStatusMap: Record<string, string> = {};
documents.forEach((doc) => {
  latestStatusMap[doc.type] = doc.status;
});

 const handleUpload = async () => {
  if (!selectedFile || !documentType) {
    toast.error("Please select a file and document type");
    return;
  }

  setUploading(true);

  try {
    const fileUrl = await uploadImageToCloudinary(selectedFile);
    if (!fileUrl) return;

    // let newDocData:UploadDocument | null = null;

    if (rejectedDocType && documentType === rejectedDocType) {
      // Re-upload case
      const updatedData = await documentService.updateDocumentDetails(rejectedDocId, {
        url: fileUrl,
     status:UploadDocumentStatus.PENDING
      });

      if (updatedData) {
        const newDocData = { ...updatedData.data.data, url: fileUrl };
       
       
        // Replace the old document in state
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === rejectedDocId ? newDocData : doc
          )
        );

        toast.success(`${documentType} re-upload successful`);
      }

      // Reset re-upload state
      setRejectedDocId("");
      setRejectedDocType("");
    } else {
      // Fresh upload case
      const savedDoc = await documentService.saveDocuments({
        organizerId,
        type: documentType,
        url: fileUrl,
        name: selectedFile.name,
      });

      if (savedDoc) {
       const  newDocData = { ...savedDoc.data.data, url: fileUrl };
        setDocuments((prev) => [...prev, newDocData
          
        ]);

        toast.success(`${documentType} upload successful`);
      }
    }

    setSelectedFile(null);
    setDocumentType("");
  } catch (err) {
 if (isAxiosError(err)) {
  const errors = err.response?.data?.errors;
  const message = err.response?.data?.message;

  if (Array.isArray(errors)) {
    errors.forEach((msg: string) => {
      const field = msg.split("-")[1].trim(); // "name"
      console.log("Field causing error:", field);
      toast.error(field); // Or customize message if needed
    });
  } else if (typeof message === "string") {
    toast.error(message);
  } else {
    toast.error("Upload failed. Please try again.");
  }
} else {
  toast.error("Unexpected upload error.");
}

  } finally {
    setUploading(false);
  }
};


  const handleRemoveDocument = async (docId: string) => {
    try {
      // Optionally call backend to delete
      await documentService.deleteDocument(docId);
      console.log("doc id",docId)

      // Remove from UI
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
      toast.success("Document removed successfully");
    } catch (err) {
      console.error("Failed to remove document", err);
      toast.error("Failed to remove document");
    }
  };

  const handleVerificationRequest = async () => {
    try {
              if(documents.length<3){
                showWarning("Upload all the documents for verification");
                return
              }
           const data = {
            kycStatus: KycStatus.PENDING
           }
          const result = await documentService.sentVerificationRequest(organizerId,data) ;
          if(result) {
              showSuccess("Verification request  submitted successfully")
                 dispatch(updateKycStatus(data.kycStatus));
                 setIsUpdating(true)
            }

           }catch( err ){
              setIsUpdating(false);
           }

  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">
        Upload Verification Documents
      </h3>

      {/* Upload Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <select
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Document Type</option>
          
        {documentTypes.map((type) => {
  const status = latestStatusMap[type];

  return (
    <option
      key={type}
      value={type}
      disabled ={status !== undefined && status !== "Rejected"} 
    >
      {type} {status && status !== "Rejected" ? "(Already uploaded)" : ""}
    </option>
  );
})}

        </select>

        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          className="border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Upload Button */}
     <div className="flex justify-between items-center mt-4">
  {/* Upload Button */}
  <button
    disabled={uploading || documents.length > 3}
    onClick={handleUpload}
    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 flex items-center gap-2"
  >
    <FaCloudUploadAlt />
    {uploading ? "Uploading..." : "Upload"}
  </button>

  {/* Send Verification Request Button */}
  <button
    onClick={handleVerificationRequest}
    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200 flex items-center gap-2"
     disabled={documents.length === 0 || user.kycStatus === KycStatus.REJECTED && rejectedDocs.length>0 ||user.kycStatus === KycStatus.PENDING &&documents.length ===3 } // disable if no documents uploaded
  >
    <FaPaperPlane />
   {user.kycStatus === KycStatus.REJECTED? "Send ReVerification Request":"Send Verification Request"} 
  </button>
</div>

      {/* Uploaded Documents */}
      {documents.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-medium text-gray-800 mb-4">
            Uploaded Documents
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {documents.map((doc) => {
              const getStatusStyles = (status: string) => {
                switch (status) {
                  case "Approved":
                    return {
                      color: "text-green-600",
                      bg: "bg-green-100",
                      icon: <FaCheckCircle className="text-green-500" />,
                      label: "Approved",
                    };
                  case "Rejected":
                    return {
                      color: "text-red-600",
                      bg: "bg-red-100",
                      icon: <FaTimesCircle className="text-red-500" />,
                      label: "Rejected",
                    };
                  case "Pending":
                  default:
                    return {
                      color: "text-yellow-600",
                      bg: "bg-yellow-100",
                      icon: <FaClock className="text-yellow-500" />,
                      label: "Pending",
                    };
                }
              };

              const status = getStatusStyles(doc.status);

              return (
                <div
                  key={doc.id}
                  className="relative rounded-lg border border-gray-200 shadow-sm bg-white overflow-hidden hover:shadow-md transition duration-200 flex flex-col"
                >
                  {/* Close Button */}
                  {doc.status !== "Approved" && doc.status !=="Rejected"&&(
                    <button
                      onClick={() => handleRemoveDocument(doc.id)}
                      className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                    >
                      <FaTimes />
                    </button>
                  )}

                  {/* Image */}
                  <div className="w-full aspect-[4/3] bg-gray-50 flex items-center justify-center overflow-hidden">
                    {doc.url && (
                      <Image
                        src={doc.url}
                        alt={doc.type}
                        width={300}
                        height={200}
                        className="object-contain w-full h-full"
                        unoptimized
                      />
                    )}
                  </div>

                  {/* Info & Status */}
                  <div className="p-4 flex justify-between items-start">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{doc.type}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div
                      className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${status.bg} ${status.color}`}
                    >
                      {status.icon}
                      {status.label}
                    </div>
                   
                  </div>
                     {doc.status === "Rejected" && (
  <div className="p-4 pt-0">
    <button
      onClick={() => {
        setDocumentType(doc.type);
          setRejectedDocId(doc.id.toString())
        setRejectedDocType(doc.type)
        setSelectedFile(null); // Let user pick a new one
        toast.info(`You can re-upload your ${doc.type}`);
      }}
      className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition"
    >
      <FaCloudUploadAlt className="text-base" />
      Re-upload
    </button>
  </div>
)}


                        
                        
                        
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
