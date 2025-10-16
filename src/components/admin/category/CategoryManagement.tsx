"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, Lock, Unlock } from "lucide-react";
import { motion } from "framer-motion";
import CategoryModal, { CategoryFormData } from "./CategoryModal";

// ---------------- DUMMY DATA ----------------
const dummyCategories = [
  {
    id: "7",
    name: "Technology",
    description: "Tech conferences, workshops, and innovation events",
    color: "#3B82F6",
    tags: ["Tech", "Innovation", "Software"],
    isBlocked: false,
  },
  {
    id: "56",
    name: "Business",
    description:
      "Business conferences, networking, and professional development",
    color: "#22C55E",
    tags: ["Business", "Networking", "Leadership"],
    isBlocked: false,
  },
  {
    id: "4",
    name: "Arts & Culture",
    description: "Art exhibitions, cultural events, and creative workshops",
    color: "#EAB308",
    tags: ["Art", "Culture", "Music"],
    isBlocked: false,
  },
  {
    id: "3",
    name: "Health & Wellness",
    description: "Health seminars, wellness workshops, and fitness events",
    color: "#EF4444",
    tags: ["Health", "Wellness", "Fitness"],
    isBlocked: false,
  },
  {
    id: "2",
    name: "Education",
    description:
      "Educational workshops, training sessions, and academic events",
    color: "#A855F7",
    tags: ["Education", "Training", "Academic"],
    isBlocked: false,
  },
];

export interface Category {
  id: string;
  name: string;
  description: string;
  tags: string[];
  color: string;
  isBlocked: boolean;
}

export default function CategoriesTagsManagement() {
  const [categories, setCategories] = useState<Category[]>(dummyCategories);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  // ---------------- HANDLERS ----------------
  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (data: CategoryFormData) => {
    if (selectedCategory) {
      // Update existing
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === selectedCategory.id ? { ...cat, ...data } : cat
        )
        
      );
    } else {
      // Add new
      const newCategory: Category = {
        id: (categories.length + 1).toString(),
        ...data,
        isBlocked: false,
      };
      setCategories((prev) => [...prev, newCategory]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  const handleBlockToggle = (id: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, isBlocked: !cat.isBlocked } : cat
      )
    );
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
