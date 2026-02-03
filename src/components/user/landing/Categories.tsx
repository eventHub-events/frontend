// "use client"
// import { Category } from "@/components/admin/category/CategoryManagement";
// import { categoryService } from "@/services/admin/categoryService";
// import { useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import { 
//   FaMusic, 
//   FaRunning, 
//   FaPalette, 
//   FaLaptopCode, 
//   FaUtensils,
//   FaCalendarAlt
// } from "react-icons/fa";
// import { IconType } from "react-icons/lib";

//  const Categories = () => {
// //    const  [categoryNames,setCategoryNames] = useState<string[]>([]);
//    const  [categories,setCategories] = useState<Category[]>([]);
//   // const [activeCategory, setActiveCategory] = useState<string | null>(null);

//   const router = useRouter();
//    useEffect(() => {
//      try{

//       const fetchCategories = async () => {
//                 const result=  await categoryService.fetchAllCategoriesForLandingPage();
//                 console.log("cat", result)
//                  setCategories(result.data.data);
//                 //  const names = result.data.data?.map((cat: Category) => cat.name)
//                 // //  setCategoryNames(names)
//      }
//       fetchCategories();
//     }catch(err){
//        console.log(err);
//      }
//    },[]);


//    const categoryIconMap: Record<string, IconType> = {
//   music: FaMusic,
//   sports: FaRunning,
//   art: FaPalette,
//   technology: FaLaptopCode,
//   tech: FaLaptopCode,
//   food: FaUtensils,
  
// };
// const getCategoryIcon = (name: string): IconType => {
//   const key = name.toLowerCase();
//   return categoryIconMap[key] || FaCalendarAlt; // fallback icon
// };

 
// const categoryStyleMap: Record<string, {
//   ring: string;
//   glow: string;
//   icon: string;
// }> = {
//   musicconcerts: {
//     ring: "from-fuchsia-500 via-pink-500 to-rose-500",
//     glow: "shadow-[0_0_60px_rgba(236,72,153,0.35)]",
//     icon: "text-pink-600",
//   },
//   workshops: {
//     ring: "from-amber-500 via-orange-500 to-yellow-400",
//     glow: "shadow-[0_0_60px_rgba(245,158,11,0.35)]",
//     icon: "text-orange-600",
//   },
//   sports: {
//     ring: "from-emerald-500 via-green-500 to-lime-400",
//     glow: "shadow-[0_0_60px_rgba(34,197,94,0.35)]",
//     icon: "text-green-600",
//   },
//   technology: {
//     ring: "from-indigo-500 via-blue-500 to-cyan-400",
//     glow: "shadow-[0_0_60px_rgba(59,130,246,0.35)]",
//     icon: "text-blue-600",
//   },
// };
// const getCategoryStyle = (name: string) => {
//   return (
//     categoryStyleMap[name.toLowerCase()] ?? {
//       ring: "from-gray-400 to-gray-300",
//       glow: "shadow-none",
//       icon: "text-gray-700",
//     }
//   );
// };



//   return (
// <section className="relative py-28 bg-[#f5f6f8]">
//   {/* <div className="
//     relative max-w-7xl mx-auto px-4
//     rounded-[42px]
//     bg-white/60 backdrop-blur-xl
//     shadow-[0_40px_120px_rgba(0,0,0,0.12)]
//     border border-black/5
//     py-20
//   "> */}
//     {/* ✅ AMBIENT GLOW – PUT IT HERE */}
//   <div className="absolute inset-0 pointer-events-none">
//     <div className="
//       absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
//       w-[900px] h-[500px]
//       rounded-full
//       bg-gradient-to-r from-red-500/10 via-orange-400/10 to-yellow-300/10
//       blur-[140px]
//     "/>
//   </div>

//   {/* ✅ CONTENT CONTAINER */}
//   <div className="
//     relative max-w-7xl mx-auto px-4
//     rounded-[42px]
//     bg-white/60 backdrop-blur-xl
//     shadow-[0_40px_120px_rgba(0,0,0,0.12)]
//     border border-black/5
//     py-20
//   ">

//     {/* Header */}
//     <div className="text-center mb-20">
//       <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
//         Explore by{" "}
//         <span className="text-red-600">Category</span>
//       </h2>
//       <p className="mt-4 text-lg text-gray-600">
//         Choose what excites you the most
//       </p>
//     </div>

//     {/* Category Grid */}
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

//     {categories.map((category) => {
//   const Icon = getCategoryIcon(category.name);
//   const style = getCategoryStyle(category.name);

//   return (
//     <button
//       key={category.id}
//         onClick={() => router.push(`/user/events/category/${encodeURIComponent(category.name)}`)}
//       className="group relative rounded-3xl bg-white px-8 py-10 text-center
//                  shadow-[0_10px_35px_rgba(0,0,0,0.08)]
//                  hover:-translate-y-2 transition-all duration-300"
//     >
//       {/* Icon Ring */}
//       <div
//         className={`
//           mx-auto mb-6 w-20 h-20 rounded-full
//           flex items-center justify-center
//           bg-gradient-to-br ${style.ring}
//           ${style.glow}
//           transition-all duration-300
//           group-hover:scale-110
//         `}
//       >
//         <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
//           <Icon size={26} className={style.icon} />
//         </div>
//       </div>

