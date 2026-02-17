'use client';

import { FaCheckCircle, FaStar, FaCamera } from 'react-icons/fa';
import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import UploadDocumentSection from './UploadDocumentSection';
import { uploadImageToCloudinary } from '@/services/common/cloudinary';
import { toast } from 'react-toastify';
import Image from 'next/image';
import KycVerificationStatus from './OrganizerKycVerification';
import { FiXCircle } from 'react-icons/fi';
import { SecurityTab } from './OrganizerPassword&security';
import axios, { AxiosError } from 'axios';
import { showError, showInfo } from '@/utils/toastService';
import { setOrganizer, updateKycAndVerificationStatus } from '@/redux/slices/organizer/authSlice';
import OrganizerPaymentsSection from './payments/OrganizerPaymentsSection';
import { PROFILE_SERVICE } from '@/services/organizer/profileService';
import OrganizerOnboardingProgress from './OrganizerOnboardingProgress';
import { KycStatus } from '@/types/admin/Enums/organizerVerificationEnum';


const tabs = ['Profile', 'Documents', 'Verification', 'Security',"Payments"];
// const tabs = ['Profile', 'Documents', 'Verification', 'Security',"Payments", 'Notifications'];

type ProfileFormData = {
  organizerId: string;
  name: string;
  email: string;
  phone: string;
  isVerified: boolean;
  kycStatus: 'Pending' | 'Approved' | 'Rejected';
  organization: string;
  totalEarnings: string;
  location: string;
  website: string;
  bio: string;
  profilePicture: string;
};
interface StripeAccount {
  id: string;
  label: string;
  onboarded: boolean;
  isDefault: boolean;
}

// Only include fields allowed in input fields (string values)
const editableFields: Array<keyof Pick<ProfileFormData,
  'name' | 'email' | 'phone' | 'location' | 'organization' | 'website'
>> = [
  'name', 'email', 'phone', 'location', 'organization', 'website'
];

export default function OrganizerProfile() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [isEditing, setIsEditing] = useState(false);
  const organizer = useAppSelector((state) => state.organizerAuth?.organizer);
  const getOnboardingMessage = () => {
  if (!organizer) return null;

  if (!organizer.isProfileCompleted) {
    return {
      type: "warning",
      message: "Complete your profile to continue using EventHub.",
      action: "Go to Profile"
    };
  }

  if (!organizer.isKycSubmitted) {
    return {
      type: "info",
      message: "Upload verification documents to unlock features.",
      action: "Upload Documents"
    };
  }

  if (organizer.kycStatus === "Pending") {
    return {
      type: "info",
      message: "Your documents are under admin review.",
      action: null
    };
  }

  if (organizer.kycStatus === "Verified" && !organizer.isSubscribed) {
    return {
      type: "success",
      message: "Verification approved! Purchase a subscription to start creating events.",
      action: "View Plans"
    };
  }

  return null;
};

  const organizerId = organizer?.id;
  const dispatch = useAppDispatch();
  const [stripeAccounts, setStripeAccounts] = useState<StripeAccount[]>([]);


  const [profileFormData, setProfileFormData] = useState<ProfileFormData>({
    organizerId: '',
    name: '',
    email: '',
    phone: '',
    isVerified: false,
    kycStatus: 'Pending',
    organization: '',
    totalEarnings: '',
    location: '',
    website: '',
    bio: '',
    profilePicture: '',
  });

  const [profileData, setProfileData] = useState<ProfileFormData>({ ...profileFormData });
