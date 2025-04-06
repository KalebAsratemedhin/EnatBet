import React, { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
        <main className="flex-1 mx-4 md:mx-10 px-4 py-6">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
