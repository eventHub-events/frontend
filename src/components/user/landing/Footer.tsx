import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-900 to-indigo-800 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">EventHub</h3>
            <p className="text-purple-200">
              Your premier destination for discovering and booking unforgettable events and experiences.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-purple-300 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-purple-300 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-purple-300 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-purple-300 transition-colors">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-purple-200 hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="text-purple-200 hover:text-white transition-colors">Events</a></li>
              <li><a href="#" className="text-purple-200 hover:text-white transition-colors">Create Event</a></li>
              <li><a href="#" className="text-purple-200 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-purple-200 hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="mt-1 flex-shrink-0" />
                <span className="text-purple-200">123 Event Street, San Francisco, CA 94107</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone />
                <span className="text-purple-200">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope />
                <span className="text-purple-200">support@eventhub.com</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Newsletter</h3>
            <p className="text-purple-200">Subscribe to get updates on upcoming events.</p>
            <form className="flex flex-col space-y-3">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 rounded-lg bg-purple-800 bg-opacity-50 border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-purple-300"
              />
              <button 
                type="submit" 
                className="bg-white text-purple-900 font-medium py-2 px-6 rounded-lg hover:bg-purple-100 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-purple-700 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-purple-300 text-sm">
            © {new Date().getFullYear()} EventHub. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-purple-300 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-purple-300 hover:text-white text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-purple-300 hover:text-white text-sm transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
    
  );
};

export default Footer;