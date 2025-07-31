"use client";

import React, { useState } from "react";
import EventHubIcon from "../../ui/EventHubIcon";
import GetStartedModal from "./GetStartedModal";
import Link from "next/link";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("signup");

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <EventHubIcon size={28} className="mr-2" />
            <span className="text-2xl font-extrabold bg-gradient-to-r from-violet-600 via-azure-500 to-blue-500 bg-clip-text text-transparent">
              EventHub
            </span>
          </Link>

          {/* Centered Nav */}
          <nav className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2">
            <a
              href="/events"
              className="text-violet-500 hover:text-violet-600 transition-colors text-sm font-medium px-4 py-2"
            >
              Explore Events
            </a>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Sign In - opens login modal */}
            <button
              onClick={() => {
                setIsOpen(true);
                setMode("login");
              }}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors"
            >
              Sign In
            </button>

            {/* Get Started - opens signup modal */}
            <button
              onClick={() => {
                setIsOpen(true);
                setMode("signup");
              }}
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-blue-500 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <GetStartedModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        mode={mode}
      />
    </header>
  );
};

export default Header;
