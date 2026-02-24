"use client";

import { Category } from "@/components/admin/category/CategoryManagement";
import { categoryService } from "@/services/admin/categoryService";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaMusic,
  FaRunning,
  FaPalette,
  FaLaptopCode,
  FaUtensils,
  FaCalendarAlt,
} from "react-icons/fa";
import { IconType } from "react-icons/lib";
import CategorySkeleton from "./CategorySkelton";

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result =
          await categoryService.fetchAllCategoriesForLandingPage();
        setCategories(result.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  /* 🎨 COLOR + ICON CONFIG */
  const categoryConfig: Record<
    string,
    {
      icon: IconType;
      gradient: string;
      glow: string;
      iconBg: string;
    }
  > = {
    technology: {
      icon: FaLaptopCode,
      gradient: "from-blue-500 to-indigo-600",
      glow: "shadow-blue-500/30",
      iconBg: "bg-blue-500",
    },
    sports: {
      icon: FaRunning,
      gradient: "from-emerald-500 to-green-600",
      glow: "shadow-emerald-500/30",
      iconBg: "bg-emerald-500",
    },
    music: {
      icon: FaMusic,
      gradient: "from-pink-500 to-rose-600",
      glow: "shadow-pink-500/30",
      iconBg: "bg-pink-500",
    },
    art: {
      icon: FaPalette,
      gradient: "from-purple-500 to-violet-600",
      glow: "shadow-purple-500/30",
      iconBg: "bg-purple-500",
    },
    food: {
      icon: FaUtensils,
      gradient: "from-orange-500 to-red-500",
      glow: "shadow-orange-500/30",
      iconBg: "bg-orange-500",
    },
  };

  const getConfig = (name: string) =>
    categoryConfig[name.toLowerCase()] || {
      icon: FaCalendarAlt,
      gradient: "from-gray-500 to-gray-700",
      glow: "shadow-gray-500/30",
      iconBg: "bg-gray-600",
    };

  if (loading) return <CategorySkeleton />;
  if (!loading && categories.length === 0) return null;

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-orange-200/30 blur-[140px] rounded-full"/>
        <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-pink-200/30 blur-[140px] rounded-full"/>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ===== TITLE ===== */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900">
            <span className="bg-gradient-to-r from-red-600 via-orange-500 to-green-600 bg-clip-text text-transparent">
              Browse
            </span>{" "}
            Categories
          </h2>

          <p className="text-gray-500 mt-4 text-lg">
            Discover events tailored to your interests
          </p>
        </div>

        {/* ===== CATEGORY GRID ===== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10">
          {categories.map((category, index) => {
            const config = getConfig(category.name);
            const Icon = config.icon;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.07 }}
                viewport={{ once: true }}
                onClick={() =>
                  router.push(
                    `/user/events/category/${encodeURIComponent(category.name)}`
                  )
                }
                className="group cursor-pointer"
              >
                <div
                  className={`
                  relative rounded-3xl p-8
                  bg-white border border-gray-200
                  shadow-[0_10px_40px_rgba(0,0,0,0.08)]
                  hover:shadow-[0_25px_70px_rgba(0,0,0,0.18)]
                  transition-all duration-500
                  flex flex-col items-center text-center
                  hover:-translate-y-3
                  ${config.glow}
                `}
                >
                  {/* gradient top border */}
                  <div className={`absolute top-0 left-0 w-full h-1 rounded-t-3xl bg-gradient-to-r ${config.gradient}`} />

                  {/* icon */}
                  <div
                    className={`
                    w-16 h-16 rounded-2xl ${config.iconBg}
                    flex items-center justify-center mb-5
                    shadow-lg group-hover:scale-110 group-hover:rotate-6
                    transition-all duration-300
                  `}
                  >
                    <Icon className="text-white" size={26} />
                  </div>

                  {/* title */}
                  <h3 className="font-bold text-gray-800 text-lg">
                    {category.name}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Explore events →
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <button
            onClick={() => router.push("/user/events")}
            className="
              px-12 py-5 rounded-2xl
              bg-gradient-to-r from-red-600 via-orange-500 to-red-600
              hover:scale-105
              text-white font-semibold text-lg
              shadow-[0_10px_40px_rgba(239,68,68,0.4)]
              transition-all duration-300
            "
          >
            Explore All Events →
          </button>
        </div>

      </div>
    </section>
  );
};

export default Categories;