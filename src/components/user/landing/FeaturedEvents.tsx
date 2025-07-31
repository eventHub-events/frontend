import React from "react";
import { 
  FiCalendar as DateIcon, 
  FiMapPin as LocationIcon,
  FiUser as OrganizerIcon
} from "react-icons/fi";
import { HiTicket as TicketIcon } from "react-icons/hi";
import { GiWineBottle } from "react-icons/gi";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

const FeaturedEvents = () => {
  // Premium event data with organizers and ratings
  const events = [
    {
      id: 1,
      title: "Gourmet & Vine Experience",
      description: "Exclusive wine pairing with 5-course gourmet menu by Michelin-starred chefs in an intimate setting.",
      time: "Dec 22, 07:00 PM",
      location: "The Grand Ballroom, NYC",
      ticketsLeft: 12,
      availability: 75,
      rating: 4.7,
      totalReviews: 128,
      organizer: "Luxury Dining Collective",
      category: "Culinary Delights",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Vintage Reserve Tasting",
      description: "Rare vintages from legendary vineyards with master sommelier commentary and artisan cheese pairings.",
      time: "Jan 5, 06:30 PM",
      location: "Vino Paradiso, Chicago",
      ticketsLeft: 8,
      availability: 88,
      rating: 4.9,
      totalReviews: 215,
      organizer: "Vintage Curators LLC",
      category: "Premium Wines",
      image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Truffle & Champagne Gala",
      description: "Seasonal truffles paired with boutique champagne houses in our elegant pearl room venue.",
      time: "Jan 12, 08:00 PM",
      location: "The Pearl Room, LA",
      ticketsLeft: 5,
      availability: 92,
      rating: 4.8,
      totalReviews: 187,
      organizer: "Epicurean Events Group",
      category: "Luxury Pairing",
      image: "https://images.unsplash.com/photo-1506377717376-cb4e0e37496e?w=800&auto=format&fit=crop"
    },
    {
      id: 4,
      title: "Organic Winemakers Showcase",
      description: "Meet pioneering organic winemakers and taste their limited edition biodynamic creations.",
      time: "Jan 18, 07:30 PM",
      location: "Vineyard Loft, Napa",
      ticketsLeft: 20,
      availability: 80,
      rating: 4.6,
      totalReviews: 94,
      organizer: "Green Vine Ventures",
      category: "Eco Wines",
      image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&auto=format&fit=crop"
    },
    {
      id: 5,
      title: "Whiskey & Chocolate Affair",
      description: "Premium single malts paired with artisan bean-to-bar chocolates in our oak-paneled library.",
      time: "Feb 2, 08:30 PM",
      location: "The Oak Library, Boston",
      ticketsLeft: 15,
      availability: 85,
      rating: 4.5,
      totalReviews: 76,
      organizer: "Spirit Connoisseurs",
      category: "Spirit Pairing",
      image: "https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=800&auto=format&fit=crop"
    },
    {
      id: 6,
      title: "Zero-Proof Mixology Night",
      description: "Craft non-alcoholic cocktails using rare botanicals and innovative techniques with top mixologists.",
      time: "Feb 9, 06:00 PM",
      location: "The Alchemist Bar, Austin",
      ticketsLeft: 25,
      availability: 70,
      rating: 4.4,
      totalReviews: 63,
      organizer: "Modern Mixology Co.",
      category: "Craft Cocktails",
      image: "https://images.unsplash.com/photo-1551751299-1b51cab2694c?w=800&auto=format&fit=crop"
    }
  ];

  // Star rating component
  const renderStars = (rating:number) => {
    return Array(5).fill(0).map((_, i) => (
      i < Math.floor(rating) ? 
        <FaStar key={i} className="text-amber-400" /> : 
      i === Math.floor(rating) && rating % 1 >= 0.5 ?
        <FaStarHalfAlt key={i} className="text-amber-400" /> :
        <FaRegStar key={i} className="text-amber-400" />
    ));
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Featured</span> Events
          </h2>
          {/* <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Curated events for discerning tastes
          </p> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {events.map((event) => (
            <div 
              key={event.id} 
              className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-cyan-200"
            >
              {/* Image with gradient overlay */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium flex items-center shadow-sm">
                  <GiWineBottle className="mr-1.5 text-cyan-600" size={16} />
                  {event.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{event.title}</h3>
                <p className="text-gray-600 mb-5">{event.description}</p>
                
                {/* Details with colorful icons */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-700">
                    <DateIcon className="mr-3 text-purple-500" size={18} />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <LocationIcon className="mr-3 text-blue-500" size={18} />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <OrganizerIcon className="mr-3 text-amber-500" size={18} />
                    <span className="font-medium">{event.organizer}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <TicketIcon className="mr-3 text-red-500" size={18} />
                    <span className="font-medium">{event.ticketsLeft} tickets left</span>
                  </div>
                </div>

                {/* Full width availability bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Availability</span>
                    <span className="font-medium text-emerald-600">{event.availability}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-emerald-300 to-emerald-600 h-2.5 rounded-full" 
                      style={{ width: `${event.availability}%` }}
                    ></div>
                  </div>
                </div>

                {/* Rating and CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <div className="flex items-center mb-1">
                      <div className="flex mr-2">
                        {renderStars(event.rating)}
                      </div>
                      <span className="text-gray-700 font-medium">{event.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500">{event.totalReviews} reviews</span>
                  </div>
                  <button className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                    Book Now
                  </button>
                </div>
              </div>

              {/* Best seller ribbon */}
              {event.rating >= 4.8 && (
                <div className="absolute top-0 left-0 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg shadow-md">
                  Top Rated
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <button className="inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            View All Events
            <svg 
              className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;