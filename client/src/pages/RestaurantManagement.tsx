import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateRestaurantForm from "@/components/CreateRestaurantForm";
import MyRestaurants from "@/components/MyRestaurants";
import RestaurantMenus from "@/components/RestaurantMenus";

const RestaurantManagement = () => {
  return (
    <div className="p-4">
        <Tabs defaultValue="create" className="w-full">
            <TabsList>
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
            {/* <CreateMenuForm /> */}
              <RestaurantMenus />
            </TabsContent>
        </Tabs>
 
    </div>
  );
};

export default RestaurantManagement;



