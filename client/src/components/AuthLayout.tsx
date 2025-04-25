import { Outlet } from "react-router-dom";
import AppSidebar from "./Sidebar";
import {AuthHeader} from "./Header";
import { SidebarProvider } from "./ui/sidebar";

const AuthLayout = () => {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1  relative">
          <AuthHeader />
          <Outlet />
        </main>
      </SidebarProvider>
    </>
  );
};

export default AuthLayout;