useEffect(() => {
 if(!organizer) return;
 if(organizer.role !== "organizer") return;

 if(!organizer.isProfileCompleted){
   setActiveTab("Profile");
   return;
 }

 if(!organizer.isKycSubmitted){
   setActiveTab("Documents");
   return;
 }

 if(!organizer.isStripeConnected){
   setActiveTab("Payments");
   return;
 }

},[organizer]);

  useEffect(() => {
    if (organizer && !profileFormData.organizerId) {
      setProfileFormData((prev) => ({
        ...prev,
        organizerId: organizer.id,
        name: organizer.name || '',
        email: organizer.email || '',
      }));
    }
  }, [organizer, profileFormData.organizerId]);

  useEffect(() => {
  if (activeTab !== "Payments" || !organizerId) return;

  const fetchStripeAccounts = async () => {
    try {
      const res = await PROFILE_SERVICE.getStripeAccounts(organizerId);
      console.log("accounts", res)
      setStripeAccounts(res.data.data||[]);
    } catch(err) {
      console.log(err)
       if(err instanceof AxiosError){
      
         if (err?.response?.status === 404||err?.response?.status === 403) {
       setStripeAccounts([]); // treat as empty
       return;
       }
    }
      showError("Failed to load Stripe accounts");
    }
  };

  fetchStripeAccounts();
}, [activeTab, organizerId]);




  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!organizerId) return;
      
        const response = await PROFILE_SERVICE.getProfile(organizerId);
       console.log("response is", response)

        if (response?.data?.data) {
          const flatData: ProfileFormData = {
            organizerId,
            name: response.data.data.organizerId.name,
            email: response.data.data.organizerId.email,
            phone: response.data.data.organizerId.phone,
            isVerified: response.data.data.organizerId.isVerified,
            kycStatus: response.data.data.organizerId.kycStatus,
            organization: response.data.data.organization || '',
            totalEarnings: response.data.data.totalEarnings || '',
            location: response.data.data.location || '',
            website: response.data.data.website || '',
            bio: response.data.data.bio || '',
            profilePicture: response.data.data.profilePicture || '',
          };

          setProfileData(flatData);
          setProfileFormData(flatData);
          dispatch(
            updateKycAndVerificationStatus({
              kycStatus: response.data.data.organizerId.kycStatus,
              isVerified: response.data.data.organizerId.isVerified,
            })
          );

        }
      } catch (error: unknown) {
        const err = error instanceof Error ? error.message : 'Failed to fetch profile';
        toast.error(err);
      }
    };

    fetchProfile();
  }, [organizerId, organizer, dispatch]);

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    showError("Only image files (JPG, PNG, WEBP) are allowed");
    e.target.value = ""; // reset input
    return;
  }

  try {
    const uploadResult = await uploadImageToCloudinary(file, `organizers/${organizerId}/profile` );
    if (!uploadResult?.secureUrl) return;

    // First, get current form data
    const updatedForm = {
      ...profileFormData,
      profilePicture: uploadResult.secureUrl,
    };

    // Check if profile is complete before updating
    if (!updatedForm.organization || !updatedForm.bio) {
      showInfo("Complete your profile before updating the profile picture!");
      return;
    }

    // Update profile
    const result = await PROFILE_SERVICE.updateProfile(updatedForm.organizerId, updatedForm);
    if (result) {
      setProfileFormData(updatedForm);
      toast.success("Profile image updated");
    }
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Failed to upload profile image";
    toast.error(error);
  }
};


   function isProfileEmpty(profile: typeof profileData) {
     return !profile.organization && !profile.location && !profile.website && !profile.bio;
   }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
    
 const result = await PROFILE_SERVICE.updateProfile(profileFormData.organizerId, profileFormData);
  const organizerData = result.data?.data;
  

dispatch(setOrganizer({
 id: organizerData.id,
 name: organizerData.name,
 email: organizerData.email,
 role: organizerData.role,
 isVerified: organizerData.isVerified,
 kycStatus: organizerData.kycStatus,
 isKycResubmitted: organizerData.isKycResubmitted,

 // ⭐ IMPORTANT
 isProfileCompleted: organizerData.isProfileCompleted,
 isKycSubmitted: organizerData.isKycSubmitted,
 isStripeConnected: organizerData.isStripeConnected
}));
  
  

toast.success("Profile updated successfully");

