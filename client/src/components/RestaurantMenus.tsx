import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllMineRestaurantQuery } from "@/api/restaurantApi";
import { useGetMenusByRestaurantQuery } from "@/api/menuApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import CreateMenuForm from "@/components/CreateMenuForm";

const RestaurantMenusWithCreate = () => {
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    data: restaurantsData,
    isLoading: isLoadingRestaurants,
    isError: isRestaurantError,
  } = useGetAllMineRestaurantQuery({page: 1, limit: 100});

  const {
    data: menus,
    isLoading: isLoadingMenus,
    isError: isMenusError,
  } = useGetMenusByRestaurantQuery(selectedRestaurantId!, {
    skip: !selectedRestaurantId,
  });

  if (isRestaurantError) toast.error("Failed to load restaurants");
  if (isMenusError) toast.error("Failed to load menus");

  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-2xl font-semibold">Select Restaurant</h2>
        <Select onValueChange={(value) => setSelectedRestaurantId(value)}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder={isLoadingRestaurants ? "Loading..." : "Select Restaurant"} />
          </SelectTrigger>
          <SelectContent>
            {restaurantsData?.data?.map((restaurant) => (
              <SelectItem key={restaurant._id} value={restaurant._id}>
                {restaurant.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Menus List */}
      {selectedRestaurantId && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Menus</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoadingMenus ? (
              [...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-xl" />
              ))
            ) : menus?.menus.length === 0 ? (
              <p className="text-gray-500 col-span-full">No menus found for this restaurant.</p>
            ) : (
              menus?.menus.map((menu: any) => (
                <Card
                  key={menu._id}
                  onClick={() => navigate(`/menu/${menu._id}`)}
                  className="cursor-pointer hover:shadow-lg transition-shadow duration-200 "
                >
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">{menu.menuName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Click to view details</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Menu Creation */}
      <div className="pt-6 border-t">
        <h2 className="text-2xl font-semibold mb-2">Create New Menu</h2>
        <CreateMenuForm
          selectedRestaurantId={selectedRestaurantId}
          onCreated={() => {
            toast.success("Menu created! Refreshing...");
          }}
        />
      </div>
    </div>
  );
};

export default RestaurantMenusWithCreate;
