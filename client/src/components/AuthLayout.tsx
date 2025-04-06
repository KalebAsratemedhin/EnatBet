import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const AuthLayout: React.FC = () => {
  return (
    <div className="flex flex-col">
      <Header />

      <div className="flex flex-1 max-h-[calc(100vh-40px)]">
        {/* Fixed Sidebar */}
        <aside className="hidden md:block w-3/12 lg:w-2/12 bg-gray-100 h-[calc(100vh-40px)] ">
          <Sidebar />
        </aside>

        {/* Main content shifted to the right of the fixed sidebar */}
        <main className="w-full lg:w-9/12 overflow-y-auto py-6">
          <Outlet />
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;
