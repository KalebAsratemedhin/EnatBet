import React from "react";
import {BasicHeader} from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <BasicHeader />
        <main className="flex-1">
          <Outlet />
        </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
