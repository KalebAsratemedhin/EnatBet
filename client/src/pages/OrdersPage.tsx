import { useState } from "react";
import {
  useGetCustomerOrdersQuery,
  useCancelOrderMutation,
} from "@/redux/api/orderApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast, Toaster } from "sonner";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const ORDERS_PER_PAGE = 5;

const OrdersPage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError , error} = useGetCustomerOrdersQuery({
    page,
    limit: ORDERS_PER_PAGE,
  });
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const handleCancel = async (orderId: string) => {
    try {
      const res = await cancelOrder(orderId).unwrap();
      if (res.success) {
        toast.success("Order cancelled successfully");
      }
    } catch {
      toast.error("Failed to cancel order");
    }
  };

  const orders = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  if (isLoading)
    return <p className="text-center mt-10">Loading your orders...</p>;

  if (isError){

    console.log('eror ', error);
    

    return (
      <p className="text-center text-red-500 mt-10">Failed to load orders.</p>
    );
  }

  if (orders.length === 0)
    return (
      <p className="text-center text-gray-500 mt-10">You have no orders.</p>
    );

  return (
    <div className="lg:max-w-4xl px-20 mx-auto py-10 space-y-6">
      <h2 className="text-3xl font-bold mb-6">My Orders</h2>

      {orders.map((order) => (
        <Card key={order._id} className="w-full shadow-lg">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Restaurant: {order.restaurantID.name}</span>
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
                .reduce(
                  (sum, { item, quantity }) => sum + item.price * quantity,
                  0
                )
                .toFixed(2)}
            </div>

            <div className="flex gap-3 mt-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button onClick={() => setSelectedOrder(order)}>
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Order Details</DialogTitle>
                  </DialogHeader>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p>
                        <strong>Address:</strong> {order.deliveryAddress}
                      </p>
                      <p>
                        <strong>Coordinates:</strong> {order.coordinates.lat},{" "}
                        {order.coordinates.lng}
                      </p>
                      <p>
                        <strong>Payment:</strong> {order.paymentMethod}
                      </p>

                      <div className="pt-2">
                        <strong>Items:</strong>
                        <ul className="list-disc pl-5 space-y-1">
                          {order.orderDetails.map(({ item, quantity }) => (
                            <li key={item._id}>
                              {item.name} x {quantity} — ETB{" "}
                              {(item.price * quantity).toFixed(2)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="rounded-md overflow-hidden h-[250px]">
                      <MapContainer
                        center={[order.coordinates.lat, order.coordinates.lng]}
                        zoom={15}
                        style={{ height: "100%", width: "100%" }}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker
                          position={[
                            order.coordinates.lat,
                            order.coordinates.lng,
                          ]}
                          icon={L.icon({
                            iconUrl:
                              "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                          })}
                        >
                          <Popup>Delivery Location</Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {order.status === "pending" && (
                <Button
                  variant="destructive"
                  disabled={isCancelling}
                  onClick={() => handleCancel(order._id)}
                >
                  Cancel Order
                </Button>
              )}
            </div>
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
              className={
                page === totalPages ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <Toaster />
    </div>
  );
};

export default OrdersPage;
