import { useGetTopRestaurantsQuery } from "@/redux/api/ratingApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

const TopRestaurants = () => {
  const { data, isLoading, error } = useGetTopRestaurantsQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Failed to load top restaurants.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="grid gap-6 mt-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {data?.length === 0 && (
          <div className="text-center text-gray-500">
            No top-rated restaurants found.
          </div>
        )}
        {data?.map((restaurant) => (
          <Card
            key={restaurant._id}
            className="pt-0 overflow-hidden w-72 rounded-2xl shadow-md hover:shadow-lg transition-shadow"
          >
            {restaurant.logo && (
              <img
                src={restaurant.logo}
                alt={`${restaurant.name} logo`}
                className="h-40 w-full object-cover"
              />
            )}
            <CardHeader>
              <CardTitle className="text-lg">{restaurant.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700">
              <p>
                <strong>Address:</strong> {restaurant.location?.address || "N/A"}
              </p>
              <div className="flex items-center gap-1">
                <strong>Rating:</strong>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.round(restaurant.rating) ? "#facc15" : "none"}
                    stroke="#facc15"
                  />
                ))}
                <span className="ml-1 text-xs text-gray-500">
                  ({restaurant.rating?.toFixed(1) ?? "0.0"})
                </span>
              </div>
              <Link to={`/restaurants/${restaurant._id}`}>
                <Button size="sm" className="w-full mt-3">
                  View & Order
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TopRestaurants;
