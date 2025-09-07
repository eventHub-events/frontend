import { uploadImageToCloudinary } from "@/services/common/cloudinary";
import { documentService } from "@/services/organizer/documentService";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const documentTypes = ["AadharCard", "PANCard", "BusinessCertificate"];

interface UploadDocument {
  _id: string;
  name: string;
  url: string | null;
  type: string;
  uploadedAt: string;
}

interface Props {
  organizerId: string;
}

export default function UploadDocumentSection({ organizerId }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("");
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<UploadDocument[]>([]);
  useEffect(()=>{
    const fetchDocuments= async ()=>{
      const docs= await documentService.getDocuments(organizerId);
      console.log(docs.data.data)
      setDocuments(docs.data.data)

    }
    fetchDocuments()

  },[uploading,organizerId])

  const handleUpload = async () => {
    if (!selectedFile || !documentType) {
      toast.error("Please select a file and document type");
      return;
    }

    setUploading(true);

    try {
     const fileUrl=await uploadImageToCloudinary(selectedFile)
     if(!fileUrl)return

       const savedDoc = await documentService.saveDocuments({
      organizerId,
      type: documentType,
      url: fileUrl, // Store Cloudinary URL directly
      name: selectedFile.name,
    });
      setDocuments((prev) => [...prev,{... savedDoc.data.data,url: fileUrl}]);
      console.log("documents is ",documents)
      toast.success(`${documentType} upload successful`)

      setSelectedFile(null);
      setDocumentType("");
    } catch (err) {
      console.error("Upload error", err);
      alert("Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Upload Verification Documents</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <select
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          className="border px-3 py-2 rounded"
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
          className="border px-3 py-2 rounded"
        />
      </div>

      <button
        disabled={uploading}
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
      >
        <FaCloudUploadAlt />
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {documents.length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-medium mb-2">Uploaded Documents</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <div
                key={doc._id}
                className="border rounded p-3 shadow-sm bg-gray-50"
              >
              
<Image
  src={doc.url ?? ""}
  alt={doc.type}
  width={300} // Required
  height={160} // Required
  className="object-contain rounded mb-2"
  unoptimized 
/>
                <div>
                  <p className="font-medium">{doc.type}</p>
                  <p className="text-sm text-gray-600">
                   Uploaded on: {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
