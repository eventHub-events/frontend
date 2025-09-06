'use client';

import { FaCheckCircle, FaStar, FaCamera } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { profileService } from '@/services/organizer/profileService';
import { useAppSelector } from '@/redux/hooks';
import UploadDocumentSection from './UploadDocumentSection';

const tabs = ['Profile', "Documents",'Verification', 'Security', 'Notifications'];

export default function OrganizerProfile() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [isEditing, setIsEditing] = useState(false);
 const organizer= useAppSelector((state)=>state.organizerAuth?.organizer)
 console.log("organizer is ",organizer)
 const organizerId= organizer?.id
 console.log("organizer id",organizerId)


  const [profileFormData, setProfileFormData] = useState({
    organizerId:"" ,
    name: "",
    email: "",
    phone: "",
    organization: "",
    totalEarnings: "",
    location: "",
    website: "",
    bio: ""
  });
const [profileData, setProfileData] = useState({
  organizerId:"",
  
    name: "",
    email: "",
    phone: "",
  organization: "",
  totalEarnings: "",
  location: "",
  website: "",
  bio: "",
});
  useEffect(()=>{
     if (organizer && !profileFormData.organizerId) {
    setProfileFormData((prev) => ({
      ...prev,
      organizerId: organizer.id,
      name: organizer.name || '',
      email: organizer.email || '',
    }));
  }
  },[organizer,profileFormData.organizerId])

  useEffect(  ()=> {
 const fetchProfile = async () => {
    try {
      if (!organizerId) return;
      const response = await profileService.getProfile(organizerId);
      console.log("response is",response.data.data)
      if (response?.data) {
        console.log("name is ",response.data.data.organizerId.name)
      const flatData={
        organizerId:organizerId,
        name:response.data.data.organizerId.name,
        email:response.data.data.organizerId.email,
        phone:response.data.data.organizerId.phone,
        organization:response.data.data.organization,
        totalEarnings:response.data.data.totalEarnings,
        location:response.data.data.location,
        website:response.data.data.website,
        bio:response.data.data.bio

      }
      console.log(flatData)

        setProfileData(flatData);
         setProfileFormData({
          organizerId:organizerId,
            name: flatData.name,
            email: flatData.email,
            phone: flatData.phone,
            organization: flatData.organization || '',
            totalEarnings: flatData.totalEarnings || '',
            location: flatData.location || '',
            website: flatData.website || '',
            bio: flatData.bio || ''
          });
      }
    } catch (error) {
      console.error("Error fetching organizer profile:", error);
    }
  };

  fetchProfile();
}, [organizerId]);

  function isProfileEmpty(profile: typeof profileData) {
    return (
      !profile.organization &&
      !profile.location &&
      !profile.website &&
      !profile.bio
    );
  }

  const handleSubmit = async () => {
    
    try {
      console.log("on  submission data",profileFormData)
       const result= isProfileEmpty(profileFormData)
       console.log("result is ",result)
       if (isProfileEmpty(profileData)) {
        await profileService.createProfile(profileFormData);
      } else {
        await profileService.updateProfile(profileFormData.organizerId,profileFormData);
      }
      setProfileData(profileFormData); // ✅ Update displayed data
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to submit profile", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      {/* Section Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Profile & Settings</h2>
        <p className="text-gray-500 text-sm">Manage your account settings and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 border-b-2 ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600 font-medium'
                : 'border-transparent text-gray-600 hover:text-blue-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Profile Header */}
      {activeTab === 'Profile' && (
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            {/* Left Side: Avatar and Info */}
            <div className="flex items-center space-x-5">
              <div className="relative w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl text-gray-500">
                <span className="text-4xl">👤</span>
                <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow">
                  <FaCamera className="text-gray-600 text-sm" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold">{organizer?.name}</h3>
                <p className="text-sm text-gray-600">TechEvents Inc</p>
                <div className="flex items-center text-sm mt-1 space-x-2">
                  <span className="text-green-600 flex items-center font-medium">
                    <FaCheckCircle className="mr-1" /> Verified Organizer
                  </span>
                  <span className="text-yellow-600 flex items-center font-medium">
                    <FaStar className="ml-2 mr-1" /> Trust Score: <span className="ml-1">85</span>
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Experienced event organizer specializing in technology conferences and workshops.
                </p>
              </div>
            </div>

            {/* Edit Button */}
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => {
                  setProfileFormData(profileData); // ✅ Pre-fill form
                  setIsEditing(true);
                }}
                className="px-4 py-2 border rounded text-blue-600 border-blue-600 hover:bg-blue-50 transition"
              >
                {isProfileEmpty(profileData) ? "Complete Profile" : "Edit Profile"}
              </button>
              {isProfileEmpty(profileData) && (
                <p className="text-sm text-red-500 mt-2">
                  Please complete your profile to continue using EventPro.
                </p>
              )}
            </div>
          </div>

          {/* Personal Info */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Full Name</label>
              <input
                className="w-full border rounded px-3 py-2"
                onChange={(e) => setProfileFormData({ ...profileFormData, name: e.target.value })}
                value={profileFormData.name}
                readOnly={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Phone</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={profileFormData.phone}
                onChange={(e) => setProfileFormData({ ...profileFormData, phone: e.target.value })}
                readOnly={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input
                className="w-full border rounded px-3 py-2"
                onChange={(e) => setProfileFormData({ ...profileFormData, email: e.target.value })}
                value={profileFormData.email}
                readOnly={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Location</label>
              <input
                className="w-full border rounded px-3 py-2"
                onChange={(e) => setProfileFormData({ ...profileFormData, location: e.target.value })}
                value={profileFormData.location}
                readOnly={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Organization</label>
              <input
                className="w-full border rounded px-3 py-2"
                onChange={(e) => setProfileFormData({ ...profileFormData, organization: e.target.value })}
                value={profileFormData.organization}
                readOnly={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Website</label>
              <input
                className="w-full border rounded px-3 py-2"
                onChange={(e) => setProfileFormData({ ...profileFormData, website: e.target.value })}
                value={profileFormData.website}
                readOnly={!isEditing}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Bio</label>
              <textarea
                className="w-full border rounded px-3 py-2"
                rows={3}
                onChange={(e) => setProfileFormData({ ...profileFormData, bio: e.target.value })}
                value={profileFormData.bio}
                readOnly={!isEditing}
              />
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-4 mt-4 md:col-span-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setProfileFormData(profileData); // Cancel and reset
                  }}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </>
      )}

      {/* Other Tabs Placeholder */}
      {activeTab === 'Documents' && organizerId && (
  <div className="mt-4">
    <UploadDocumentSection organizerId={organizerId} />
  </div>
)}

      {activeTab !== 'Profile' && activeTab !== 'Documents' && (
        <div className="text-gray-500 text-sm py-10 text-center">
          {activeTab} section content goes here.
        </div>
      )}
    </div>
  );
}
