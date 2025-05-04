import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateRestaurantForm from "@/components/CreateRestaurantForm";
import MyRestaurants from "@/components/MyRestaurants";
import RestaurantMenus from "@/components/RestaurantMenus";
import { useEffect, useState } from "react";

const RestaurantManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabFromPath = location.pathname.split("/").pop() || "create";

  const [tab, setTab] = useState(tabFromPath);

  useEffect(() => {
    setTab(tabFromPath);
  }, [tabFromPath]);

  const handleTabChange = (value: string) => {
    setTab(value);
    navigate(`/restaurant-management/#${value}`);
  };

  return (
    <div className="p-4">
      <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="h-12 w-2/3">
          <TabsTrigger value="create">Create Restaurant</TabsTrigger>
          <TabsTrigger value="mine">My Restaurants</TabsTrigger>
          <TabsTrigger value="menus">Menus</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <CreateRestaurantForm />
        </TabsContent>

        <TabsContent value="mine">
          <MyRestaurants />
        </TabsContent>

        <TabsContent value="menus">
          <RestaurantMenus />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RestaurantManagement;
