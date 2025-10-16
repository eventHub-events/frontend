" use client"

import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

interface CategoryModalProps {
  isOpen : boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => void;
  initialData?: CategoryFormData;
}

export interface CategoryFormData {
  name: string;
  description: string;
  color: string;
  tags: string[]
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,

}) => {
   
const[form, setForm]  = useState<CategoryFormData>({
  name: "",
  description: "",
  color: "#3B82F6",
  tags: []
});

useEffect(() => {
  if(initialData) {
    setForm(initialData)
  }
},[initialData]);

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
   const {name, value}  =  e.target;

   setForm((prev) => ({...prev, [name]: value}));

};

const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) =>  {
  const tagsArray = e.target.value.split(",").map((tag) => tag.trim());
  setForm((prev)=> ({...prev, tags: tagsArray}));

};
const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
}

if(!isOpen)  return null;

return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">
          {initialData ? "Edit Category" : "Create New Category"}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Category Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g., Technology"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Brief description of this category"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Color</label>
            <input
              type="color"
              name="color"
              value={form.color}
              onChange={handleChange}
              className="w-16 h-10 p-0 border-0 rounded-lg cursor-pointer"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Tags</label>
            <input
              type="text"
              value={form.tags.join(", ")}
              onChange={handleTagsChange}
              placeholder="Comma-separated tags (e.g., Tech, AI)"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <p className="text-xs text-gray-400 mt-1">
              Separate multiple tags with commas
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              {initialData ? "Update Category" : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
)

}
export default CategoryModal;