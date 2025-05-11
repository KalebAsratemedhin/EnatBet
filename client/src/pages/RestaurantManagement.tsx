import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateRestaurantForm from "@/components/CreateRestaurantForm";
import MyRestaurants from "@/components/MyRestaurants";
import RestaurantMenus from "@/components/RestaurantMenus";
import { useEffect, useState } from "react";

const RestaurantManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tabFromPath = location.hash.replace("#", "") || "create";
  const [tab, setTab] = useState(tabFromPath);

  useEffect(() => {
    setTab(tabFromPath);
  }, [tabFromPath]);

  const handleTabChange = (value: string) => {
    setTab(value);
    navigate(`/restaurant-management/#${value}`);
  };

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-5xl space-y-6 mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Restaurant Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your restaurants, menus, and create new listings.
          </p>
        </div>

        <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
          <div className="flex justify-center">
            <TabsList className="bg-background border shadow-sm w-full h-12 rounded-xl p-1 flex justify-between">
              <TabsTrigger
                value="create"
                className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg"
              >
                Create
              </TabsTrigger>
              <TabsTrigger
                value="mine"
                className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg"
              >
                My Restaurants
              </TabsTrigger>
              <TabsTrigger
                value="menus"
                className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg"
              >
                Menus
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-6 mx-auto min-w-10/12">
            <TabsContent value="create" className="animate-in fade-in-0">
              <CreateRestaurantForm />
            </TabsContent>

            <TabsContent value="mine" className="animate-in fade-in-0">
              <MyRestaurants />
            </TabsContent>

            <TabsContent value="menus" className="animate-in fade-in-0">
              <RestaurantMenus />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default RestaurantManagement;
