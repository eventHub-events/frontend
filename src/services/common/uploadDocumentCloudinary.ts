
import { toast } from "react-toastify";
import { CLOUDINARY_SERVICE } from "./cloudinaryService"

export const uploadKycDocumentToCloudinary = async (file: File, organizerId: string): Promise<{publicId : string }> => {

  const signedData  = await CLOUDINARY_SERVICE.getDocumentCloudinarySignature(organizerId);

  console.log("signedData", signedData);
   const { signature, timestamp, apiKey,  folder } = signedData.data.data;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
   formData.append("timestamp", timestamp.toString());
   formData.append("signature", signature);
   formData.append("folder", folder);
  //  formData.append("resource_type", "raw");
  //  formData.append("access_mode", "private");
  formData.append("type", "authenticated");
  
    try{
             const res = await fetch(
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL!,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  console.log("data", data)
return {
   publicId : data.public_id
}
}catch(err){
   
       const error = err instanceof Error? err.message:"Error uploading document to cloudinary"
       toast.error(error);
       throw error;
}
  

}