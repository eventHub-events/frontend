import { toast } from "react-toastify";

export const uploadImageToCloudinary= async(file:File): Promise<string | void>=>{
  const formData= new FormData();
  formData.append("file",file);
   formData.append("resource_type", "raw")
  formData.append("upload_preset","vishnu");

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
    return data.secure_url;
  }catch(error:unknown){
    console.log("err",error.message)
   const err=error instanceof Error? error.message:"Error uploading image to cloudinary"
   toast.error(err)
  }
}