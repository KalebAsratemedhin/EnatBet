import React, { useState } from 'react';
import { HiMenuAlt3, HiX } from 'react-icons/hi';

const Header: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Restaurants', href: '#' },
    { name: 'Orders', href: '#' },
    { name: 'Profile', href: '#' },
  ];

  return (
    <>
      <header className="bg-white shadow-lg py-5 px-6 flex justify-between items-center h-20 sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-red-500 tracking-wide">EnatBet</h1>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-gray-700 hover:text-red-500 font-medium transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={toggleSidebar} className="text-3xl text-gray-700 focus:outline-none">
            {sidebarOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md z-40 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 flex items-center justify-between border-b">
          <h2 className="text-xl font-bold text-red-500">Menu</h2>
          <button onClick={closeSidebar} className="text-2xl text-gray-600">
            <HiX />
          </button>
        </div>
        <nav className="flex flex-col p-6 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-gray-700 text-lg hover:text-red-500 transition-colors"
              onClick={closeSidebar}
            >
              {link.name}
            </a>
          ))}
        </nav>
      </div>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          onClick={closeSidebar}
        />
      )}
    </>
  );
};

export default Header;
