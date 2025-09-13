import { uploadImageToCloudinary } from "@/services/common/cloudinary";
import { documentService } from "@/services/organizer/documentService";
import { documentTypes } from "@/types/organizer/organizerProfile";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaClock, FaCloudUploadAlt, FaTimesCircle, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

interface UploadDocument {
  _id: string;
  name: string;
  url: string | null;
  type: string;
  uploadedAt: string;
  status: string;
}

interface Props {
  organizerId: string;
}

export default function UploadDocumentSection({ organizerId }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("");
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<UploadDocument[]>([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const docs = await documentService.getDocuments(organizerId);
        setDocuments(docs.data.data);
      } catch (err) {
        console.error("Failed to fetch documents", err);
      }
    };
    fetchDocuments();
  }, [uploading, organizerId]);

  const handleUpload = async () => {
    if (!selectedFile || !documentType) {
      toast.error("Please select a file and document type");
      return;
    }

    setUploading(true);

    try {
      const fileUrl = await uploadImageToCloudinary(selectedFile);
      if (!fileUrl) return;

      const savedDoc = await documentService.saveDocuments({
        organizerId,
        type: documentType,
        url: fileUrl,
        name: selectedFile.name,
      });

      setDocuments((prev) => [...prev, { ...savedDoc.data.data, url: fileUrl }]);
      toast.success(`${documentType} upload successful`);

      setSelectedFile(null);
      setDocumentType("");
    } catch (err) {
      console.error("Upload error", err);
      toast.error("Failed to upload document");
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
      setDocuments((prev) => prev.filter((d) => d._id !== docId));
      toast.success("Document removed successfully");
    } catch (err) {
      console.error("Failed to remove document", err);
      toast.error("Failed to remove document");
    }
  };

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
          {documentTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          className="border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Upload Button */}
      <button
        disabled={uploading}
        onClick={handleUpload}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 flex items-center gap-2"
      >
        <FaCloudUploadAlt />
        {uploading ? "Uploading..." : "Upload"}
      </button>

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
                  key={doc._id}
                  className="relative rounded-lg border border-gray-200 shadow-sm bg-white overflow-hidden hover:shadow-md transition duration-200 flex flex-col"
                >
                  {/* Close Button */}
                  {doc.status !== "Approved" && (
                    <button
                      onClick={() => handleRemoveDocument(doc._id)}
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
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
