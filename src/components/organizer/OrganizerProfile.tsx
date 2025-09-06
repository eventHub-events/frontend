'use client';

import { FaCheckCircle, FaStar, FaCamera } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { profileService } from '@/services/organizer/profileService';
import { useAppSelector } from '@/redux/hooks';
import UploadDocumentSection from './UploadDocumentSection';
import { uploadImageToCloudinary } from '@/services/common/cloudinary';
import { toast } from 'react-toastify';

const tabs = ['Profile', 'Documents', 'Verification', 'Security', 'Notifications'];

export default function OrganizerProfile() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [isEditing, setIsEditing] = useState(false);
  const organizer = useAppSelector((state) => state.organizerAuth?.organizer);
  const organizerId = organizer?.id;

  const [profileFormData, setProfileFormData] = useState({
    organizerId: '',
    name: '',
    email: '',
    phone: '',
    organization: '',
    totalEarnings: '',
    location: '',
    website: '',
    bio: '',
    profilePicture: '',
  });

  const [profileData, setProfileData] = useState({ ...profileFormData });

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
    const fetchProfile = async () => {
      try {
        if (!organizerId) return;
        const response = await profileService.getProfile(organizerId);

        if (response?.data?.data) {
          const flatData = {
            organizerId,
            name: response.data.data.organizerId.name,
            email: response.data.data.organizerId.email,
            phone: response.data.data.organizerId.phone,
            organization: response.data.data.organization || '',
            totalEarnings: response.data.data.totalEarnings || '',
            location: response.data.data.location || '',
            website: response.data.data.website || '',
            bio: response.data.data.bio || '',
            profilePicture: response.data.data.profilePicture || '',
          };

          setProfileData(flatData);
          setProfileFormData(flatData);
        }
      } catch (error) {
        toast.error('Failed to fetch profile');
      }
    };

    fetchProfile();
  }, [organizerId]);

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await uploadImageToCloudinary(file);
      if (imageUrl) {
        setProfileFormData((prev) => {
      const updatedForm = {
        ...prev,
        profilePicture: imageUrl,
      };

      // Send to backend after setting state
      profileService
        .updateProfile(updatedForm.organizerId, updatedForm)
       

      return updatedForm;
    });
    setTimeout(()=>{

      toast.success('Profile image updated')
    },2000)
        console.log("profileFormData",profileFormData)
      
      }
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'Failed to upload profile image';
      toast.error(error);
    }
  };

  function isProfileEmpty(profile: typeof profileData) {
    return !profile.organization && !profile.location && !profile.website && !profile.bio;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (isProfileEmpty(profileFormData)) {
        await profileService.createProfile(profileFormData);
        toast.success('Profile created successfully');
      } else {
        await profileService.updateProfile(profileFormData.organizerId, profileFormData);
        toast.success('Profile updated successfully');
      }

      setProfileData(profileFormData);
      setIsEditing(false);
    } catch (err) {
      toast.error('Failed to save profile');
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

      {/* Profile Tab Content */}
      {activeTab === 'Profile' && (
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center space-x-5">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border border-gray-300 bg-gray-100">
                {profileFormData.profilePicture ? (
                  <img
                    src={profileFormData.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl font-semibold">
                    {organizer?.name?.charAt(0).toUpperCase() || 'U'}
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
                  Experienced event organizer specializing in tech conferences and workshops.
                </p>
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
                  Please complete your profile to continue using EventPro.
                </p>
              )}
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Inputs */}
            {[
              { label: 'Full Name', key: 'name' },
              { label: 'Phone', key: 'phone' },
              { label: 'Email', key: 'email' },
              { label: 'Location', key: 'location' },
              { label: 'Organization', key: 'organization' },
              { label: 'Website', key: 'website' },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm text-gray-600 mb-1">{field.label}</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={(profileFormData as any)[field.key]}
                  onChange={(e) =>
                    setProfileFormData((prev) => ({
                      ...prev,
                      [field.key]: e.target.value,
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

            {/* Save / Cancel */}
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

      {/* Documents Tab */}
      {activeTab === 'Documents' && organizerId && (
        <div className="mt-4">
          <UploadDocumentSection organizerId={organizerId} />
        </div>
      )}

      {/* Placeholder Tabs */}
      {activeTab !== 'Profile' && activeTab !== 'Documents' && (
        <div className="text-gray-500 text-sm py-10 text-center">
          {activeTab} section content goes here.
        </div>
      )}
    </div>
  );
}
