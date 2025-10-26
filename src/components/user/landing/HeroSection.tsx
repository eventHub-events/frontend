"use client";

import React, { useRef, useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Image from "next/image";

interface EventPoster {
  id: number;
  title: string;
  date: string;
  venue: string;
  image: string;
  tags: string[];
  ctaText: string;
  price?: string;
  attendees?: string;
}

const eventPosters: EventPoster[] = [
  {
    id: 1,
    title: "Sunburn Arena: Mumbai Edition",
    date: "Oct 12, 2025 | 6 PM",
    venue: "Nesco Convention Center",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop",
    tags: ["EDM", "Festival"],
    ctaText: "Book Tickets",
    price: "₹2,999",
    attendees: "5K+"
  },
  {
    id: 2,
    title: "TechSpark Conference",
    date: "Nov 1-3, 2025 | 9 AM",
    venue: "Bangalore Exhibition Centre",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop",
    tags: ["Tech", "Workshops"],
    ctaText: "Register Now",
    price: "₹4,999"
  },
  {
    id: 3,
    title: "Indie Music Fest 2025",
    date: "Dec 14, 2025 | 7 PM",
    venue: "JLN Stadium, Delhi",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
    tags: ["Music", "Live"],
    ctaText: "Get Passes",
    price: "₹1,799"
  }
];

const EventPosterCarousel = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Create duplicated array for seamless infinite scroll
  const duplicatedEvents = [...eventPosters, ...eventPosters, ...eventPosters];

  const scrollToIndex = (index: number) => {
    if (!carouselRef.current) return;
    const card = carouselRef.current.children[0] as HTMLElement;
    const cardWidth = card?.offsetWidth || 0;
    const gap = 12; // gap-3
    const scrollAmount = (cardWidth + gap) * index;
    carouselRef.current.scrollTo({
      left: scrollAmount,
      behavior: "smooth"
    });
    setCurrentIndex(index);
  };

  const scroll = (direction: "left" | "right") => {
    const newIndex = direction === "left" 
      ? (currentIndex - 1 + eventPosters.length) % eventPosters.length
      : (currentIndex + 1) % eventPosters.length;
    scrollToIndex(newIndex);
  };

  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      const newIndex = (currentIndex + 1) % eventPosters.length;
      scrollToIndex(newIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, isHovered]);

  // Continuous horizontal scroll animation
  useEffect(() => {
    if (isHovered || !carouselRef.current) return;

    const scrollContainer = carouselRef.current;
    let animationId: number;
    
    const animate = () => {
      if (scrollContainer && !isHovered) {
        scrollContainer.scrollLeft += 1; // Increased speed for better visibility
        
        // Reset scroll position when we've scrolled past the first set
        const maxScroll = scrollContainer.scrollWidth / 3;
        if (scrollContainer.scrollLeft >= maxScroll) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isHovered]);

  return (
    <section 
      className="w-full py-12 bg-gray-200 relative overflow-visible"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
     
      <div className="relative z-10 w-full">
         {/* Featured Events Heading - Centered with Underline */}
        <div className="mb-12 px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            <span className="bg-gradient-to-r from-black-900 via-gray-900 to-gray-600 bg-clip-text text">
              Trending Events
            </span>
          </h2>
          <div className="flex justify-center">
            <div className="w-32 h-1.5 bg-gradient-to-r from-bro-500 to-red-500 rounded-full shadow-lg"></div>
          </div>
          <p className="text-gray-600 text-lg mt-4 max-w-2xl mx-auto">
            Discover the most exciting events happening near you
          </p>
        </div>
        
        <div className="relative w-full">
          {/* Clean Navigation Buttons */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white p-4 rounded-2xl shadow-xl z-10 hidden sm:block transition-all duration-300 border border-gray-300 hover:border-purple-400 hover:scale-110 group"
            aria-label="Previous event">
            <FaChevronLeft className="text-gray-700 text-lg group-hover:text-purple-600 transition-colors" />
          </button>

          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-hidden scrollbar-hide w-full px-8"
            style={{ scrollBehavior: 'auto' }}>
            
            {duplicatedEvents.map((event, index) => (
              <div 
                key={`${event.id}-${index}`}
                className="flex-none w-[85vw] sm:w-[55vw] md:w-[40vw] lg:w-[32vw] xl:w-[28vw] transform transition-all duration-500">
                
                <div className="relative aspect-[6/4] w-full rounded-3xl overflow-hidden shadow-2xl hover:shadow-2xl transition-all duration-500 group hover:scale-105">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    sizes="(max-width: 640px) 85vw, (max-width: 768px) 55vw, (max-width: 1024px) 40vw, (max-width: 1280px) 32vw, 28vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority={index < 6}
                  />
                  
                  {/* Clean Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-6 text-white">
                    
                    {/* Clean Tags */}
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {event.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold border border-white/30">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Improved Title - Better visibility */}
                    <h3 className="text-lg sm:text-xl font-bold mb-3 leading-tight text-white line-clamp-2 min-h-[3rem]">
                      {event.title}
                    </h3>
                    
                    {/* Clean Details Layout */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-blue-300">📅</span>
                        <span className="text-gray-200 font-medium">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-purple-300">📍</span>
                        <span className="text-gray-200 font-medium truncate">{event.venue}</span>
                      </div>
                    </div>
                    
                    {/* Clean Price & Attendees */}
                    <div className="flex justify-between items-center mb-4">
                      {event.price && (
                        <span className="font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 px-3 py-2 rounded-lg text-sm">
                          {event.price}
                        </span>
                      )}
                      {event.attendees && (
                        <span className="flex items-center gap-1 text-xs font-medium bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg">
                          👥 {event.attendees}
                        </span>
                      )}
                    </div>
                    
                    {/* Clean CTA Button */}
                    <button className="w-full py-3 bg-gradient-to-r from-red-600 to-yellow-600 hover:from-yellow-500 hover:to-pink-500 rounded-lg text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                      {event.ctaText}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white p-4 rounded-2xl shadow-xl z-10 hidden sm:block transition-all duration-300 border border-gray-300 hover:border-purple-400 hover:scale-110 group"
            aria-label="Next event">
            <FaChevronRight className="text-gray-700 text-lg group-hover:text-purple-600 transition-colors" />
          </button>
        </div>

        {/* Clean Dot Indicators */}
        <div className="flex justify-center gap-3 mt-8 px-8">
          {eventPosters.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`rounded-full transition-all duration-500 ${
                currentIndex === index 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-2 shadow-lg shadow-purple-500/25' 
                  : 'bg-gray-300 hover:bg-gray-400 w-2 h-2'
              }`}
              aria-label={`Go to event ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventPosterCarousel;