"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { EventType, EventVisibility } from "@/enums/organizer/events";
import { EventCreationForm } from "@/types/organizer/events";

import { categoryService } from "@/services/admin/categoryService";
import { useAppSelector } from "@/redux/hooks";
import { uploadImageToCloudinary } from "@/services/common/cloudinary";
import { showSuccess, showWarning } from "@/utils/toastService";
import { eventService } from "@/services/organizer/eventServices";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
}

export default function AddEventPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const [mapUrl, setMapUrl] = useState<string>("");
  const organizer = useAppSelector((state) => state.organizerAuth?.organizer);
  const organizerId = organizer?.id;
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EventCreationForm & { tagsInput: string; startAmPm: string; endAmPm: string }>({
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
    },
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await categoryService.fetchAllCategories();
      setCategories(response.data.data);
    };
    fetchCategories();
  }, []);

  // Handle image selection & preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArray = Array.from(files);
    const newPreviews = fileArray.map((file) => URL.createObjectURL(file));
    setImageFiles((prev) => [...prev, ...fileArray]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  // remove single image
  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Upload images to Cloudinary
  const uploadImagesToCloudinary = async () => {
    if (imageFiles.length === 0) {
      showWarning("Please select images first");
      return;
    }

    setUploading(true);
    const uploadedUrls: string[] = [];
    try {
      for (const file of imageFiles) {
        const imageUrl = await uploadImageToCloudinary(file);
        if (!imageUrl) return;
        uploadedUrls.push(imageUrl);
      }
      setUploadedImages(uploadedUrls);
      showSuccess("Images uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Update Google Maps iframe
  const updateMap = () => {
    const location = watch("location");
    if (location.address || location.city) {
      const query = encodeURIComponent(
        `${location.venue} ${location.address} ${location.city} ${location.state} ${location.country}`
      );
      setMapUrl(`https://maps.google.com/maps?q=${query}&output=embed`);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const startTime = data.startTime ? `${data.startTime} ${data.startAmPm}` : "";
      const endTime = data.endTime ? `${data.endTime} ${data.endAmPm}` : "";

      const payload: EventCreationForm = {
        ...data,
        organizerId: organizerId,
        images: uploadedImages,
        startTime,
        endTime,
        tags: data.tagsInput ? data.tagsInput.split(",").map((t: string) => t.trim()) : [],
      };

      const response = await eventService.createEvent(payload);
      if (response) {
        showSuccess("Event created successfully");
        router.push("/organizer/events");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Event</h1>
            <p className="text-gray-600">Fill in the details below to create your amazing event</p>
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
                    {...register("startDate")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    {...register("endDate")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
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
                    {...register("totalCapacity", { required: true, min: 1 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="100"
                  />
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
                          <img
                            src={src}
                            alt={`preview-${idx}`}
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

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isSubmitting ? "Creating Event..." : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
