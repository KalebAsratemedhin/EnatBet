import { useGetTopMenuItemsQuery, useRateEntityMutation } from "@/redux/api/ratingApi";
import { useDispatch } from "react-redux";
import { add } from "@/redux/cartSlice";
import { toast, Toaster } from "sonner";
import { isAuthenticated } from "@/utils/auth";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { MenuItem } from "@/types/menu";
import { Link } from "react-router-dom";

const MenuItemRating = ({ item }: { item: MenuItem }) => {
  const [rateEntity] = useRateEntityMutation();
  const [hovered, setHovered] = useState<number | null>(null);

  const handleRate = async (value: number) => {
    try {
      await rateEntity({
        entityType: "MenuItem",
        entityId: item._id,
        rating: value,
      }).unwrap();
      toast.success(`Rated ${value} stars!`);
    } catch {
      toast.error("Failed to rate item.");
    }
  };

  return (
    <div className="flex items-center gap-1 text-yellow-500 text-sm">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          size={18}
          className="cursor-pointer"
          fill={
            hovered != null
              ? value <= hovered
                ? "#facc15"
                : "none"
              : value <= Math.round(item.rating)
              ? "#facc15"
              : "none"
          }
          stroke="#facc15"
          onMouseEnter={() => setHovered(value)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => handleRate(value)}
        />
      ))}
      <span className="ml-1 text-xs text-gray-500">
        ({item.rating.toFixed(1)})
      </span>
    </div>
  );
};

const TopMenuItems = () => {
  const { data, isLoading, error } = useGetTopMenuItemsQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("TopMenuItems:", data, isLoading, error);
  }, [data]);

  if (isLoading) return <p>Loading menu items...</p>;
  if (error) return <p>Failed to load menu items.</p>;

  return (
    <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
      {data?.map((item) => (
        <Card
          key={item._id}
          className="h-full rounded-xl w-60 md:w-auto max-w-3xl overflow-hidden shadow pt-0"
        >
          <img
            src={item?.itemPicture || "/default-dish.jpeg"}
            alt={item.name}
            className="w-full h-40 object-cover"
          />
          <CardContent className="p-4 space-y-1">
            <h4 className="text-base font-semibold truncate">{item.name}</h4>
            <p className="text-sm text-gray-600 truncate">{item.description}</p>
            <p className="text-sm font-bold text-gray-900">
              ETB {item.price.toFixed(2)}
            </p>

            {/* Restaurant Name and Link */}
            {item.restaurant && (
              <p className="text-xs text-blue-600 hover:underline">
                From:{" "}
                <Link to={`/restaurants/${item.restaurant._id}`}>
                  {item.restaurant.name}
                </Link>
              </p>
            )}

            <MenuItemRating item={item} />

            <Button
              className="mt-2"
              variant="default"
              onClick={() => {
                if (isAuthenticated()) {
                  dispatch(add({ item, restaurantId: item.restaurant._id }));
                } else {
                  toast.warning("Please sign in to add items to your cart");
                }
              }}
            >
              Add to order
            </Button>
          </CardContent>
        </Card>
      ))}
      <Toaster />
    </div>
  );
};

export default TopMenuItems;
