"use client";

import React, { useEffect, useState } from "react";
import {
  FaUser, FaLock, FaHeart, FaTicketAlt, FaCreditCard, FaBell, FaCog,
   FaUpload, FaEdit, FaCheck, FaTimes
} from "react-icons/fa";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import clsx from "clsx";
import { useAppSelector } from "@/redux/hooks";
import { userProfileService } from "@/services/user/userProfileService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userProfileSchema, UserProfileFormData } from "@/validation/user/schemas/userProfileSchema";
import { uploadImageToCloudinary } from "@/services/common/cloudinary";
import { Address, FormFieldName, UserProfileData } from "@/types/user/profile/profileUpdateType";
import { SecurityTab } from "./component/Security";


interface Booking {
  id: string;
  title: string;
  date: string;
  status: string;
}

const dummyBookings: Booking[] = [
  { id: "1", title: "Music Concert", date: "2025-10-15", status: "Upcoming" },
  { id: "2", title: "Tech Conference", date: "2025-09-20", status: "Attended" },
  { id: "3", title: "Art Exhibition", date: "2025-08-05", status: "Cancelled" },
];


const UserProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
 
  const [twoFA, setTwoFA] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    // setValue,
    watch,
    reset,
    trigger
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    mode: "onChange",
    reValidateMode: "onChange"
  });

  const userData = useAppSelector((state) => state.auth.user);
  const userId = userData?.id;

  const formValues = watch();

  useEffect(() => {
    if (userData) {
      const initialUser: UserProfileData = {
        name: userData.name || "",
        email: userData.email || "",
        phone: "",
        address: {
          line1: "",
          line2: "",
          city: "",
          state: "",
          country: "",
          pin: "",
        },
        image: "/default-user.png",
        memberSince: new Date().toLocaleString("default", { month: "long", year: "numeric" }),
        favorites: [],
        profileId: "",
        twoFAEnabled: false,
      };
      setUser(initialUser);
      reset({
        name: initialUser.name,
        phone: initialUser.phone,
        address: initialUser.address
      });
    }
  }, [userData, reset]);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const result = await userProfileService.fetchProfile(userId);
        const profile = result.data.data;
        console.log("rewsult", result)
       

        setUser((prev) => {
          const updated = {
            ...prev!,
            phone: profile?.phone || prev?.phone,
            address: profile?.address || prev?.address,
            image: profile?.image || prev?.image || "/default-user.png",
            memberSince: new Date(profile?.memberSince || Date.now()).toLocaleString("default", {
              month: "long",
              year: "numeric",
            }),
            favorites: profile?.favorites || [],
            profileId: profile?.profileId || "",
            twoFAEnabled: profile?.twoFAEnabled || false,
          };
          
          reset({
            name: updated.name,
            phone: updated.phone,
            address: updated.address
          });
          setTwoFA(profile?.twoFAEnabled || false);
        
          return updated;
        });
      } catch (err) {
        console.error(err);
        console.log(err)
        toast.error("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, reset]);

  useEffect(() => {
    if (activeTab !== "profile" && editMode) {
      setEditMode(false);
      if (user) {
        reset({
          name: user.name,
          phone: user.phone,
          address: user.address
        });
      }
    }
  }, [activeTab, editMode, user, reset]);

  const profileCompletion = () => {
    if (!user) return 0;
    const total = 6;
    let filled = 0;
    if (user.name) filled++;
    if (user.email) filled++;
    if (user.phone) filled++;
    if (user.address?.line1) filled++;
    if (user.address?.city) filled++;
    if (user.address?.state) filled++;
    return Math.round((filled / total) * 100);
  };

  const handleSave = async (data: UserProfileFormData) => {
    if (!user) return;
    
    const isValid = await trigger();
    if (!isValid) {
      toast.error("Please fix the validation errors before saving");
      return;
    }

    try {
      const updatedUser = {
        ...user,
        name: data.name,
        phone: data.phone,
        address: data.address
      };
      const userData = {
          name: updatedUser.name,
          phone: updatedUser.phone,
          userId
      }
      const profileData = data.address;
      console.log("user", userData)
      console.log("profile", profileData)
      console.log("updatedUser", updatedUser)
      await userProfileService.updateProfile(user.profileId!, {user: userData, profile: {address:profileData}});
      setUser(updatedUser);
      toast.success("Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };
   const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !userId) return;
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await uploadImageToCloudinary(file);
      if (!imageUrl) return;
      console.log("image url", imageUrl)
      const updatedUser = { ...user, image: imageUrl };
      setUser(updatedUser);
          console.log("userId", userId)
           const userData = {
          name: updatedUser.name,
          phone: updatedUser.phone,
          userId
      }
      // Update backend profile image only
      await userProfileService.updateProfile(user.profileId, { user:userData, profile: { image: imageUrl } });
     
      toast.success("Profile image updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image");
    }
  };


  const handleCancel = () => {
    if (user) {
      reset({
        name: user.name,
        phone: user.phone,
        address: user.address
      });
    }
    setEditMode(false);
  };

 

  // ✅ Updated type-safe getErrorMessage
  const getErrorMessage = (fieldName: FormFieldName): string | undefined => {
    const fieldPath = fieldName.split('.') as (keyof UserProfileFormData | keyof Address)[];

    if (fieldPath.length === 1) {
      const fieldError = errors[fieldPath[0] as keyof UserProfileFormData];
      return fieldError?.message as string | undefined;
    } else if (fieldPath.length === 2 && fieldPath[0] === "address") {
      const addressErrors = errors.address as
        | { [K in keyof Address]?: { message: string } }
        | undefined;
      return addressErrors?.[fieldPath[1] as keyof Address]?.message;
    }

    return undefined;
  };

  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center space-y-4">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full"></div>
        <div className="h-4 bg-gray-200 rounded w-48"></div>
        <div className="h-3 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
  );

  const tabs = [
    { key: "profile", label: "Profile", icon: FaUser },
    { key: "security", label: "Security", icon: FaLock },
    { key: "bookings", label: "Bookings", icon: FaTicketAlt },
    { key: "favorites", label: "Favorites", icon: FaHeart },
    { key: "payments", label: "Payments", icon: FaCreditCard },
    { key: "notifications", label: "Notifications", icon: FaBell },
    { key: "settings", label: "Settings", icon: FaCog },
  ];

  const formFieldsWithNames = [
    { label: "Full Name", name: "name" as FormFieldName, type: "text" },
    { label: "Phone", name: "phone" as FormFieldName, type: "text" },
    { label: "Address Line 1", name: "address.line1" as FormFieldName, type: "text" },
    { label: "Address Line 2", name: "address.line2" as FormFieldName, type: "text" },
    { label: "City", name: "address.city" as FormFieldName, type: "text" },
    { label: "State", name: "address.state" as FormFieldName, type: "text" },
    { label: "Country", name: "address.country" as FormFieldName, type: "text" },
    { label: "PIN Code", name: "address.pin" as FormFieldName, type: "text" },
  ];

  const currentDraftUser: UserProfileData = {
    ...user,
    name: formValues.name || user.name,
    phone: formValues.phone || user.phone,
    address: {
      ...user.address,
      ...formValues.address
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <Toaster 
        position="top-center"
        toastOptions={{
          className: "bg-white/90 backdrop-blur-md border border-gray-200",
          style: {
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(229, 231, 235, 0.8)',
          },
        }}
      />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-soft p-8 border border-white/60">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6 flex-1">
              <div className="relative group">
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden shadow-lg border-4 border-white ring-2 ring-purple-500/20">
                  <Image
                    src={currentDraftUser.image}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                  { activeTab  && (
                    <>
                       <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        onChange={handleImageChange}
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <FaUpload className="text-white text-xl" />
                      </div>
                    </>
                  )}
                </div>
                {editMode && activeTab === "profile" && (
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-full text-white shadow-lg">
                    <FaUpload className="text-sm" />
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {currentDraftUser.name}
                  </h1>
                  <p className="text-gray-600 mt-1">{currentDraftUser.email}</p>
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    <span>Member since</span>
                    <span className="font-medium">{currentDraftUser.memberSince}</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Profile Completion</span>
                    <span className="font-semibold text-purple-600">{profileCompletion()}%</span>
                  </div>
                  <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${profileCompletion()}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Profile Button - Only show on Profile tab */}
            {activeTab === "profile" && (
              <div className="flex gap-3">
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <FaEdit className="text-sm" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={handleSubmit(handleSave)}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <FaCheck className="text-sm" />
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-500 to-slate-500 text-white rounded-xl hover:from-gray-600 hover:to-slate-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <FaTimes className="text-sm" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-3 justify-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={clsx(
                  "flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-md border backdrop-blur-sm",
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg scale-105 border-transparent"
                    : "bg-white/80 text-gray-600 hover:bg-white hover:shadow-lg border-white/60 hover:-translate-y-0.5"
                )}
              >
                <Icon className="text-lg" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-soft border border-white/60 transition-all duration-300">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <form onSubmit={handleSubmit(handleSave)} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Email Field (disabled) */}
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    disabled={true}
                    value={user.email}
                    className="w-full px-4 py-3 rounded-xl border bg-gray-50/80 border-gray-200 text-gray-500 cursor-not-allowed"
                  />
                </div>

                {/* Form fields with validation */}
                {formFieldsWithNames.map((field) => (
                  <div key={field.label} className="relative group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      disabled={!editMode}
                      {...register(field.name)}
                      className={clsx(
                        "w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2",
                        editMode 
                          ? getErrorMessage(field.name)
                            ? "border-red-300 focus:border-red-400 focus:ring-red-200 shadow-sm"
                            : "bg-white border-gray-300 focus:border-purple-400 focus:ring-purple-200 shadow-sm hover:border-gray-400"
                          : "bg-gray-50/80 border-gray-200 text-gray-500 cursor-not-allowed"
                      )}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      onBlur={() => trigger(field.name)}
                    />
                    {editMode && getErrorMessage(field.name) && (
                      <p className="text-red-500 text-sm mt-1">
                        {getErrorMessage(field.name)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </form>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
          
              <SecurityTab twoFA={twoFA} setTwoFA={setTwoFA} userId={userId!} />

          )}

          {/* Bookings Tab */}
          {activeTab === "bookings" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Your Bookings
              </h2>
              <div className="space-y-4">
                {dummyBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-white to-gray-50/80 border border-gray-200/60 hover:border-purple-200 hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="space-y-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                        {booking.title}
                      </h3>
                      <p className="text-sm text-gray-500">{booking.date}</p>
                    </div>
                    <span className={clsx(
                      "px-4 py-2 rounded-full text-sm font-medium capitalize",
                      booking.status === "Upcoming" && "bg-blue-100 text-blue-700",
                      booking.status === "Attended" && "bg-green-100 text-green-700",
                      booking.status === "Cancelled" && "bg-red-100 text-red-700"
                    )}>
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Tabs Placeholder */}
          {!["profile", "security", "bookings"].includes(activeTab) && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-center">
                {React.createElement(tabs.find(tab => tab.key === activeTab)?.icon || FaUser, {
                  className: "text-3xl text-purple-500"
                })}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {tabs.find(tab => tab.key === activeTab)?.label}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                This section is coming soon. We are working on bringing you the best experience.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .shadow-soft {
          box-shadow: 0 4px 24px -2px rgba(0, 0, 0, 0.08), 0 2px 8px -2px rgba(0, 0, 0, 0.06);
        }
        .shadow-glass {
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          backdrop-filter: blur(8px);
        }
      `}</style>
    </div>
  );
};

export default UserProfile;
