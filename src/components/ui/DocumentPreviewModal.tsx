import Image from "next/image";
import { FaTimes } from "react-icons/fa";

interface Props {
  url: string;
  onClose: () => void;
}

export default function DocumentPreviewModal({ url, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] p-4">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
        >
          <FaTimes size={18} />
        </button>

        {/* Content */}
        <div className="w-full h-[80vh] flex items-center justify-center overflow-auto">
          {url.endsWith(".pdf") ? (
            <iframe
              src={url}
              className="w-full h-full rounded-md"
            />
          ) : (
            <Image
              src={url}
              alt="Document Preview"
              width={900}
              height={700}
              className="object-contain max-h-full"
              unoptimized
            />
          )}
        </div>
      </div>
    </div>
  );
}
