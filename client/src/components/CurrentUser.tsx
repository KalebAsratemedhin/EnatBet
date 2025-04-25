import {useGetCurrentUserQuery, useLogoutMutation } from "@/api/authApi";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiBell} from 'react-icons/hi';

const CurrentUser = () => {
  const { data: user, refetch } = useGetCurrentUserQuery();

  const [dropdownOpen, setDropdownOpen] = useState(false); 
  const [logout, { isError, error, isSuccess }] = useLogoutMutation();
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const navigator = useNavigate();


  useEffect(() => {
    if (isError) {
        console.error('logout error:', error);
    }
    if (isSuccess) {        
        navigator("/"); 
    }
  }, [isError, isSuccess, error]);
      

    const handleLogout = async () => {
      try {
        await logout().unwrap();
        refetch();
        localStorage.clear();
        
      } catch (error) {
        console.error('Logout error:', error);
        
      }
  
    };

  return (
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
  )
}

export default CurrentUser