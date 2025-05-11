import { Link, NavLink } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import CurrentUser from "./CurrentUser";
import { SidebarTrigger } from "./ui/sidebar";
import { FC } from "react";

const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
  `transition-colors font-medium px-3 py-2 rounded-md ${
    isActive ? "text-red-600 font-semibold" : "text-gray-700 hover:text-red-500"
  }`;

export const AuthHeader: FC = () => {
  return (
    <header className="bg-white shadow-md px-6 py-4 flex items-center justify-between sticky top-0 z-50 h-20">
      {/* Sidebar for mobile */}
      <div className="md:hidden">
        <SidebarTrigger />
      </div>

      {/* Brand */}
      <Link
        to="/"
        className="text-3xl font-bold text-red-600 tracking-wide  md:hidden"
      >
        EnatBet
      </Link>

      {/* Desktop nav links */}
      <nav className="hidden md:flex gap-6">
        <NavLink to="/" className={navLinkClasses}>
          Home
        </NavLink>
        <NavLink to="/about" className={navLinkClasses}>
          About
        </NavLink>
        <NavLink to="/restaurants" className={navLinkClasses}>
          Restaurants
        </NavLink>
      </nav>

      {/* Auth buttons or current user */}
      {isAuthenticated() ? (
        <CurrentUser />
      ) : (
        <div className="flex gap-3">
          <Link
            to="/signup"
            className="px-5 py-2 rounded-full border border-red-500 text-red-500 font-semibold hover:bg-red-50 transition"
          >
            Sign Up
          </Link>
          <Link
            to="/signin"
            className="px-5 py-2 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition"
          >
            Sign In
          </Link>
        </div>
      )}
    </header>
  );
};

export const BasicHeader: FC = () => {
  return (
    <header className="bg-white shadow-md px-6 py-4 flex items-center justify-between sticky top-0 z-50 h-20">
      <Link to="/" className="text-3xl font-bold text-red-600 ">
        EnatBet
      </Link>

      <nav className="hidden md:flex gap-6">
        <NavLink to="/" className={navLinkClasses}>
          Home
        </NavLink>
        <NavLink to="/about" className={navLinkClasses}>
          About
        </NavLink>
        <NavLink to="/restaurants" className={navLinkClasses}>
          Restaurants
        </NavLink>
      </nav>

      {isAuthenticated() ? (
        <CurrentUser />
      ) : (
        <div className="flex gap-3">
          <Link
            to="/signup"
            className="px-5 py-2 rounded-full border border-red-500 text-red-500 font-semibold hover:bg-red-50 transition"
          >
            Sign Up
          </Link>
          <Link
            to="/signin"
            className="px-5 py-2 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition"
          >
            Sign In
          </Link>
        </div>
      )}
    </header>
  );
};
