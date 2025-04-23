import { useGetAllMineRestaurantQuery, useDeleteRestaurantMutation } from "@/api/restaurantApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Star, Edit, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import UpdateRestaurantForm from "../components/UpdateRestaurantForm"; 
import { Dialog, DialogTrigger, DialogContent, DialogFooter } from "@/components/ui/dialog";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  disapproved: "bg-red-100 text-red-800",
  inactive: "bg-gray-100 text-gray-800",
};

const MyRestaurants = () => {
  const { data, isLoading, error } = useGetAllMineRestaurantQuery();
  const [deleteRestaurant] = useDeleteRestaurantMutation();
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any | null>(null); // For updating a restaurant
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [restaurantToDelete, setRestaurantToDelete] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!restaurantToDelete) return;

    try {
      await deleteRestaurant(restaurantToDelete).unwrap();
      toast.success("Restaurant deleted successfully");
      setIsConfirmDeleteOpen(false); // Close the confirmation dialog
      setRestaurantToDelete(null); // Clear the selected restaurant
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete restaurant");
    }
  };

  const handleUpdateClick = (restaurant: any) => {
    setSelectedRestaurant(restaurant);
    setIsUpdateDialogOpen(true);
  };

  const handleDeleteClick = (restaurantId: string) => {
    setRestaurantToDelete(restaurantId);
    setIsConfirmDeleteOpen(true); // Open the confirmation dialog
  };

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

  if (!data || data.data.length === 0) {
    return (
      <div className="text-center text-gray-500">You haven't created any restaurants yet.</div>
    );
  }

  return (
    <>
      <div className="grid gap-6 mt-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {data.data.map((restaurant) => (
          <Card key={restaurant._id} className="overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-shadow">
            {restaurant.logo && (
              <img
                src={restaurant.logo}
                alt={`${restaurant.name} logo`}
                className="h-40 w-full object-cover"
              />
            )}
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{restaurant.name}</CardTitle>
                <Badge className={cn("capitalize", statusColors[restaurant.status])}>
                  {restaurant.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700">
              <p><strong>Address:</strong> {restaurant.location?.address}</p>
              <p>
                <strong>Coordinates:</strong>
                <span className="ml-1">
                  ({restaurant.location?.coordinates[1]}, {restaurant.location?.coordinates[0]})
                </span>
              </p>
              <p><strong>Delivery Radius:</strong> {restaurant.deliveryAreas} meters</p>
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
                <span className="ml-1 text-xs text-gray-500">({restaurant.rating.toFixed(1)})</span>
              </div>
              <div className="flex justify-between items-center mt-4">
                <Button
                  size="sm"
                  onClick={() => handleUpdateClick(restaurant)}
                  variant="outline"
                >
                  <Edit className="mr-2" size={16} />
                  Update
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleDeleteClick(restaurant._id)}
                  variant="destructive"
                >
                  <Trash className="mr-2" size={16} />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Update Restaurant Dialog */}
      {isUpdateDialogOpen && selectedRestaurant && (
        <UpdateRestaurantForm
          restaurant={selectedRestaurant}
          onClose={() => setIsUpdateDialogOpen(false)}
        />
      )}

      {/* ShadCN Confirmation Dialog */}
      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent>
          <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
          <p>Are you sure you want to delete this restaurant?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </>
  );
};

export default MyRestaurants;
