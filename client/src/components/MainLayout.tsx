import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
        <main className="flex-1 mx-4 md:mx-10 px-4 py-6">
          <Outlet />
        </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
