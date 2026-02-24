"use client";
import React from "react";

const FeaturedSkeleton = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="h-12 w-64 mx-auto bg-gray-300 rounded-xl relative overflow-hidden">
            <div className="shimmer absolute inset-0"></div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-200"
            >
              <div className="h-56 bg-gray-300 relative overflow-hidden">
                <div className="shimmer absolute inset-0"></div>
              </div>

              <div className="p-6 space-y-4">
                <div className="h-5 w-3/4 bg-gray-300 rounded"></div>
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                <div className="h-10 w-full bg-gray-300 rounded-xl"></div>
              </div>
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
          animation: shine 1.5s infinite;
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

export default FeaturedSkeleton;