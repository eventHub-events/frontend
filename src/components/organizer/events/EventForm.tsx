"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { EventType, EventVisibility } from "@/enums/organizer/events";
import { EventCreationForm, EventFormValues } from "@/types/organizer/events";
import { categoryService } from "@/services/admin/categoryService";
import { useAppSelector } from "@/redux/hooks";
import { uploadImageToCloudinary } from "@/services/common/cloudinary";
import { showError, showSuccess, showWarning } from "@/utils/toastService";
import { useFieldArray } from "react-hook-form";
import { TicketStatus } from "@/enums/organizer/events";
import { ITicketTier } from "@/types/organizer/events";

import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { EVENT_SERVICE } from "@/services/organizer/eventServices";
import { PROFILE_SERVICE } from "@/services/organizer/profileService";

interface Category {
  id: string;
  name: string;
}
interface StripeAccount {
     organizerId : string;
  stripeAccountId : string;
  label : string;
  createdAt? :Date;
  
onboarded?: boolean;
  id? :string;
  isDefault? : boolean;
  isActive?: boolean
}
type FullEventForm = EventCreationForm & {
  tagsInput: string;
  startAmPm: string;
  endAmPm: string;
  tickets: ITicketTier[];
  saleStartDate?: string;
  saleEndDate?: string;
  waitingListEnabled?: boolean;
};

