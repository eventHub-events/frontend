import { apiClient } from "../ApiClient";

export const documentService={
  getDocuments:(organizerId:string)=>apiClient.get(`api/organizer/${organizerId}`),

  saveDocuments:(data:{
    organizerId:string;
    type:string;
    url:string;
    name:string;
  })=>apiClient.post(`/api/organizer/upload-document`,data),



}