if (!organizerData.isKycSubmitted) {
  setActiveTab("Documents");
}

           

      setProfileData(profileFormData);
      setIsEditing(false);
    } catch (err: unknown) {

    if (axios.isAxiosError(err)) {
    console.log("Axios error:", err);

    const errors = err.response?.data?.errors;
    const message = err.response?.data?.message;

    if (Array.isArray(errors) && errors.length > 0) {
      errors.forEach((e: string) => showError(e));
      return;
    }

    if (message) {
      showError(message);
      return;
    }

    showError("Something went wrong. Please try again.");
  } else if (err instanceof Error) {
    showError(err.message);
  } else {
    showError("An unexpected error occurred.");
  }
    
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      {/* Section Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Profile & Settings</h2>
        <p className="text-gray-500 text-sm">Manage your account settings and preferences</p>
      </div>
         {organizer?.role === "organizer" && (
  <OrganizerOnboardingProgress organizer={organizer}/>
)}

   {/* 🔥 ONBOARDING GUIDE BANNER */}
{/* 🔥 ONBOARDING GUIDE BANNER */}
{/* 🚀 SMART ONBOARDING GUIDE */}
{getOnboardingMessage() && (
  <div className="relative overflow-hidden rounded-xl mb-6">

    {/* animated gradient border */}
    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse opacity-20"></div>

    <div className={`
      relative flex items-center justify-between gap-6
      px-6 py-5 rounded-xl border backdrop-blur-md
      transition-all duration-500 shadow-md
      ${getOnboardingMessage()?.type === "warning" && "bg-yellow-50/80 border-yellow-200"}
      ${getOnboardingMessage()?.type === "info" && "bg-blue-50/80 border-blue-200"}
      ${getOnboardingMessage()?.type === "success" && "bg-green-50/80 border-green-200"}
    `}>

      {/* LEFT ICON + TEXT */}
      <div className="flex items-center gap-4">

        {/* animated icon */}
        <div className={`
          w-12 h-12 rounded-full flex items-center justify-center text-white text-xl shadow-lg
          ${getOnboardingMessage()?.type === "warning" && "bg-yellow-500 animate-bounce"}
          ${getOnboardingMessage()?.type === "info" && "bg-blue-500 animate-pulse"}
          ${getOnboardingMessage()?.type === "success" && "bg-green-500 animate-pulse"}
        `}>
          {getOnboardingMessage()?.type === "warning" && "⚠️"}
          {getOnboardingMessage()?.type === "info" && "📄"}
          {getOnboardingMessage()?.type === "success" && "🚀"}
        </div>

        {/* message */}
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
            Organizer Onboarding
          </span>

          <span className="text-base md:text-lg font-bold text-gray-800 leading-snug">
            {getOnboardingMessage()?.message}
          </span>
        </div>
      </div>

      {/* ACTION BUTTON */}
      {getOnboardingMessage()?.action && (
        <button
          onClick={() => {
            const msg = getOnboardingMessage();

            if (msg?.action === "Go to Profile") setActiveTab("Profile");
            if (msg?.action === "Upload Documents") setActiveTab("Documents");
            if (msg?.action === "View Plans") setActiveTab("Payments");
          }}
          className="group relative px-6 py-2.5 rounded-lg bg-black text-white text-sm font-semibold overflow-hidden transition-all"
        >
          <span className="relative z-10">{getOnboardingMessage()?.action}</span>

          {/* hover effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-all"></div>
        </button>
      )}
    </div>
  </div>
)}



      {/* Tabs */}
     <div className="flex border-b border-gray-200 mb-6 space-x-8">
        {tabs.map((tab) => {

        // 🔒 DOCUMENT TAB LOCK (until profile completed)
  if (tab === "Documents" && !organizer?.isProfileCompleted) {
    return (
      <button
        key={tab}
        disabled
        className="pb-2 border-b-2 text-gray-400 cursor-not-allowed"
      >
        {tab} 🔒
      </button>
    );
  }

  // 🔒 VERIFICATION TAB LOCK (until docs submitted)
  if (tab === "Verification" && !organizer?.isKycSubmitted) {
    return (
      <button
        key={tab}
        disabled
        className="pb-2 border-b-2 text-gray-400 cursor-not-allowed"
      >
        {tab} 🔒
      </button>
    );
  }

  // 🔒 PAYMENTS LOCK (until verified)
  if ( tab === "Payments" &&
  (organizer?.kycStatus !== KycStatus.APPROVED || !organizer?.isVerified)) {
    return (
      <button
        key={tab}
        disabled
        className="pb-2 border-b-2 text-gray-400 cursor-not-allowed"
      >
        {tab} 🔒
      </button>
    );
  }

  return (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`pb-2 border-b-2 ${
        activeTab === tab
          ? "border-blue-600 text-blue-600 font-medium"
          : "border-transparent text-gray-600 hover:text-blue-600"
      }`}
    >
      {tab}
    </button>
  );
        })}
      </div>

      {/* Profile Tab Content */}
      {activeTab === 'Profile' && (
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center space-x-5">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border border-gray-300 bg-gray-100">
                {profileFormData.profilePicture ? (
                  <Image
                    src={profileFormData.profilePicture}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl font-semibold">
                    {profileFormData?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="profileImageInput"
                  onChange={handleProfileImageChange}
                />
                <label
                  htmlFor="profileImageInput"
                  className="absolute bottom-0 right-0 bg-white border border-gray-300 rounded-full p-1 shadow cursor-pointer"
                >
                  <FaCamera className="text-gray-600 text-sm" />
                </label>
              </div>

              <div>
                <h3 className="text-lg font-semibold">{organizer?.name}</h3>
                <p className="text-sm text-gray-600">{profileData.organization}</p>
                <div className="flex items-center text-sm mt-1 space-x-2">
   {profileData?.isVerified ? (
    <span className="text-green-600 flex items-center font-medium">
      <FaCheckCircle className="mr-1" /> Verified Organizer
    </span>
  ) : (
    <span className="text-red-600 flex items-center font-medium">
      <FiXCircle className="mr-1" /> Verification Required
    </span>
  )}
  <span className="text-yellow-600 flex items-center font-medium">
    <FaStar className="ml-2 mr-1" /> Trust Score: <span className="ml-1">85</span>
  </span>
</div>
              </div>
            </div>

            <div className="mt-4 md:mt-0">
              <button
                onClick={() => {
                  setProfileFormData(profileData);
                  setIsEditing(true);
                }}
                className="px-4 py-2 border rounded text-blue-600 border-blue-600 hover:bg-blue-50 transition"
              >
                {isProfileEmpty(profileData) ? 'Complete Profile' : 'Edit Profile'}
              </button>
              {isProfileEmpty(profileData) && (
                <p className="text-sm text-red-500 mt-2">
                  Please complete your profile to continue using EventHub.
                </p>
              )}
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {editableFields.map((field) => (
              <div key={field}>
                <label className="block text-sm text-gray-600 mb-1">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={profileFormData[field]}
                  onChange={(e) =>
                    setProfileFormData((prev) => ({
                      ...prev,
                      [field]: e.target.value,
                    }))
                  }
                  readOnly={!isEditing}
                />
              </div>
            ))}

            {/* Bio */}
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Bio</label>
              <textarea
                className="w-full border rounded px-3 py-2"
                rows={3}
                value={profileFormData.bio}
                onChange={(e) =>
                  setProfileFormData((prev) => ({
                    ...prev,
                    bio: e.target.value,
                  }))
                }
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
                    setProfileFormData(profileData);
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

      {activeTab === 'Documents' && organizerId && (
        <div className="mt-4">
          <UploadDocumentSection organizerId={organizerId} />
        </div>
      )}

      {activeTab === 'Verification' && organizerId && (
        <div className="mt-4">
          <KycVerificationStatus organizerId={organizerId} overallStatus={profileData.kycStatus} />
        </div>
      )}
      {activeTab === 'Security' && organizerId && (
        <div className="mt-4">
          <SecurityTab organizerId={organizerId}  />
        </div>
      )}
      {activeTab === "Payments" && organizerId && organizer && (
   organizer.kycStatus !== KycStatus.APPROVED ? (
          <div className="p-6 text-center text-gray-500">
            <h3 className="text-lg font-semibold">Verification Pending</h3>
            <p className="text-sm mt-2">
              Your documents are under review. Stripe onboarding will unlock after admin approval.
            </p>
          </div>
        ) : (
          <OrganizerPaymentsSection
            stripeAccounts={stripeAccounts}
            organizerId={organizerId}
            organizerEmail={organizer.email}
          />
        )
)}

      {/* {activeTab === "Notifications" && (
        <div className="text-gray-500 text-sm py-10 text-center">
          {activeTab} section content goes here.
        </div>
      )} */}
    </div>
  );
}