export default function EventFormPage() {
  const { eventId } = useParams();
  const isEditMode = !!eventId;

  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [mapUrl, setMapUrl] = useState<string>("");
  const [stripeAccounts, setStripeAccounts] = useState<StripeAccount[]>([]);
  const [pageLoading, setPageLoading] = useState(false);


  const organizer = useAppSelector((state) => state.organizerAuth?.organizer);
  const organizerId = organizer?.id;
  console.log("organizeeeerr", organizer)
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FullEventForm>({
    defaultValues: {
      tagsInput: "",
      featured: false,
      location: {
        venue: "",
        address: "",
        city: "",
        state: "",
        country: "",
      },
      totalCapacity: 1,

      visibility: EventVisibility.Public,
      tickets:[],
      saleStartDate:"",
   saleEndDate:"",
   waitingListEnabled:false
    },
  });
const { fields: ticketFields, append, remove } = useFieldArray({
  control,
  name: "tickets",
});
// useEffect(()=>{
//  if(ticketFields.length === 0){
//    append({
//      name:"",
//      price:0,
//      totalSeats:1,
//      benefits:[],
//      status: TicketStatus.Active,
//      isRefundable:false,
//      description:"",
//      maxTicketPerUser:1
//    });
//  }
// },[]);

   // Fetch stripe account //

   const formatTimeForInput = (time?: string) => {
  if (!time) return { time: "", ampm: "AM" };

  const [hourMin, ampm] = time.split(" ");
  const [hourRaw, minute] = hourMin.split(":").map(Number);
  let hour = hourRaw;

  if (ampm === "PM" && hour !== 12) {
    hour += 12;
  }

  if (ampm === "AM" && hour === 12) {
    hour = 0;
  }

  return {
    time: `${hour.toString().padStart(2, "0")}:${minute}`,
    ampm,
  };
};

 useEffect(() => {
  const fetchStripeAccounts = async () => {
    try {
      setPageLoading(true);
      const res = await PROFILE_SERVICE.getStripeAccounts(organizerId!);
      setStripeAccounts(res.data.data);
    } finally {
      setPageLoading(false);
    }
  };

  fetchStripeAccounts();
}, []);

  // 🔹 Fetch categories
  useEffect(() => {
      let ran = false;
     if (ran) return;
      ran = true;
     if(!organizer?.isVerified) {
       showWarning("you are not verified ,add Verification details");
       router.push("/organizer/profile")
       return
     }
   const fetchCategories = async () => {
  try {
    setPageLoading(true);
    const response = await categoryService.fetchAllCategories();
    setCategories(response.data.data);
  } finally {
    setPageLoading(false);
  }
};
    fetchCategories();
  }, [organizer?.isVerified,router]);

  // 🔹 If editing, fetch event details and populate form
  useEffect(() => {
    const fetchEvent = async () => {
      if (!isEditMode) return;
      try {
         setPageLoading(true);
        const response = await EVENT_SERVICE.fetchEventById(eventId as string);
        
const { event, tickets } = response.data.data;
        console.log("response is", response)

        // convert backend data to form-compatible structure
        const startFormatted = formatTimeForInput(event.startTime);
const endFormatted = formatTimeForInput(event.endTime);

        reset({
  ...event,

  startDate: event.startDate
    ? event.startDate.split("T")[0]
    : "",

  endDate: event.endDate
    ? event.endDate.split("T")[0]
    : "",

  tagsInput: event.tags?.join(", ") || "",

   startTime: startFormatted.time,
  startAmPm: startFormatted.ampm,

  endTime: endFormatted.time,
  endAmPm: endFormatted.ampm,

  tickets: tickets?.tickets || [],  

  saleStartDate: tickets?.saleStartDate
    ? tickets.saleStartDate.split("T")[0]
    : "",

  saleEndDate: tickets?.saleEndDate
    ? tickets.saleEndDate.split("T")[0]
    : "",

  waitingListEnabled: tickets?.waitingListEnabled ?? false,
});

        if (event.images?.length) {
          setUploadedImages(event.images);
          setImagePreviews(event.images);
        }

        const loc = event.location;
        if (loc?.address || loc?.city) {
          const query = encodeURIComponent(
            `${loc.venue} ${loc.address} ${loc.city} ${loc.state} ${loc.country}`
          );
          setMapUrl(`https://maps.google.com/maps?q=${query}&output=embed`);
        }
      } catch (err) {
        console.error("Failed to fetch event", err);
      }finally {
  setPageLoading(false);
}
    };

    fetchEvent();
  }, [isEditMode, eventId, reset]);
const todayStr = new Date().toISOString().split("T")[0];
  // 🔹 Handle image selection & preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArray = Array.from(files);
    const newPreviews = fileArray.map((file) => URL.createObjectURL(file));
    setImageFiles((prev) => [...prev, ...fileArray]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  // 🔹 Remove single image
  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 🔹 Upload images to Cloudinary
  const uploadImagesToCloudinary = async () => {
    if (imageFiles.length === 0) {
      showWarning("Please select images first");
      return;
    }

    setUploading(true);
    const uploadedUrls: string[] = [];
    try {
      for (const file of imageFiles) {
        const imageUrl = await uploadImageToCloudinary(file,  `events/${organizerId}/${Date.now()}`);
        if (imageUrl) uploadedUrls.push(imageUrl.secureUrl);
      }
      const allImages = [...uploadedImages, ...uploadedUrls];
      setUploadedImages(allImages);
      showSuccess("Images uploaded successfully!");
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // 🔹 Update Google Maps iframe
  const updateMap = () => {
    const location = watch("location");
    if (location.address || location.city) {
      const query = encodeURIComponent(
        `${location.venue} ${location.address} ${location.city} ${location.state} ${location.country}`
      );
      setMapUrl(`https://maps.google.com/maps?q=${query}&output=embed`);
    }
  };

  // 🔹 Handle Create / Update
  const onSubmit = async (data: EventFormValues) => {
    try {
      const startTime = data.startTime ? `${data.startTime} ${data.startAmPm}` : "";
      const endTime = data.endTime ? `${data.endTime} ${data.endAmPm}` : "";
      const selectedCategory = categories.find((c) => c.id === data.categoryId);
    const category = selectedCategory?.name || "";

      const payload: EventCreationForm = {
        ...data,
        organizerId: organizerId,
        stripeAccountId: data.stripeAccountId,
        organizerEmail:organizer?.email,
        images: uploadedImages,
        startTime,
        endTime,
        category,
        tags: data.tagsInput ? data.tagsInput.split(",").map((t: string) => t.trim()) : [],
        tickets: data.tickets,
        saleStartDate:data.saleStartDate,
 saleEndDate:data.saleEndDate,
 waitingListEnabled:data.waitingListEnabled
      };
      if (!data.tickets || data.tickets.length === 0) {
        showError("Please add at least one ticket tier");
        return;
      }
      // total ticket seats
      const totalTicketSeats = data.tickets.reduce(
        (sum, t) => sum + Number(t.totalSeats || 0),
        0
      );
      
      // capacity validation
      if (data.totalCapacity < 10) {
        showError("Event capacity must be at least 10 seats");
        return;
      }
      
      if (totalTicketSeats > data.totalCapacity) {
        showError(
          `Total ticket seats (${totalTicketSeats}) cannot exceed event capacity (${data.totalCapacity})`
        );
        return;
      }
      console.log("ppppp", payload);
      
      if (isEditMode) {
        const res = await EVENT_SERVICE.updateEvent(eventId as string, payload);
        if (res) {
          showSuccess("Event updated successfully");
          router.push("/organizer/events");
        }
      } else {
        const res = await EVENT_SERVICE.createEvent(payload);
        if (res) {
          showSuccess("Event created successfully");
          // router.push(`/organizer/events/${res.data.data.eventId}/tickets`);
          router.push("/organizer/events");
        }
      }
    } catch (err) {
     if (axios.isAxiosError(err)) {
        const errors = err.response?.data?.errors;
        if (Array.isArray(errors)) {
          errors.forEach((msg: string) => showError(msg));
        } else {
          showError(err.response?.data?.message || "Something went wrong");
        }
      }
    }
  };
 const watchedTickets = watch("tickets");
const watchedCapacity = watch("totalCapacity");

const totalSeats =
  watchedTickets?.reduce(
    (sum, t) => sum + Number(t?.totalSeats || 0),
    0
  ) || 0;

  // 🔹 JSX (unchanged styling)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
       {pageLoading && (
  <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="flex flex-col items-center space-y-4">
      
      {/* Animated Gradient Spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-purple-600 animate-spin"></div>
        <div className="absolute inset-2 rounded-full bg-white"></div>
      </div>

      <p className="text-gray-700 font-medium animate-pulse">
        Loading event details...
      </p>
    </div>
  </div>
)}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isEditMode ? "Edit Event" : "Create New Event"}
            </h1>
            <p className="text-gray-600">
              {isEditMode
                ? "Update your existing event details below"
                : "Fill in the details below to create your amazing event"}
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
              
            {/* Basic Information Section */}
            <section className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Event Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("title", { required: true })}
                    placeholder="Enter event title"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-600">Title is required</p>}
                </div>

                {/* Event Type & Category */}
            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("type", { required: true })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Type</option>
                    {Object.values(EventType).map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("categoryId", { required: true })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                 {/* 🔹 Description Field */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register("description", { required: true })}
                    placeholder="Enter event description..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">Description is required</p>
                  )}
                </div>
                 

              </div>
            </section>

            {/* Location Section */}
            <section className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Location Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {(["venue", "address", "city", "state", "country"] as const).map((field) => (
                  <div key={field} className={field === "address" ? "md:col-span-2" : ""}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type="text"
                      {...register(`location.${field}`)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      onBlur={updateMap}
                    />
                  </div>
                ))}
              </div>

              {mapUrl && (
                <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-300">
                  <iframe src={mapUrl} className="w-full h-full" loading="lazy" />
                </div>
              )}
            </section>

            {/* Date & Time Section */}
            <section className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Date & Time</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                 <input
  type="date"
  {...register("startDate", {
    required: "Start date is required",
    validate: (value) => {
      if (!value) return "Start date is required";

      const today = new Date();
      today.setHours(0,0,0,0);

      const selected = new Date(value);

      if (isNaN(selected.getTime())) {
        return "Invalid start date";
      }

      if (selected < today) {
        return "Start date cannot be in the past";
      }

      return true;
    },
  })}
  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
  min={todayStr}
/>

{errors.startDate && (
  <p className="text-sm text-red-600 mt-1">
    {errors.startDate.message as string}
  </p>
)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
  type="date"
  {...register("endDate", {
    required: "End date is required",
    validate: (value) => {
      if (!value) return "End date is required";

      const today = new Date();
      today.setHours(0,0,0,0);

      const end = new Date(value);
      const start = new Date(watch("startDate"));

      if (isNaN(end.getTime())) {
        return "Invalid end date";
      }

      if (end < today) {
        return "End date cannot be in the past";
      }

      if (start && end < start) {
        return "End date must be after start date";
      }

      return true;
    },
  })}
  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
  min={todayStr}
/>

{errors.endDate && (
  <p className="text-sm text-red-600 mt-1">
    {errors.endDate.message as string}
  </p>
)}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                  <div className="flex gap-2">
                    <input
                      type="time"
                      {...register("startTime")}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    <select
                      {...register("startAmPm")}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option>AM</option>
                      <option>PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                  <div className="flex gap-2">
                    <input
                      type="time"
                      {...register("endTime")}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    <select
                      {...register("endAmPm")}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option>AM</option>
                      <option>PM</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* Capacity & Settings */}
            <section className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Capacity & Settings</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Capacity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
  {...register("totalCapacity", {
    required: "Total capacity is required",
    min: {
      value: 10,
      message: "Minimum capacity should be at least 10 seats",
    },
    validate: (value) => {
      if (value < 0) return "Capacity cannot be negative";
      return true;
    },
  })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="100"
                  />
                  {errors.totalCapacity && (
  <p className="text-sm text-red-600 mt-1">
    {errors.totalCapacity.message as string}
  </p>
)}
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("featured")}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Featured Event</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                  <select
                    {...register("visibility")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    {Object.values(EventVisibility).map((v) => (
                      <option key={v} value={v}>
                        {v.charAt(0).toUpperCase() + v.slice(1).replace("-", " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Payout Account */}
<div className="md:col-span-3">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Payout Account <span className="text-red-500">*</span>
  </label>

  <select
    {...register("stripeAccountId", { required: true })}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg
               focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  >
    <option value="">Select payout account</option>

    {stripeAccounts.map((acc) => (
      <option key={acc.id} value={acc.id}>
        {acc.label} {acc.isDefault ? "(Default)" : ""}
      </option>
    ))}
  </select>

  {errors.stripeAccountId && (
    <p className="text-sm text-red-600 mt-1">
      Please select a payout account
    </p>
  )}
</div>

            </section>

            {/* Tags & Images */}
            <section className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <input
                    type="text"
                    {...register("tagsInput")}
                    placeholder="music, live, concert (comma separated)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200"
                  />

                  {imagePreviews.length > 0 && (
                    <div className="flex gap-3 mt-3 overflow-x-auto pb-2">
                      {imagePreviews.map((src, idx) => (
                        <div key={idx} className="relative w-24 h-24">
                                         <Image
  src={src}
  alt={`preview-${idx}`}
  width={300}          // choose suitable size
  height={300}
  className="w-full h-full object-cover rounded-lg border border-gray-300"
/>

                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={uploadImagesToCloudinary}
                    disabled={uploading || imageFiles.length === 0}
                    className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center space-x-2"
                  >
                    {uploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <span>Upload Images</span>
                    )}
                  </button>
                </div>
              </div>
            </section>
             {/* 🎟 Ticket Section */}
{/* 🎟 Ticket Configuration */}
<section className="bg-gray-50 rounded-xl p-6">
  <h2 className="text-xl font-semibold mb-6">Ticket Configuration</h2>

  {/* Add ticket */}
  <div className="flex justify-between mb-4">
    <h3 className="font-semibold">Ticket Tiers</h3>
    <button
      type="button"
      onClick={() =>
        append({
          name: "",
          price: 0,
          totalSeats: 1,
          benefits: [],
          status: TicketStatus.Active,
          isRefundable: false,
          description: "",
          maxTicketPerUser: 1,
        })
      }
      className="bg-green-600 text-white px-4 py-2 rounded"
    >
      + Add Ticket
    </button>
    {/* 🔥 Live Seat Counter */}
<div className="mb-4">
  <p className="text-sm text-gray-600">
    Total Ticket Seats:{" "}
    <span
      className={
        totalSeats > watchedCapacity
          ? "text-red-600 font-semibold"
          : "font-semibold"
      }
    >
      {totalSeats}
    </span>{" "}
    / {watchedCapacity || 0}
  </p>

  {totalSeats > watchedCapacity && (
    <p className="text-red-600 text-sm mt-1">
      Ticket seats exceed event capacity
    </p>
  )}
</div>
  </div>

  {ticketFields.map((ticket, index) => (
    <div key={ticket.id} className="border p-4 mb-6 rounded-lg bg-white relative">
      
      <button
        type="button"
        onClick={() => remove(index)}
        className="absolute top-2 right-2 text-red-500"
      >
        ✕
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Ticket Name</label>
          <input
            {...register(`tickets.${index}.name` as const,{required:true})}
            className="w-full border p-2 rounded"
            placeholder="VIP / General"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Price</label>
          <input
            type="number"
            {...register(`tickets.${index}.price` as const,{required:true,min:0})}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Total Seats</label>
          <input
            type="number"
            {...register(`tickets.${index}.totalSeats` as const,{required:true,min:1})}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Max/User</label>
          <input
            type="number"
            {...register(`tickets.${index}.maxTicketPerUser` as const)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium">Benefits</label>
          <input
            {...register(`tickets.${index}.benefits` as const)}
            className="w-full border p-2 rounded"
            placeholder="Free drinks, backstage pass"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium">Description</label>
          <input
            {...register(`tickets.${index}.description` as const)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Status</label>
          <select
            {...register(`tickets.${index}.status` as const)}
            className="w-full border p-2 rounded"
          >
            {Object.values(TicketStatus).map((s)=>(
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 mt-6">
          <input type="checkbox" {...register(`tickets.${index}.isRefundable` as const)} />
          Refundable
        </label>
      </div>
    </div>
  ))}

  {/* SALE SETTINGS */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
    <div>
      <label className="text-sm font-medium">Sale Start Date</label>
      <input
  type="date"
  {...register("saleStartDate", {
    required: "Sale start date is required",
    validate: (value) => {
      if (!value) return "Sale start date is required";

      const today = new Date();
      today.setHours(0,0,0,0);

      const saleStart = new Date(value);
      const eventStart = new Date(watch("startDate") || "");
      const eventEnd = new Date(watch("endDate") || "");

      if (isNaN(saleStart.getTime())) {
        return "Invalid sale start date";
      }

      if (saleStart < today) {
        return "Sale start date cannot be in the past";
      }

      if (eventStart && saleStart > eventStart) {
        return "Sale start must be before or on event start date";
      }

      if (eventEnd && saleStart > eventEnd) {
        return "Sale start cannot be after event end date";
      }

      return true;
    },
  })}
  className="w-full border p-2 rounded"
  min={todayStr}
/>

{errors.saleStartDate && (
  <p className="text-sm text-red-600 mt-1">
    {errors.saleStartDate.message as string}
  </p>
)}
    </div>

    <div>
      <label className="text-sm font-medium">Sale End Date</label>
     <input
  type="date"
  {...register("saleEndDate", {
    required: "Sale end date is required",
    validate: (value) => {
      if (!value) return "Sale end date is required";

      const today = new Date();
      today.setHours(0,0,0,0);

      const saleEnd = new Date(value);
      const saleStart = new Date(watch("saleStartDate") || "");
      const eventStart = new Date(watch("startDate") || "");
      const eventEnd = new Date(watch("endDate") || "");

      if (isNaN(saleEnd.getTime())) {
        return "Invalid sale end date";
      }

      if (saleEnd < today) {
        return "Sale end date cannot be in the past";
      }

      if (saleStart && saleEnd < saleStart) {
        return "Sale end date must be after sale start date";
      }

      if (eventStart && saleEnd > eventStart) {
        return "Sale end must be on or before event start date";
      }

      if (eventEnd && saleEnd > eventEnd) {
        return "Sale end cannot be after event end date";
      }

      return true;
    },
  })}
  className="w-full border p-2 rounded"
  min={todayStr}
/>

{errors.saleEndDate && (
  <p className="text-sm text-red-600 mt-1">
    {errors.saleEndDate.message as string}
  </p>
)}
    </div>

    <div className="flex items-center mt-6">
      <label className="flex items-center gap-2">
        <input type="checkbox" {...register("waitingListEnabled")} />
        Enable Waiting List
      </label>
    </div>
  </div>
</section>
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isSubmitting
                  ? isEditMode
                    ? "Updating Event..."
                    : "Creating Event..."
                  : isEditMode
                  ? "Update Event"
                  : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}



