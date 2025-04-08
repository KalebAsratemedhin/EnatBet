import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const AuthLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex flex-1">
        {/* Fixed Sidebar */}
        <aside className="hidden md:block w-2/12 bg-gray-100 h-[calc(100vh-40px)] fixed top-20 left-0">
          <Sidebar />
        </aside>

        {/* Main content shifted to the right of the fixed sidebar */}
        <main className="ml-0 md:ml-[16.666667%] w-full md:w-[83.333333%] overflow-y-auto px-4 py-6 mx-4 md:mx-10">
          <Outlet />
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;
