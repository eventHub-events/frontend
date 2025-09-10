"use client"


import { useEffect, useState } from "react"
import { FiDownload, FiEye } from "react-icons/fi"


interface Document {
  type:string;
  status:"Pending" | "Verified" |"Rejected";
  url:string;
}

interface Organizer{
  id:string;
  name:string;
  email:string;
  company:string;
  date:string;
  status:"Pending"|"Verified"|"Rejected"
  documents:Document[];

}

const dummyOrganizers: Organizer[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    company: 'Smith Events LLC',
    date: '1/15/2024',
    status: 'Pending',
    documents: [
      { type: 'Government ID', status: 'Verified', url: '#' },
      { type: 'Business License', status: 'Pending', url: '#' },
      { type: 'Tax Certificate', status: 'Pending', url: '#' },
    ],
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    company: 'Creative Events Co.',
    date: '1/10/2024',
    status: 'Verified',
    documents: [],
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike@example.com',
    company: 'Tech Meetups Inc.',
    date: '1/8/2024',
    status: 'Rejected',
    documents: [],
  },
];

export const OrganizeVerification=()=>{
  const[organizers,setOrganizers]=useState<Organizer[]>();
  const[selectedOrg,setSelectedOrg]=useState<Organizer |null>(null);

  useEffect(()=>{
    setOrganizers(dummyOrganizers);
    setSelectedOrg(dummyOrganizers[0]);
  },[])


  return (
    <div className="p-6">
      {/* Search+filter */}
      <div className="flex justify-between items-center mb-6">
        <input 
            type="text"
            placeholder="Search Verification..."
            className="w-1/3 px-4 py-2 border rounded"
            />
            <select className="border rounded px-3 py-2">
                 <option>All status</option>
                 <option>Pending</option>
                 <option >Verified</option>
                 <option>Rejected</option>
            </select>
      </div>
      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Panel */}
        <div className="col-span-1 bg-white shadow rounded p-4 space-y-4">
           {organizers?.map((org)=>(
            <div
               key={org.id}
               className={`p-3 rounded cursor-pointer ${
                selectedOrg?.id===org.id?'bg-blue-100':'hover:bg-gray-100'
               }`}
               onClick={()=>setSelectedOrg(org)}
               >
                <div className="font-semibold">{org.name}</div>
                <div className="text-sm text-gray-500">{org.email}</div>
                <div className="flex justify-between items-center mt-1">
                  <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    org.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : org.status === 'Verified'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {org.status}
                </span>
                 <span className="text-xs text-gray-400">{org.date}</span>
                  </div>
            </div>
           ))}
        </div>
         {/* Right Panel */}
        <div className="col-span-2 bg-white shadow rounded p-6">
          {selectedOrg && (
            <>
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold">Verification Details</h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedOrg.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : selectedOrg.status === 'Verified'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {selectedOrg.status}
                </span>
              </div>

              {/* Organizer Info */}
              <div className="border rounded p-4 mb-6 bg-gray-50">
                <p className="font-semibold">{selectedOrg.name}</p>
                <p className="text-sm text-gray-500">{selectedOrg.email}</p>
                <p className="text-sm text-gray-500">{selectedOrg.company}</p>
              </div>

              {/* Submitted Documents */}
              <div className="space-y-3 mb-6">
                {selectedOrg.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 border rounded"
                  >
                    <div>
                      <p className="font-medium">{doc.type}</p>
                      <p
                        className={`text-sm ${
                          doc.status === 'Verified'
                            ? 'text-green-600'
                            : doc.status === 'Pending'
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}
                      >
                        {doc.status}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button>
                        <FiEye />
                      </button>
                      <button>
                        <FiDownload />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded">
                  ✓ Approve
                </button>
                <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded">
                  ✗ Reject
                </button>
              </div>
            </>
          )}
        </div>
      </div>

     
      </div>
    
  )
}