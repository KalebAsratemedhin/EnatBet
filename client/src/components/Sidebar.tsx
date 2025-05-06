import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useGetCurrentUserQuery } from "@/redux/api/authApi";
import {
  Home,
  Settings,
  Utensils,
  Users,
  BellElectricIcon,
  Contact,
  CheckCircle2Icon,
  FormInputIcon,
  HotelIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";

function AppSidebar() {
  const { data: user } = useGetCurrentUserQuery(undefined);
  const roles: string[] = user?.role || [];

  const baseItems = [
    { title: "Home", url: "/", icon: Home },
    { title: "Profile", url: "/profile", icon: Contact },
    { title: "Settings", url: "/settings", icon: Settings },
    {
      title: "Role Management",
      url: "/role-management",
      icon: CheckCircle2Icon,
    },
    { title: "Restaurants", url: "/restaurants", icon: HotelIcon },
  ];

  const ownerItems = [
    {
      role: "restaurant_owner",
      items: [
        {
          title: "Restaurant Management",
          url: "/restaurant-management",
          icon: Utensils,
        },
        { title: "Orders", url: "/restaurant-orders", icon: BellElectricIcon },
      ],
    },
  ];

  const adminItems = [
    {
      role: "admin",
      items: [
        { title: "Manage Users", url: "/users", icon: Users },
        {
          title: "Restaurant Applications",
          url: "/restaurant-applications",
          icon: FormInputIcon,
        },
      ],
    },
  ];

  const customerItems = [
    {
      role: "customer",
      items: [{ title: "Orders", url: "/orders", icon: BellElectricIcon }],
    },
  ];

  const renderMenuItem = (item: { title: string; url: string; icon: any }) => (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton>
        <NavLink
          to={item.url}
          className={({ isActive }) =>
            `flex items-center gap-2 py-2 text-[15px] rounded hover:bg-muted transition-colors ${
              isActive ? "text-red-500 font-semibold" : ""
            }`
          }
        >
          <item.icon className="w-5 h-5 shrink-0" />
          <span className="whitespace-nowrap">{item.title}</span>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  const renderRoleGroup = (
    label: string,
    items: {
      role: string;
      items: { title: string; url: string; icon: any }[];
    }[]
  ) => {
    const filteredItems = items
      .filter((group) => roles.includes(group.role))
      .flatMap((group) => group.items);
    if (!filteredItems.length) return null;

    return (
      <SidebarGroup>
        <SidebarGroupLabel className="text-lg px-3 hidden md:block">
          {label}
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>{filteredItems.map(renderMenuItem)}</SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  };

  return (
    <Sidebar collapsible="icon" className="[--sidebar-width:16rem]">
      <div className="flex justify-end p-2">
        <SidebarTrigger />
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg px-3 hidden md:block">
            General
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{baseItems.map(renderMenuItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {renderRoleGroup("Restaurant Owner", ownerItems)}
        {renderRoleGroup("Admin", adminItems)}
        {renderRoleGroup("Customer", customerItems)}
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
