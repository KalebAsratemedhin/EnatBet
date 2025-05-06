import { useState } from "react";
import {
  useGetAllMineRestaurantQuery,
  useDeleteRestaurantMutation,
} from "@/redux/api/restaurantApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Star, Edit, Trash } from "lucide-react";
import { toast, Toaster } from "sonner";
import UpdateRestaurantForm from "../components/UpdateRestaurantForm";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

const LIMIT = 6;

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  disapproved: "bg-red-100 text-red-800",
  inactive: "bg-gray-100 text-gray-800",
};

const MyRestaurants = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, error } = useGetAllMineRestaurantQuery({
    page,
    limit: LIMIT,
  });

  const totalPages = data?.totalPages || 1;

  const [deleteRestaurant] = useDeleteRestaurantMutation();
  const [selectedRestaurant, setSelectedRestaurant] = useState<any | null>(
    null
  );
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [restaurantToDelete, setRestaurantToDelete] = useState<string | null>(
    null
  );

  const handleDelete = async () => {
    if (!restaurantToDelete) return;
    try {
      await deleteRestaurant(restaurantToDelete).unwrap();
      toast.success("Restaurant deleted successfully");
      setIsConfirmDeleteOpen(false);
      setRestaurantToDelete(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete restaurant");
    }
  };

  if (isLoading || isFetching) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Failed to load your restaurants.
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="text-center text-gray-500">
        You haven’t created any restaurants yet.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="grid gap-6 mt-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {data.data.map((restaurant) => (
          <Card
            key={restaurant._id}
            className="pt-0 w-72 overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-shadow"
          >
            {restaurant.logo && (
              <img
                src={restaurant.logo}
                alt={`${restaurant.name} logo`}
                className="h-40 w-full object-cover"
              />
            )}
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{restaurant.name}</CardTitle>
                <span
                  className={cn(
                    "text-xs px-2 py-1 rounded-md font-medium capitalize",
                    statusColors[restaurant.status]
                  )}
                >
                  {restaurant.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700">
              <p>
                <strong>Address:</strong> {restaurant.location?.address}
              </p>
              <p>
                <strong>Coordinates:</strong> (
                {restaurant.location?.coordinates[1]},{" "}
                {restaurant.location?.coordinates[0]})
              </p>
              <p>
                <strong>Delivery Radius:</strong>{" "}
                {restaurant.deliveryAreaRadius} meters
              </p>
              <div className="flex items-center gap-1">
                <strong>Rating:</strong>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={
                      i < Math.round(restaurant.rating) ? "#facc15" : "none"
                    }
                    stroke="#facc15"
                  />
                ))}
                <span className="ml-1 text-xs text-gray-500">
                  ({restaurant.rating.toFixed(1)})
                </span>
              </div>
              <div className="flex justify-between gap-2 pt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedRestaurant(restaurant);
                    setIsUpdateDialogOpen(true);
                  }}
                >
                  <Edit size={16} className="mr-1" />
                  Update
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    setRestaurantToDelete(restaurant._id);
                    setIsConfirmDeleteOpen(true);
                  }}
                >
                  <Trash size={16} className="mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious>
                <Button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  variant="outline"
                  size="sm"
                >
                  Previous
                </Button>
              </PaginationPrevious>
            </PaginationItem>
            <PaginationItem>
              <span className="text-sm text-muted-foreground px-4 py-2 border rounded-md">
                Page {page} of {totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext>
                <Button
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={page === totalPages}
                  variant="outline"
                  size="sm"
                >
                  Next
                </Button>
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {isUpdateDialogOpen && selectedRestaurant && (
        <UpdateRestaurantForm
          restaurant={selectedRestaurant}
          onClose={() => setIsUpdateDialogOpen(false)}
        />
      )}

      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent>
          <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
          <p>Are you sure you want to delete this restaurant?</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
};

export default MyRestaurants;
