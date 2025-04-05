import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-6 mt-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 text-sm">
        {/* Company */}
        <div>
          <h2 className="text-white text-lg font-semibold mb-4">EnatBet</h2>
          <p className="text-gray-400">
            Bringing your favorite meals from your favorite restaurants right to your doorstep.
          </p>
        </div>

        {/* Explore */}
        <div>
          <h3 className="text-white font-semibold mb-4">Explore</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-red-500 transition">Home</a></li>
            <li><a href="#" className="hover:text-red-500 transition">Restaurants</a></li>
            <li><a href="#" className="hover:text-red-500 transition">Popular Dishes</a></li>
            <li><a href="#" className="hover:text-red-500 transition">Offers</a></li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="text-white font-semibold mb-4">Help</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-red-500 transition">Customer Support</a></li>
            <li><a href="#" className="hover:text-red-500 transition">FAQs</a></li>
            <li><a href="#" className="hover:text-red-500 transition">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-red-500 transition">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-white font-semibold mb-4">Connect With Us</h3>
          <div className="flex space-x-4 text-xl">
            <a href="#" className="hover:text-red-500 transition"><FaFacebookF /></a>
            <a href="#" className="hover:text-red-500 transition"><FaTwitter /></a>
            <a href="#" className="hover:text-red-500 transition"><FaInstagram /></a>
            <a href="#" className="hover:text-red-500 transition"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-500 text-sm mt-10 border-t border-gray-700 pt-6">
        &copy; 2025 EnatBet. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
