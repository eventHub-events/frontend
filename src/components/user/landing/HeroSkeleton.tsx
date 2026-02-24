"use client";
import React from "react";

const HeroSkeleton = () => {
  return (
    <section className="w-full py-14 bg-gradient-to-b from-gray-100 to-gray-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* heading */}
        <div className="text-center mb-12">
          <div className="h-10 w-72 mx-auto rounded-xl bg-gray-300 relative overflow-hidden">
            <div className="absolute inset-0 shimmer"></div>
          </div>

          <div className="h-4 w-40 mx-auto mt-5 rounded bg-gray-300 relative overflow-hidden">
            <div className="absolute inset-0 shimmer"></div>
          </div>
        </div>

        {/* cards */}
        <div className="flex gap-6 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-none w-[85vw] sm:w-[55vw] md:w-[40vw] lg:w-[32vw] xl:w-[28vw]"
            >
              <div className="aspect-[6/4] rounded-3xl bg-gray-300 relative overflow-hidden shadow-lg">
                {/* shimmer */}
                <div className="absolute inset-0 shimmer"></div>

                {/* glass overlay skeleton */}
                <div className="absolute bottom-0 left-0 right-0 p-5 backdrop-blur-md bg-white/20">
                  <div className="h-4 w-24 bg-gray-200 rounded mb-3"></div>
                  <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 w-28 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 w-20 bg-gray-200 rounded mb-4"></div>

                  <div className="flex justify-between">
                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                  </div>

                  <div className="h-9 w-full bg-gray-200 rounded-lg mt-4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* shimmer style */}
      <style jsx>{`
        .shimmer {
          background: linear-gradient(
            110deg,
            rgba(255,255,255,0) 25%,
            rgba(255,255,255,0.6) 50%,
            rgba(255,255,255,0) 75%
          );
          background-size: 200% 100%;
          animation: shine 1.6s infinite;
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

export default HeroSkeleton;