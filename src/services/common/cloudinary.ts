import { toast } from "react-toastify";

export const uploadImageToCloudinary= async(file:File): Promise<string | void>=>{
  const formData= new FormData();
  formData.append("file",file);
  formData.append("upload_preset","vishnu");
  try{
    const response= await fetch(
       `https://api.cloudinary.com/v1_1/dzypi6gbs/image/upload`,
        {
          method: "POST",
          body: formData,
      }



    )
    const data=await response.json();
    if(!response.ok){
      throw new Error(`Cloudinary Error:${data.error.message}`)
    }
    return data.secure_url;
  }catch(error:unknown){
   const err=error instanceof Error? error.message:"Error uploading image to cloudinary"
   toast.error(err)
  }
}