import { Outlet } from "react-router-dom";
import AppSidebar from "./Sidebar";
import { AuthHeader } from "./Header";
import { SidebarProvider } from "./ui/sidebar";

const AuthLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 w-full overflow-x-hidden">
          <AuthHeader />
          <div className="max-w-[100vw] px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
};

export default AuthLayout;
