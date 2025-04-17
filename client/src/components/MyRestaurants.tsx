import { useGetAllMineRestaurantQuery } from "@/api/restaurantApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const MyRestaurants = () => {
  const { data, isLoading, error } = useGetAllMineRestaurantQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">Failed to load your restaurants.</div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-500">You haven't created any restaurants yet.</div>
    );
  }

  return (
    <div className="grid gap-4 mt-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {data?.data?.map((restaurant) => (
        <Card key={restaurant._id}>
          <CardHeader>
            <CardTitle>{restaurant.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Address:</strong> {restaurant.location.address}</p>
            <p><strong>Lat:</strong> {restaurant.location.coordinates[1]}</p>
            <p><strong>Lng:</strong> {restaurant.location.coordinates[0]}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MyRestaurants;
