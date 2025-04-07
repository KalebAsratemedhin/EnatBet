import React, { useEffect, useState } from 'react';
import { HiBell, HiMenuAlt3, HiX } from 'react-icons/hi';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import { useGetCurrentUserQuery, useLogoutMutation } from '../api/authApi';



const Header: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); 
  const [logout, { isError, error, isSuccess }] = useLogoutMutation();
  const { data: user } = useGetCurrentUserQuery();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  const navigator = useNavigate();
  
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Restaurants', href: '/restaurants' },
    { name: 'Orders', href: '/orders' },
    { name: 'Dashboard', href: '/dashboard' },
  ];

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    if (isError) {
      console.error('logout error:', error);
    }
    if (isSuccess) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigator("/"); 
    }
  }, [isError, isSuccess, error]);
    

  return (
    <>
      <header className="bg-white shadow-lg py-5 px-6 flex justify-between items-center h-20 sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-red-500 tracking-wide">EnatBet</h1>

        <div className="md:hidden">
          <button onClick={toggleSidebar} className="text-3xl text-gray-700 focus:outline-none">
            {sidebarOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>

        {isAuthenticated() ? (
          <div className="flex items-center space-x-4 relative">
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full text-xl text-gray-700"
              >
                {user?.profileImage ? (
                  <img src={user?.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  user?.name?.charAt(0)?.toUpperCase()
                )}
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
                  <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link>
                  <Link to="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
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
        ) : (
          <div className="space-x-4">
            <Link
              to="/signup"
              className="bg-white text-red-500 px-6 py-3 font-semibold rounded-full shadow-md hover:bg-gray-100"
            >
              Signup
            </Link>
            <Link
              to="/signin"
              className="bg-white text-red-500 px-6 py-3 font-semibold rounded-full shadow-md hover:bg-gray-100"
            >
              Signin
            </Link>
          </div>
        )}
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

