"use client"
import React, { useState } from "react";
import { 
  FaMusic, 
  FaRunning, 
  FaPalette, 
  FaLaptopCode, 
  FaUtensils,
  FaChevronRight
} from "react-icons/fa";

const Categories = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = [
    { name: "Music", icon: <FaMusic className="text-pink-500" />, color: "bg-pink-100" },
    { name: "Sports", icon: <FaRunning className="text-blue-500" />, color: "bg-blue-100" },
    { name: "Art", icon: <FaPalette className="text-purple-500" />, color: "bg-purple-100" },
    { name: "Tech", icon: <FaLaptopCode className="text-green-500" />, color: "bg-green-100" },
    { name: "Food & Drinks", icon: <FaUtensils className="text-amber-500" />, color: "bg-amber-100" },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Categories</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover experiences tailored to your interests
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setActiveCategory(category.name)}
              className={`relative group p-6 rounded-2xl transition-all duration-300 ${category.color} ${
                activeCategory === category.name 
                  ? 'ring-2 ring-offset-2 ring-purple-500 shadow-lg' 
                  : 'hover:shadow-md hover:-translate-y-1'
              }`}
            >
              <div className="flex flex-col items-center">
                <div className="p-4 bg-white rounded-full shadow-sm mb-4 group-hover:shadow-md transition-shadow">
                  {React.cloneElement(category.icon, { size: 24 })}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{category.name}</h3>
                <div className="flex items-center text-sm text-purple-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <FaChevronRight className="ml-1" size={12} />
                </div>
              </div>
              
              {/* Active indicator */}
              {activeCategory === category.name && (
                <div className="absolute top-3 right-3 w-2 h-2 bg-purple-500 rounded-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* View all button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white font-medium rounded-full transition-all duration-300 shadow-md hover:shadow-lg">
            View All Categories
            <FaChevronRight className="ml-2" size={14} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Categories;