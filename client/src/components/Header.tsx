import { Link, NavLink } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import CurrentUser from './CurrentUser';
import { SidebarTrigger } from './ui/sidebar';
import { FC } from 'react';

export const AuthHeader: FC = () => {

  return (  
      <header className="bg-white shadow-lg py-5 px-6 flex justify-between items-center h-20 sticky top-0 z-50">

        <div className="md:hidden">
          <SidebarTrigger/>
        </div>

        <h1 className="text-2xl font-bold text-red-500 tracking-wide">EnatBet</h1>
        <div className="space-x-4 hidden md:flex">
          <NavLink
            key={'Home'}
            to={'/'}
            className={({ isActive }) =>
              isActive ? 'text-red-500 font-semibold' : 'text-gray-700'
            }
          >
            Home
          </NavLink>
          <NavLink
            key={'About'}
            to={'/about'}
            className={({ isActive }) =>
              isActive ? 'text-red-500 font-semibold' : 'text-gray-700'
            }
          >
            About
          </NavLink>
          <NavLink
              key={'Restaurants'}
              to={'/restaurants'}
              className={({ isActive }) =>
                isActive ? 'text-red-500 font-semibold' : 'text-gray-700'
              }
            >
              Restaurants
            </NavLink>
          </div>
        {isAuthenticated() ? <CurrentUser/> : (
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
  );
};


export const BasicHeader: FC = () => {

  return (
    <>
      <header className="bg-white shadow-lg py-5 px-6 flex justify-between items-center h-20 sticky top-0 z-50">

        <h1 className="text-2xl font-bold text-red-500 tracking-wide">EnatBet</h1>
        <div className="space-x-4 hidden md:flex">
          <NavLink
            key={'Home'}
            to={'/'}
            className={({ isActive }) =>
              isActive ? 'text-red-500 font-semibold' : 'text-gray-700'
            }
          >
            Home
          </NavLink>
          <NavLink
            key={'About'}
            to={'/about'}
            className={({ isActive }) =>
              isActive ? 'text-red-500 font-semibold' : 'text-gray-700'
            }
          >
            About
          </NavLink>
          <NavLink
              key={'Restaurants'}
              to={'/restaurants'}
              className={({ isActive }) =>
                isActive ? 'text-red-500 font-semibold' : 'text-gray-700'
              }
            >
              Restaurants
            </NavLink>
          </div>
          {isAuthenticated() ? <CurrentUser/> : (
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
    </>
  );
};


