
import { DOCUMENT_SERVICE } from "@/services/organizer/documentService";
import { DocumentVerifiedType } from "@/types/organizer/organizerProfile";
import { useEffect, useState } from "react";
import {
  FiCheckCircle,
  FiClock,
  FiXCircle,
} from "react-icons/fi";

interface KycVerificationStatusProps {
  overallStatus: "Approved" | "Rejected" | "Pending";
  organizerId: string;
}

export default function KycVerificationStatus({
  overallStatus,
  organizerId,
}: KycVerificationStatusProps) {
  const [documents, setDocuments] = useState<DocumentVerifiedType[]>([]);

 

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const docs = await DOCUMENT_SERVICE.getDocuments(organizerId);
        console.log("docs is ", docs)
        setDocuments(docs.data?.data.documents);
      } catch (error) {
        console.error("Error fetching documents", error);
      }
    };

    fetchDocs();
  }, [organizerId]);

  const getIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <FiCheckCircle className="text-green-500 text-lg" />;
      case "Rejected":
        return <FiXCircle className="text-red-500 text-lg" />;
      case "Pending":
      default:
        return <FiClock className="text-yellow-500 text-lg" />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Approved":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          badge: "bg-green-100 text-green-700",
        };
      case "Rejected":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          badge: "bg-red-100 text-red-700",
        };
      case "Pending":
      default:
        return {
          bg: "bg-yellow-50",
          text: "text-yellow-700",
          badge: "bg-yellow-100 text-yellow-700",
        };
    }
  };

  return (
    <div className="rounded-xl p-6 bg-white shadow-sm space-y-6">
      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-800">
        KYC Verification Status
      </h2>

      {/* Overall Status */}
      <div className="flex items-start gap-4 bg-gray-50 p-4 rounded-xl">
        <div className="mt-1">{getIcon(overallStatus)}</div>
        <div>
          <h3 className="text-lg font-bold capitalize">{overallStatus}</h3>
          <p className="text-sm text-gray-600">
            {overallStatus === "Approved" &&
              "Your account has been successfully verified."}
            {overallStatus === "Rejected" &&
              "Your verification was rejected. See details below."}
            {overallStatus === "Pending" &&
              "Your documents are under review. Please wait for approval."}
          </p>
        </div>
      </div>

      {/* Documents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents?.map((doc, idx) => {
          const styles = getStatusStyles(doc.status);

          return (
            <div
              key={idx}
              className={`rounded-xl p-4 ${styles.bg} ${styles.text} shadow-sm hover:shadow-md transition`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getIcon(doc.status)}
                  <h4 className="text-sm font-semibold">{doc.type}</h4>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles.badge}`}>
                  {doc.status}
                </span>
              </div>
              <p className="text-xs">
                {doc.status === "Approved" && `${doc.type} Verified`}
                {doc.status === "Pending" && "Under review."}
                {doc.status === "Rejected" && (
                  <>
                    <span className="block font-medium">Reason:</span>
                    <span className="italic">{doc.reason}</span>
                  </>
                )}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
