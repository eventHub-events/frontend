"use client";
import React from "react";

const CategorySkeleton = () => {
  return (
    <section className="py-32 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6">

        {/* heading */}
        <div className="text-center mb-20">
          <div className="h-10 w-64 bg-gray-300 mx-auto rounded-xl relative overflow-hidden">
            <div className="shimmer absolute inset-0"></div>
          </div>
          <div className="h-4 w-40 bg-gray-300 mx-auto mt-4 rounded relative overflow-hidden">
            <div className="shimmer absolute inset-0"></div>
          </div>
        </div>

        {/* cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {[1,2,3,4].map((i)=>(
            <div
              key={i}
              className="h-56 rounded-3xl bg-gray-300 relative overflow-hidden"
            >
              <div className="shimmer absolute inset-0"></div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .shimmer {
          background: linear-gradient(
            110deg,
            rgba(255,255,255,0) 25%,
            rgba(255,255,255,0.6) 50%,
            rgba(255,255,255,0) 75%
          );
          background-size: 200% 100%;
          animation: shine 1.4s infinite;
        }
        @keyframes shine {
          to {
            background-position-x: -200%;
          }
        }
      `}</style>
    </section>
  );
};

export default CategorySkeleton;