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
        scrollContainer.scrollLeft += 0.5; // Adjust speed here (0.5px per frame)
        
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
    <section className="w-full py-8" 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      
      <div className="w-full">
        <div className="text-center mb-8 px-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              Discover
            </span>{" "}
            <span className="text-gray-900">Amazing</span>{" "}
            <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
              Experiences
            </span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            <span className="font-semibold text-gray-800">Join thousands of event enthusiasts</span> and dive into a world of 
            <span className="text-blue-600 font-medium"> music festivals</span>, 
            <span className="text-purple-600 font-medium"> tech conferences</span>, and 
            <span className="text-orange-600 font-medium"> cultural celebrations</span> that will leave you inspired
          </p>
        </div>
        
        <div className="relative w-full">
          <button
            onClick={() => scroll("left")}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg z-10 hidden sm:block transition-all duration-200"
            aria-label="Previous event">
            <FaChevronLeft className="text-gray-700 text-sm" />
          </button>

          <div
            ref={carouselRef}
            className="flex gap-3 overflow-x-hidden scrollbar-hide w-full"
            style={{ scrollBehavior: 'auto' }}>
            
            {duplicatedEvents.map((event, index) => (
              <div 
                key={`${event.id}-${index}`}
                className="flex-none w-[95vw] sm:w-[60vw] md:w-[45vw] lg:w-[35vw] xl:w-[30vw]">
                
                <div className="relative aspect-[6/4] w-full rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    sizes="(max-width: 640px) 95vw, (max-width: 768px) 60vw, (max-width: 1024px) 45vw, (max-width: 1280px) 35vw, 30vw"
                    className="object-cover"
                    priority={index < 6}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent flex flex-col justify-end p-4 text-white">
                    <div className="flex gap-1.5 mb-3 flex-wrap">
                      {event.tags.map((tag) => (
                        <span key={tag} className="px-2.5 py-1 bg-white/25 backdrop-blur-sm rounded-full text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <h3 className="text-lg sm:text-xl font-bold line-clamp-2 mb-3 leading-tight">{event.title}</h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm opacity-90">
                        <span>📅</span>
                        <span className="truncate">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm opacity-90">
                        <span>📍</span>
                        <span className="truncate">{event.venue}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-3 text-sm">
                      {event.price && (
                        <span className="font-bold text-white bg-green-600 px-3 py-1 rounded-lg">
                          {event.price}
                        </span>
                      )}
                      {event.attendees && (
                        <span className="flex items-center gap-1 text-sm opacity-80">
                          👥 {event.attendees}
                        </span>
                      )}
                    </div>
                    
                    <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-md">
                      {event.ctaText}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg z-10 hidden sm:block transition-all duration-200"
            aria-label="Next event">
            <FaChevronRight className="text-gray-700 text-sm" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-6 px-4">
          {eventPosters.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === index 
                  ? 'bg-blue-600 w-8' 
                  : 'bg-gray-300 hover:bg-gray-400 w-2'
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