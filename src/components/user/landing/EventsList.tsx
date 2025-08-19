import React from "react";
import Image from 'next/image';
import { 
  FaMusic, 
  FaPalette, 
  FaLaptopCode,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaArrowRight
} from "react-icons/fa";

const EventsList: React.FC = () => {
  const events = [
    { 
      title: "Neon Lights Music Festival", 
      date: "May 5, 2024", 
      location: "Brooklyn Mirage, New York",
      category: "Music",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      price: "$89+"
    },
    { 
      title: "Contemporary Art Biennale", 
      date: "June 10-30, 2024", 
      location: "The Broad, Los Angeles",
      category: "Art",
      image: "https://images.unsplash.com/photo-1578926375605-eaf7559b1458?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      price: "From $25"
    },
    { 
      title: "Future Tech Summit", 
      date: "July 20-22, 2024", 
      location: "Moscone Center, San Francisco",
      category: "Tech",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      price: "$299+"
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case "Music": return <FaMusic className="text-pink-500" />;
      case "Art": return <FaPalette className="text-purple-500" />;
      case "Tech": return <FaLaptopCode className="text-blue-500" />;
      default: return <FaCalendarAlt className="text-gray-500" />;
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Events</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover experiences that inspire and excite
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, idx) => (
            <div 
              key={idx} 
              className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-100"
            >
              {/* Event Image */}
              <div className="relative h-48 overflow-hidden">
                <Image 
                  src={event.image} 
                  alt={event.title}
                  width={500}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  {getCategoryIcon(event.category)}
                  <span className="ml-2 text-gray-800">{event.category}</span>
                </div>
                <div className="absolute bottom-4 left-4 text-white font-medium">
                  {event.price}
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{event.title}</h3>
                
                <div className="flex items-center text-gray-600 mb-3">
                  <FaCalendarAlt className="mr-2 text-gray-400" />
                  <span>{event.date}</span>
                </div>
                
                <div className="flex items-center text-gray-600 mb-6">
                  <FaMapMarkerAlt className="mr-2 text-gray-400" />
                  <span>{event.location}</span>
                </div>

                <button className="w-full flex items-center justify-between px-5 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium rounded-lg transition-all duration-300 group-hover:shadow-md">
                  <span>View Details</span>
                  <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <button className="inline-flex items-center px-8 py-3.5 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white rounded-lg font-medium transition-all duration-300 group">
            View All Events
            <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default EventsList;