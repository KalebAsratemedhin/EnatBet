import { useEffect, useState } from "react";
import {
  useGetAllMineRestaurantQuery,
} from "@/api/restaurantApi";
import {
  useGetRestaurantOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/api/orderApi";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { log } from "console";
import { LogIn } from "lucide-react";

const ORDERS_PER_PAGE = 5;

const getNextStatus = (current: string): "preparing" | "ready" | null => {
  switch (current) {
    case "pending":
      return "preparing";
    case "preparing":
      return "ready";
    default:
      return null;
  }
};

const RestaurantOrdersPage = () => {
  const [page, setPage] = useState(1);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);

  const {
    data: restaurantsData,
    isLoading: isLoadingRestaurants,
    isError: isRestaurantError,
  } = useGetAllMineRestaurantQuery({ page: 1, limit: 100 });

  const {
    data: ordersData,
    isLoading,
    isError,
  } = useGetRestaurantOrdersQuery(
    { restaurantId: selectedRestaurantId!, page, limit: ORDERS_PER_PAGE },
    { skip: !selectedRestaurantId }
  );

  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  const orders = ordersData?.data || [];
  const totalPages = ordersData?.pagination?.totalPages || 1;

  const handleStatusUpdate = async (orderId: string, currentStatus: "pending" | "preparing" | "ready" | "cancelled") => {
    const nextStatus = getNextStatus(currentStatus);
    if (!nextStatus) return;

    try {
      const res = await updateStatus({ id: orderId, status: nextStatus }).unwrap();
      if (res.success) {
        toast.success(`Order status updated to ${nextStatus}`);
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (isRestaurantError) toast.error("Failed to load restaurants");
  if (isError) toast.error("Failed to load orders");



  return (
    <div className="lg:max-w-4xl px-6 mx-auto py-10 space-y-6">
      <h2 className="text-3xl font-bold mb-4">Restaurant Orders</h2>

      {/* Restaurant Selector */}
      <div>
        <h3 className="text-lg font-medium mb-2">Select Restaurant</h3>
        <Select onValueChange={(value) => setSelectedRestaurantId(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={isLoadingRestaurants ? "Loading..." : "Select a restaurant"} />
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

      {/* Orders List */}
      {selectedRestaurantId && (
        <>
          {isLoading ? (
            <p className="text-center mt-10">Loading restaurant orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">
              No orders for this restaurant.
            </p>
          ) : (
            <>
              {orders.map((order) => (
                <Card key={order._id} className="w-full shadow-md">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Customer: {order.customerID?.name || "N/A"}</span>
                      <span className="text-sm px-2 py-1 rounded-full bg-gray-100 capitalize">
                        {order.status}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <strong>Delivery Address:</strong> {order.deliveryAddress}
                    </div>
                    <div>
                      <strong>Total:</strong> ETB{" "}
                      {order.orderDetails
                        .reduce((sum, { item, quantity }) => sum + item.price * quantity, 0)
                        .toFixed(2)}
                    </div>
                    <div>
                      <strong>Payment:</strong> {order.paymentMethod}
                    </div>
                    <div className="pt-2">
                      <strong>Items:</strong>
                      <ul className="list-disc pl-5 space-y-1">
                        {order.orderDetails.map(({ item, quantity }) => (
                          <li key={item._id}>
                            {item.name} x {quantity} — ETB {(item.price * quantity).toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {getNextStatus(order.status) && (
                      <Button
                        onClick={() => handleStatusUpdate(order._id, order.status)}
                        disabled={isUpdating}
                        className="mt-4"
                      >
                        Mark as {getNextStatus(order.status)}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}

              <Pagination className="justify-center pt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      className={page === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  <PaginationItem className="px-4 text-center">
                    {page} / {totalPages}
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                      className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default RestaurantOrdersPage;
