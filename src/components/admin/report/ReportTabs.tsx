import { ReportTypes } from "@/types/admin/report";

const tabs = [
  { label: "Events", value: ReportTypes.EVENT },
  { label: "Organizers", value: ReportTypes.ORGANIZER },
  { label: "Users", value: ReportTypes.USER },
  { label: "Chat Messages", value: ReportTypes.CHAT_MESSAGE },
];


export default function ReportTabs({active,onChange}:{ active: ReportTypes; onChange: (value: ReportTypes) => void }){
  return (
          <div className="flex gap-3">
      {tabs.map(tab => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-4 py-2 rounded-lg ${
            active === tab.value
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  ) 
}