"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, Lock, Unlock } from "lucide-react";
import { motion } from "framer-motion";
import CategoryModal, { CategoryFormData } from "./CategoryModal";
import { categoryService } from "@/services/admin/categoryService";
import { showError, showSuccess } from "@/utils/toastService";
import { AxiosError } from "axios";
import { ValidationError } from "yup";
import { toast } from "react-toastify";


export interface Category {
  id: string;
  name: string;
  description: string;
  tags: string[];
  color: string;
  isBlocked: boolean;
}

export default function CategoriesTagsManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
   const [categoryName,  setCategoryName]=  useState([""]);

    useEffect(() => {
       const fetchCategories = async () => {
          const result=  await categoryService.fetchAllCategories();
          console.log("cat", result)
           setCategories(result.data.data)
           const names = result.data.data?.map((cat: Category) => cat.name)
           setCategoryName(names)
       }
       fetchCategories()
    },[isModalOpen])
  // ---------------- HANDLERS ----------------
  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (data: CategoryFormData) => {

    try{ 
             
        

        if (selectedCategory) {
          const existing = categoryName.filter((name) => name!== selectedCategory.name)
           if(existing.includes(data.name)){
              showError("Category  already  exists");
              return
           }
      // Update existing
      const categoryId= selectedCategory.id;
  const result = await categoryService.editCategory(categoryId, data);

   if(result){
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === selectedCategory.id ? { ...cat, ...data } : cat
        )

        
      );
       showSuccess("Category Edited successfully")
   }
     
    } else {
       if(categoryName.includes(data.name)){
            showError("Category  already  exists ")
            return
        }
     const result =  await categoryService.createCategory(data)
      if(result){
         showSuccess("category  added successfully")
         setCategories(prev=> [...prev, result.data.data]);
      }
      
    }
    
    }catch(err){
     const axiosError = err as AxiosError<{  errors: string[] }>;

    if (axiosError.response?.data?.errors) {
      // Show all messages joined
      const allErrors = axiosError.response.data.errors;
       const delay = 1500;
        allErrors.forEach((message, index) => {
      setTimeout(() => {
        toast.error(message);
      }, index * delay);
    });
 
    } else if (axiosError.request) {
      toast.error("No response from server. Please try again.");
    } else {
      toast.error(axiosError.message);
    }

    }finally {
        setIsModalOpen(false);
    }
   
  };

  const handleDeleteCategory = async (id: string) => {
    try{
       
    const  result = await categoryService.deleteCategory(id);
    if(result){
       showSuccess("Category  deleted successfully");
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    }
    }catch(err){
      console.log(err)
    }

   
  };

  const handleBlockToggle =  async (id: string) => {

    try{
       const category = categories.find((c) => c.id === id)
        if(category) {
          const result =  await categoryService.editCategory(id,{isBlocked: !category.isBlocked});
          if(result){
            
             const status = category.isBlocked ? "Unblocked":"Blocked";
             showSuccess(`category ${status} successfully`);
             
        setCategories((prev) =>
        prev.map((cat) =>
        cat.id === id ? { ...cat, isBlocked: !cat.isBlocked } : cat
      )
    );
          }
        }


    }catch(err) {
         const axiosError = err as AxiosError<{ errors: ValidationError[] }>;

    if (axiosError.response?.data?.errors) {
      // Show all messages joined
      const allMessages = axiosError.response.data.errors.join(", ");
   
      toast.error(allMessages);
    } else if (axiosError.request) {
      toast.error("No response from server. Please try again.");
    } else {
      toast.error(axiosError.message);
    }
    }


   
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // ---------------- RENDER ----------------
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">
          Categories & Tags Management
        </h2>
        <Button
          onClick={handleAddCategory}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold"
        >
          + Add Category
        </Button>
      </div>

      <p className="text-gray-500">
        Organize events with categories and manage associated tags
      </p>

      {/* Search */}
      <Input
        placeholder="Search categories..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((cat) => (
          <motion.div
            key={cat.id}
            whileHover={{ scale: 1.02 }}
            className="rounded-2xl shadow-md bg-white border-t-4"
            style={{ borderTopColor: cat.color }}
          >
            <Card className="border-none">
              <CardContent className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      {cat.name}
                    </h3>
                    <p className="text-gray-500 text-sm">{cat.description}</p>
                  </div>

                  <div className="flex gap-3">
                    <Edit
                      className="text-blue-500 cursor-pointer"
                      size={18}
                      onClick={() => handleEditCategory(cat)}
                    />
                    <Trash2
                      className="text-red-500 cursor-pointer"
                      size={18}
                      onClick={() => handleDeleteCategory(cat.id)}
                    />
                    {cat.isBlocked ? (
                      <Unlock
                        className="text-green-500 cursor-pointer"
                        size={18}
                        onClick={() => handleBlockToggle(cat.id)}
                      />
                    ) : (
                      <Lock
                        className="text-gray-500 cursor-pointer"
                        size={18}
                        onClick={() => handleBlockToggle(cat.id)}
                      />
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {cat.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
        <Card className="text-center p-4">
          <h4 className="font-semibold">Total Categories</h4>
          <p className="text-2xl">{categories.length}</p>
        </Card>
        <Card className="text-center p-4">
          <h4 className="font-semibold">Blocked Categories</h4>
          <p className="text-2xl">
            {categories.filter((c) => c.isBlocked).length}
          </p>
        </Card>
        <Card className="text-center p-4">
          <h4 className="font-semibold">Active Categories</h4>
          <p className="text-2xl">
            {categories.filter((c) => !c.isBlocked).length}
          </p>
        </Card>
        <Card className="text-center p-4">
          <h4 className="font-semibold">Unique Tags</h4>
          <p className="text-2xl">
            {
              new Set(categories.flatMap((c) => c.tags.map((t) => t.toLowerCase())))
                .size
            }
          </p>
        </Card>
      </div>

      {/* Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={
          selectedCategory
            ? {
                name: selectedCategory.name,
                description: selectedCategory.description,
                color: selectedCategory.color,
                tags: selectedCategory.tags,
              }
            : undefined
        }
      />
    </div>
  );
}