//       <h3 className="text-lg font-semibold text-gray-900">
//         {category.name}
//       </h3>

//       <div className="mt-3 opacity-0 group-hover:opacity-100 transition">
//         <span className="text-sm font-medium text-gray-700">
//           Explore →
//         </span>
//       </div>
//     </button>
//   );
// })}

//     </div>

//     {/* CTA */}
//     <div className="mt-20 text-center">
//       <button 
//           onClick={() => router.push("/events")}
//        className="
//         inline-flex items-center gap-3
//         px-12 py-4 rounded-full
//         text-white font-semibold
//         bg-gradient-to-r from-red-600 to-orange-500
//         shadow-lg hover:shadow-xl hover:scale-[1.03]
//         transition
//       ">
//         Explore all categories →
//       </button>
//     </div>
//  </div>
//   {/* </div> */}
// </section>



// );
// };

// export default Categories;


"use client";

import { Category } from "@/components/admin/category/CategoryManagement";
import { categoryService } from "@/services/admin/categoryService";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  FaMusic,
  FaRunning,
  FaPalette,
  FaLaptopCode,
  FaUtensils,
  FaCalendarAlt,
} from "react-icons/fa";
import { IconType } from "react-icons/lib";

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await categoryService.fetchAllCategoriesForLandingPage();
      setCategories(result.data.data);
    };
    fetchCategories();
  }, []);

  /* ---------- ICON MAP ---------- */
  const categoryIconMap: Record<string, IconType> = {
    music: FaMusic,
    sports: FaRunning,
    art: FaPalette,
    technology: FaLaptopCode,
    tech: FaLaptopCode,
    food: FaUtensils,
  };

  const getCategoryIcon = (name: string): IconType =>
    categoryIconMap[name.toLowerCase()] || FaCalendarAlt;

  /* ---------- COLOR MAP ---------- */
  const categoryColorMap: Record<
    string,
    { bg: string; iconBg: string }
  > = {
    technology: {
      bg: "from-blue-500 to-cyan-400",
      iconBg: "bg-blue-100 text-blue-600",
    },
    sports: {
      bg: "from-green-500 to-lime-400",
      iconBg: "bg-green-100 text-green-600",
    },
    workshops: {
      bg: "from-orange-400 to-amber-400",
      iconBg: "bg-orange-100 text-orange-600",
    },
    musicconcerts: {
      bg: "from-pink-500 to-rose-400",
      iconBg: "bg-pink-100 text-pink-600",
    },
  };

  const getCategoryColors = (name: string) =>
    categoryColorMap[name.toLowerCase()] ?? {
      bg: "from-purple-500 to-indigo-400",
      iconBg: "bg-purple-100 text-purple-600",
    };

  return (
    <section className="relative py-32 bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-red-400/20 via-orange-300/20 to-pink-400/20 blur-[160px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* CENTERED HEADING */}
        <div className="mb-20 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Browse by{" "}
            <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
              category
            </span>
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            Discover events that match your vibe
          </p>
        </div>

        {/* CATEGORY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {categories.map((category) => {
            const Icon = getCategoryIcon(category.name);
            const colors = getCategoryColors(category.name);

            return (
              <button
                key={category.id}
                onClick={() =>
                  router.push(
                    `/user/events/category/${encodeURIComponent(
                      category.name
                    )}`
                  )
                }
                className="
                  group relative h-56 rounded-3xl
                  shadow-[0_20px_50px_rgba(0,0,0,0.15)]
                  hover:shadow-[0_30px_70px_rgba(0,0,0,0.22)]
                  hover:-translate-y-3
                  transition-all duration-300
                  overflow-hidden
                  text-left
                "
              >
                {/* Gradient surface */}
                <div
                  className={`
                    absolute inset-0 bg-gradient-to-br ${colors.bg}
                    opacity-90
                  `}
                />

                {/* Content */}
                <div className="relative z-10 h-full p-6 flex flex-col justify-between">
                  {/* Icon */}
                  <div
                    className={`
                      w-14 h-14 rounded-2xl
                      ${colors.iconBg}
                      flex items-center justify-center
                      shadow-md
                      group-hover:scale-110
                      transition
                    `}
                  >
                    <Icon size={26} />
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {category.name}
                    </h3>

                    <div className="mt-2 flex items-center gap-2 text-white/90">
                      <span className="text-sm font-medium">
                        Explore events
                      </span>
                      <span className="text-lg">→</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* VIEW ALL CATEGORIES — BOTTOM CTA */}
        <div className="mt-24 text-center">
          <button
            onClick={() => router.push("/events")}
            className="
              inline-flex items-center gap-2
              px-10 py-4 rounded-full
              bg-gradient-to-r from-red-600 to-orange-500
              text-white font-semibold text-lg
              shadow-xl hover:shadow-2xl
              hover:scale-[1.06]
              transition
            "
          >
            View all categories →
          </button>
        </div>
      </div>
    </section>
  );
};

export default Categories;
