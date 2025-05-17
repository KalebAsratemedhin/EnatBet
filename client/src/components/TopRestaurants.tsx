import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useGetTopRestaurantsQuery } from "@/redux/api/ratingApi";

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
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {data?.map((restaurant) => (
            <CarouselItem
              key={restaurant._id}
              className="pl-4 md:basis-1/2 lg:basis-1/3"
            >
              <Card className="h-full overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-shadow pt-0">
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
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
      </Carousel>
    </div>
  );
};

export default TopRestaurants;
