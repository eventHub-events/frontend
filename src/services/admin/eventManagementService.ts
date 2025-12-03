import { API_ROUTES } from "@/constants/apiRoutes";
import { apiClient } from "../ApiClient";

export const eventManagementService = {
  fetchAllEvents: () => apiClient.get(API_ROUTES.EVENT_ADMIN.FETCH_ALL_EVENTS,{
    withCredentials : true
  }),
  updateEvent:(eventId: string,data:{   eventId?: string,eventApprovalStatus: string,reason?:string}) => apiClient.patch(API_ROUTES.EVENT_ADMIN.UPDATE_ADMIN(eventId),data,{
    withCredentials:true
  }),
  rejectEvent:(eventId: string,data:{eventId?:string,eventApprovalStatus: string,rejectionReason?:string,approvedBy?:string}) => apiClient.patch(API_ROUTES.EVENT_ADMIN.REJECT_EVENT(eventId),data,{
    withCredentials :true
  }),
  approveEvent:(eventId: string, data:{eventId?:string,eventApprovalStatus: string,approvedBy?:string}) => apiClient.patch(API_ROUTES.EVENT_ADMIN.APPROVE_EVENT(eventId),data,{
    withCredentials :true
  }),
  blockEvent:(eventId:string, data:{eventId?: string,rejectionReason: string, eventApprovalStatus: string, blockedBy?:string}) => apiClient.patch(API_ROUTES.EVENT_ADMIN.BLOCK_EVENT(eventId), data,{
    withCredentials : true
  }),
  unblockEvent:(eventId: string, data:{eventId?: string,eventApprovalStatus: string,approvedBy?: string}) => apiClient.patch(API_ROUTES.EVENT_ADMIN.UNBLOCK_EVENT(eventId), data,{
    withCredentials: true
  })

 
}