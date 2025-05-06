import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetRestaurantByIdQuery } from "@/redux/api/restaurantApi";
import { Loader2, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MapContainer, TileLayer, Marker, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { toast } from "sonner";
import { PopulatedRestaurant } from "@/types/restaurant";
import MenusCarousel from "./MenusCarousel";
import Cart from "./Cart";

const RestaurantDetails = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetRestaurantByIdQuery(id!);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="text-center text-red-500">
        Failed to load restaurant details.
      </div>
    );
  }

  const restaurant = data.data;
  const lat = restaurant.location?.coordinates[0];
  const lng = restaurant.location?.coordinates[1];

  return (
    <div className="mx-12 md:px-8 py-10 space-y-10">
      <div className="flex gap-8 flex-col lg:flex-row justify-between">
        <RestaurantHeader restaurant={restaurant} />
        <div className="h-[500px] w-full lg:w-1/2 rounded-2xl overflow-hidden shadow-md">
          <MapContainer
            center={{ lat, lng }}
            zoom={15}
            style={{ height: "100%", width: "100%", zIndex: "0" }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={{ lat, lng }}>
              <Popup>{restaurant.name}</Popup>
            </Marker>
            <Circle
              center={{ lat, lng }}
              radius={restaurant.deliveryAreaRadius}
              pathOptions={{
                color: "blue",
                fillColor: "blue",
                fillOpacity: 0.2,
              }}
            />
          </MapContainer>
        </div>
      </div>

      {isAuthenticated() && <Cart restaurantId={restaurant._id} />}

      <div>
        <h2 className="text-2xl font-semibold mb-4">Menu</h2>
        <MenusCarousel restaurantId={id!} />
      </div>
    </div>
  );
};

export default RestaurantDetails;

import {
  useRateEntityMutation,
  useGetRatingForEntityQuery,
} from "@/redux/api/ratingApi";
import { isAuthenticated } from "@/utils/auth";

const RestaurantHeader = ({
  restaurant,
}: {
  restaurant: PopulatedRestaurant;
}) => {
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { data } = useGetRatingForEntityQuery({
    entityType: "Restaurant",
    entityId: restaurant._id,
  });

  const [rateEntity] = useRateEntityMutation();

  const handleRate = async (rating: number) => {
    setSubmitting(true);
    try {
      await rateEntity({
        entityType: "Restaurant",
        entityId: restaurant._id,
        rating,
      }).unwrap();
      setUserRating(rating);
      toast.success("Thanks for your rating!");
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.data?.error || "Rating submission failed.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-col justify-between items-center lg:w-1/2 h-full">
      <div className="space-y-1 lg:w-3/5 flex gap-4">
        <img
          className="w-60 h-60 rounded-full"
          src={restaurant.logo}
          alt="restaurant logo"
        />
        <div className="mt-20">
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            {restaurant.name}
            <Badge className="text-sm capitalize">{restaurant.status}</Badge>
          </h1>
          <p className="text-gray-600 text-lg">
            {restaurant.location?.address}
          </p>
          <p className="text-sm text-gray-500">
            Delivery Radius: {restaurant.deliveryAreaRadius} meters
          </p>
          <div className="flex items-center gap-1 text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={20}
                fill={i < Math.round(restaurant.rating) ? "#facc15" : "none"}
                stroke="#facc15"
              />
            ))}
            <span className="ml-2 text-sm text-gray-500">
              ({restaurant.rating.toFixed(1)})
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <hr className="text-gray-500 mb-8" />
        {isAuthenticated() ? (
          <p className="text-sm font-medium text-gray-700 mb-1">Your Rating:</p>
        ) : (
          <p className="text-lg font-bold text-gray-800 mb-1">
            {" "}
            Signin or signup to rate this restaurant
          </p>
        )}
        {isAuthenticated() && (
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => {
              const index = i + 1;
              return (
                <Star
                  key={i}
                  size={24}
                  className="cursor-pointer"
                  fill={
                    index <= (hoverRating ?? userRating ?? data?.rating)
                      ? "#facc15"
                      : "none"
                  }
                  stroke="#facc15"
                  onMouseEnter={() => setHoverRating(index)}
                  onMouseLeave={() => setHoverRating(null)}
                  onClick={() => handleRate(index)}
                />
              );
            })}
          </div>
        )}
        {submitting && (
          <span className="text-sm text-muted-foreground ml-2">
            Submitting...
          </span>
        )}
      </div>
    </div>
  );
};
