import { toast } from "react-toastify";
import { CLOUDINARY_SERVICE } from "./cloudinaryService";

export const uploadImageToCloudinary =  async(file:File, folder: string): Promise<{secureUrl : string; publicId :string}| undefined>=>{

   const signedData = await CLOUDINARY_SERVICE.getCloudinarySignature(folder);
   const { signature, timestamp, apiKey, } = signedData.data.data;

  // const formData= new FormData();
  // formData.append("file",file);
  //  formData.append("resource_type", "raw")
  // formData.append("upload_preset","vishnu");
  console.log("cloudinary",signedData)
  
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);
  formData.append("folder", folder);

  try{
    const response= await fetch(
       `https://api.cloudinary.com/v1_1/dzypi6gbs/raw/upload`,
        {
          method: "POST",
          body: formData,
      }



    )
    const data=await response.json();
    console.log("data is", data)
    if(!response.ok){
      throw new Error(`Cloudinary Error:${data.error.message}`)
    }
    return {
        secureUrl: data.secure_url,
         publicId: data.public_id,
    }
  }catch(error:unknown){
   console.log(error)
   const err=error instanceof Error? error.message:"Error uploading image to cloudinary"
   toast.error(err);
   throw error;
  }
}