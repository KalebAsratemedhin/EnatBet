import React, { useState } from 'react';
import { HiBell, HiMenuAlt3, HiX } from 'react-icons/hi';
import { NavLink } from 'react-router-dom';



const Header: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  const userName = 'John Doe'; // Replace with dynamic username if needed
  const userInitial = userName.charAt(0).toUpperCase(); // Get the first initial


  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Restaurants', href: '/restaurants' },
    { name: 'Orders', href: '/orders' },
    { name: 'Dashboard', href: '/dashboard' },
  ];

  return (
    <>
      <header className="bg-white shadow-lg py-5 px-6 flex justify-between items-center h-20 sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-red-500 tracking-wide">EnatBet</h1>

        {/* Desktop Navigation (Removed) */}

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={toggleSidebar} className="text-3xl text-gray-700 focus:outline-none">
            {sidebarOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>

        {/* User Profile & Notifications */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full text-xl text-gray-700">
              {userInitial} {/* Show the first initial of the user's name */}
            </button>
          </div>

          <div className="relative">
            <button className="text-2xl text-gray-700">
              <HiBell />
            </button>
            <span className="absolute top-0 right-0 text-xs text-white bg-red-500 rounded-full w-4 h-4 flex items-center justify-center">
              3 {/* Notifications count */}
            </span>
          </div>
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
            // <a
            // href={link.href}
            // className="text-gray-700 text-lg hover:text-red-500 transition-colors"
            // >
            // </a>
            <NavLink
            key={link.name}
            to={link.href}
            onClick={closeSidebar}
            className={({ isActive }) =>
              isActive ? 'text-red-500 font-semibold' : 'text-gray-700'
            }
          >
            {link.name}

          </NavLink>
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
