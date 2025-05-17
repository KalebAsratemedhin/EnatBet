import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetTopMenuItemsQuery, useRateEntityMutation } from "@/redux/api/ratingApi";
import { useDispatch } from "react-redux";
import { add } from "@/redux/cartSlice";
import { toast, Toaster } from "sonner";
import { isAuthenticated } from "@/utils/auth";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
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
    <div className="p-4 md:p-8 max-w-7xl mx-auto ">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />

        <CarouselContent className="-ml-4">
          {data?.map((item) => (
            <CarouselItem
              key={item._id}
              className="pl-4 md:basis-1/2 lg:basis-1/3"
            >
              <Card className="h-full rounded-xl overflow-hidden shadow pt-0  pb-4">
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
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
      </Carousel>
      <Toaster />
    </div>
  );
};

export default TopMenuItems;
