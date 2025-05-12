import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"; // Assuming these are shadcn/ui-like components
import { useGetCurrentUserQuery } from "@/redux/api/authApi";
import {
  Home,
  Settings,
  Utensils,
  Users,
  BellElectricIcon,
  Contact,
  FormInputIcon,
  HotelIcon,
  LucideBike, // Assuming CarIcon was a typo or not used
} from "lucide-react";
import { NavLink } from "react-router-dom";
type MenuItemType = {
  title: string;
  url: string;
  icon: React.ElementType; // Use React.ElementType for component icons
};

type RoleGroupItemType = {
  role: string;
  items: MenuItemType[];
};

function AppSidebar() {
  const { data: user } = useGetCurrentUserQuery(undefined);
  const roles: string[] = user?.role || [];

  const baseItems: MenuItemType[] = [
    { title: "Home", url: "/", icon: Home },
    { title: "Profile", url: "/profile", icon: Contact },
    { title: "Restaurants", url: "/restaurants", icon: HotelIcon },
    { title: "Settings", url: "/settings", icon: Settings },
  ];

  const ownerItems: RoleGroupItemType[] = [
    {
      role: "restaurant_owner",
      items: [
        {
          title: "My Restaurant", // More specific title
          url: "/restaurant-management/#create",
          icon: Utensils,
        },
        {
          title: "Restaurant Orders",
          url: "/restaurant-orders",
          icon: BellElectricIcon,
        },
      ],
    },
  ];

  const deliveryPersonItems: RoleGroupItemType[] = [
    {
      role: "delivery_person",
      items: [
        {
          title: "My Deliveries",
          url: "/deliveries/delivery-person",
          icon: LucideBike,
        },
      ],
    },
  ];
  const adminItems: RoleGroupItemType[] = [
    {
      role: "admin",
      items: [
        { title: "Manage Users", url: "/user-management", icon: Users },
        {
          title: "Restaurant Apps", // Shorter title
          url: "/restaurant-applications",
          icon: FormInputIcon,
        },
      ],
    },
  ];

  const customerItems: RoleGroupItemType[] = [
    {
      role: "customer",
      items: [
        { title: "My Orders", url: "/orders", icon: BellElectricIcon },
        {
          title: "Track Deliveries",
          url: "/deliveries/customer",
          icon: LucideBike,
        },
      ],
    },
  ];

  const renderMenuItem = (item: MenuItemType) => (
    <SidebarMenuItem key={item.title}>
      {/* Use asChild if SidebarMenuItem can pass props down to NavLink */}
      <NavLink
        to={item.url}
        className={({ isActive }) =>
          `flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-150 ease-in-out
           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
           ${
             isActive
               ? "bg-primary text-primary-foreground shadow-sm" // Active: Primary background, contrasting text
               : "text-muted-foreground hover:bg-accent hover:text-accent-foreground" // Inactive: Muted text, accent on hover
           }`
        }
      >
        <item.icon className="h-5 w-5 shrink-0" />
        <span className="whitespace-nowrap truncate">{item.title}</span>
      </NavLink>
    </SidebarMenuItem>
  );

  const renderRoleGroup = (
    label: string,
    roleSpecificItems: RoleGroupItemType[]
  ) => {
    const filteredItems = roleSpecificItems
      .filter((group) => roles.includes(group.role))
      .flatMap((group) => group.items);

    if (!filteredItems.length) return null;

    return (
      <SidebarGroup>
        <SidebarGroupLabel className="px-4 pt-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider hidden md:block">
          {label}
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu className="space-y-1 px-2 pt-4 md:px-3">
            {filteredItems.map(renderMenuItem)}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  };

  return (
    <Sidebar
      className="[--sidebar-width:16rem] border-r bg-card text-card-foreground" // Added border and background
    >
      {/* Optional: App Name / Logo Area */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        <NavLink to="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold hidden md:inline">
            EnatBet
          </span>
        </NavLink>
        <div className="md:hidden">
          {" "}
          {/* Show trigger only on mobile if logo area takes space */}
          <SidebarTrigger />
        </div>
      </div>

      <SidebarContent className="flex-grow overflow-y-auto py-3">
        {/* General Items Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 pt-4 pb-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider hidden md:block">
            General
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2 md:px-3">
              {baseItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Role-Specific Groups */}
        {renderRoleGroup("Restaurant", ownerItems)}
        {renderRoleGroup("Administration", adminItems)}
        {renderRoleGroup("My Account", customerItems)}
        {renderRoleGroup("Delivery Tasks", deliveryPersonItems)}
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
