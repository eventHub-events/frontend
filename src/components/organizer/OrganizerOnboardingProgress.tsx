import { IOrganizer } from "@/types/authTypes";

export default function OrganizerOnboardingProgress({organizer}:{ organizer: IOrganizer | null }){
  if (!organizer) return null;
 let completed = 0;
 if(organizer?.isProfileCompleted) completed++;
 if(organizer?.isKycSubmitted) completed++;
 if (organizer?.isSubscribed) completed++;

 const percent = Math.round((completed/3)*100);

 if(percent===100) return null;

 return(
  <div className="bg-white border rounded-xl p-5 shadow-sm mb-6">

    <div className="flex justify-between mb-2">
      <h3 className="font-semibold text-gray-800">Organizer Setup</h3>
      <span className="font-semibold">{percent}%</span>
    </div>

    <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
      <div
        className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 transition-all duration-500"
        style={{width:`${percent}%`}}
      />
    </div>

    <div className="mt-4 space-y-1 text-sm">
      <Step done={!!organizer?.isProfileCompleted} label="Complete profile"/>
      <Step done={!!organizer?.isKycSubmitted} label="Upload documents"/>
      <Step done={!!organizer?.isSubscribed} label="Buy subscription" />
    </div>
  </div>
 )
}

function Step({done,label}:{done:boolean,label:string}){
 return(
  <div className={`flex gap-2 ${done?"text-green-600":"text-gray-400"}`}>
    <div className={`w-3 h-3 rounded-full ${done?"bg-green-500":"bg-gray-300"}`}/>
    {label}
  </div>
 )
}
