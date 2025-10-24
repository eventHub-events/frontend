import { apiClient } from "../ApiClient";

export const eventManagementService = {
  fetchAllEvents: () => apiClient.get(`/api/admin/events`,{
    withCredentials : true
  }),
  updateEvent:(eventId: string,data:{   eventId?: string,eventApprovalStatus: string,reason?:string}) => apiClient.patch(`/api/admin/event-moderation/${eventId}/update`,data,{
    withCredentials:true
  }),
  rejectEvent:(eventId: string,data:{eventId?:string,eventApprovalStatus: string,rejectionReason?:string,approvedBy?:string}) => apiClient.patch(`/api/admin/events/${eventId}/reject`,data,{
    withCredentials :true
  }),
  approveEvent:(eventId: string, data:{eventId?:string,eventApprovalStatus: string,approvedBy?:string}) => apiClient.patch(`/api/admin/events/${eventId}/approve`,data,{
    withCredentials :true
  }),
  blockEvent:(eventId:string, data:{eventId?: string,rejectionReason: string, eventApprovalStatus: string, blockedBy?:string}) => apiClient.patch(`/api/admin/events/${eventId}/block`, data,{
    withCredentials : true
  }),
  unblockEvent:(eventId: string, data:{eventId?: string,eventApprovalStatus: string,approvedBy?: string}) => apiClient.patch(`/api/admin/events/${eventId}/unblock`, data,{
    withCredentials: true
  })

  
}