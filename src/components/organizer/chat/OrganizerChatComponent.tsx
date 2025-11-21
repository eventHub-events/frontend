"use client";

import ChatDrawer from "@/components/chat/ChatDrawer";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearCommunityUnread, clearUnread } from "@/redux/slices/common/chat/chatAlertSlice";

import { eventService } from "@/services/organizer/eventServices";
import { OrganizerChatService } from "@/services/organizer/organizerChatService";
import { useEffect, useState } from "react";

export default function OrganizerChat() {
  const dispatch = useAppDispatch();  // ✅ CALL HOOK HERE (TOP LEVEL)

  const [events, setEvents] = useState([]);
  const [conversations, setConversations] = useState<any>(null);
  const [selected, setSelected] = useState<any>(null);
  

  const organizer = useAppSelector((s) => s.organizerAuth.organizer);
const unread = useAppSelector((s) => s.chatAlert.unread );
const communityUnread = useAppSelector(s => s.chatAlert.communityUnread);



  // 👉 FIX: this function NO LONGER calls hooks
 
     
  useEffect(() => {
    if (!organizer) return;

    const fetchEvents = async () => {
      try {
        const res = await eventService.fetchEvents(organizer.id);
        setEvents(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchEvents();
    console.log("unread", unread)
  }, [organizer]);

  const loadEventChats = async (eventId: string) => {
    try {
      const res = await OrganizerChatService.getOrganizerEventChats(eventId);
      console.log("reeeee",res)
      setConversations(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex h-full">

      {/* ******** Column 1 – Events ******** */}
      <div className="w-60 border-r bg-gray-50">
        <h2 className="p-3 font-bold">My Events</h2>

        {events.map((ev: any) => (
          <div
            key={ev.eventId}
            onClick={() => {
              loadEventChats(ev.eventId);
              setSelected(null);
            }}
            className="p-3 cursor-pointer hover:bg-gray-200"
          >
            {ev.title}
          </div>
        ))}
      </div>

      {/* ******** Column 2 – Conversations ******** */}
      <div className="w-72 border-r bg-white">
        <h2 className="p-3 font-bold">Conversations</h2>

        <div className="p-2 text-xs text-gray-400">Private Chats</div>

       {conversations?.privateChats?.map((c) => (
  <div
    key={c.id}
    onClick={() => {
      // dispatch(clearUnread(c.id));
      setSelected({
                mode: "private",
                conversationId: c.id,
                userName: c.userName,
                userId: c.userId,
                eventId: c.eventId,
                peerId: c.userId,
              });
    }}
    className="p-3 cursor-pointer hover:bg-gray-100 flex justify-between items-center"
  >
    <span>{c.userName}</span>

    {unread[c.id] && <span className="w-2 h-2 bg-red-600 rounded-full"></span>}
  </div>
))}


        <div className="p-2 text-xs text-gray-400 mt-4">Community</div>

        {conversations?.communityChat && (
          <div
            onClick={() => {
               // 👈 CLEAR BADGE
               dispatch(clearCommunityUnread());
              setSelected({
                mode: "community",
                conversationId: conversations.communityChat.id,
                eventId: conversations.communityChat.eventId,
              });
            }}
            className="p-3 cursor-pointer hover:bg-gray-100 flex justify-between items-center"
          >
            <span>Community Chat</span>

          {communityUnread && (
  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
)}
          </div>
        )}
      </div>

      {/* ******** Column 3 – ChatWindow ******** */}
      <div className="flex-1">
        {selected ? (
          <ChatDrawer
            open={true}
            onClose={() => setSelected(null)}
            mode={selected.mode}
            eventId={selected.eventId}
            organizerId={organizer?.id!}
            userId={organizer?.id!}
            role="organizer"
            conversationId={selected.conversationId}
            userName={organizer?.name!}
            peerId={selected.userId}
            targetName={selected.userName}
            isChatOpen={true}  
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Select a chat
          </div>
        )}
      </div>
    </div>
  );
}
