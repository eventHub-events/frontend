"use client"

import React, { useState } from "react";
import { FiSearch, FiMapPin, FiCalendar } from "react-icons/fi";
import { motion } from "framer-motion";

const HeroSection: React.FC = () => {
  // const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-indigo-50/20">
      {/* Floating gradient elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[40rem] h-[40rem] bg-gradient-to-r from-indigo-100/30 to-violet-100/30 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[50rem] h-[50rem] bg-gradient-to-r from-sky-100/20 to-blue-100/20 rounded-full filter blur-[120px]"></div>
      </div>

      {/* Subtle grid texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(100,116,139,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        {/* Premium badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center justify-center mb-8 px-5 py-2.5 bg-white/80 backdrop-blur-lg border border-slate-200 rounded-full shadow-sm"
        >
          <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse"></div>
          <span className="text-sm font-medium text-slate-700 tracking-wide">
            Discover Exceptional Events
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Find Events That <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Elevate Your World
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Curated experiences designed to inspire, connect, and transform
          </p>
        </motion.div>

        {/* Search card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-100 p-1"
        >
          <div className="bg-gradient-to-b from-white/50 to-white/0 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Location */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMapPin className="text-slate-400" />
                </div>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-100 text-slate-900 placeholder-slate-400 transition-all duration-200"
                />
              </div>

              {/* Date */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="text-slate-400" />
                </div>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="Date"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-100 text-slate-900 placeholder-slate-400 transition-all duration-200"
                />
              </div>

              {/* Search button */}
              <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                <FiSearch />
                <span>Find Events</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Popular tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap justify-center gap-3 max-w-2xl mx-auto"
        >
          {["Concerts", "Workshops", "Sports", "Food & Wine", "Art Exhibits", "Free Events"].map((tag) => (
            <button
              key={tag}
              className="px-4 py-2 bg-white/80 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 rounded-full text-sm font-medium transition-all duration-200 backdrop-blur-sm shadow-sm hover:shadow"
            >
              {tag}
            </button>
          ))}
        </motion.div>

        {/* Trust indicators */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center"
        >
          {[
            { value: "10K+", label: "Premium Events" },
            { value: "500+", label: "Cities Worldwide" },
            { value: "4.9★", label: "Average Rating" },
            { value: "50K+", label: "Happy Attendees" }
          ].map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-slate-900">
                {item.value}
              </div>
              <div className="text-sm text-slate-500 font-medium">
                {item.label}
              </div>
            </div>
          ))}
        </motion.div> */}
      </div>
    </section>
  );
};

export default HeroSection;