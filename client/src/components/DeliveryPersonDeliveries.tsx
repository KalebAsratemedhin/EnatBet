import { useState } from "react";
import {
  useGetDeliveryPersonDeliveriesQuery,
  useUpdateDeliveryStatusMutation,
} from "@/redux/api/deliveryApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { DeliveryStatus } from "@/types/delivery";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import { Link } from "react-router-dom";

const DeliveryPersonDeliveries = () => {
  const [page, setPage] = useState(1);
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateDeliveryStatusMutation();
  const { data, isLoading, isError } = useGetDeliveryPersonDeliveriesQuery({
    page,
    limit: 5,
  });

  const deliveries = data?.data || [];
  const totalPages = data?.pagination?.total || 1;

  const handleStatusUpdate = async (
    deliveryId: string,
    status: DeliveryStatus
  ) => {
    try {
      const res = await updateStatus({ id: deliveryId, status }).unwrap();
      if (res.success) toast.success(`Status updated to ${status}`);
    } catch {
      toast.error("Failed to update delivery status");
    }
  };

  if (isLoading)
    return <p className="text-center mt-10">Loading your deliveries...</p>;

  if (isError)
    return (
      <p className="text-center text-red-500 mt-10">
        Failed to load deliveries.
      </p>
    );

  if (deliveries.length === 0)
    return (
      <p className="text-center text-gray-500 mt-10">
        You have no assigned deliveries.
      </p>
    );

  return (
    <div className="lg:max-w-4xl px-4 mx-auto py-10 space-y-6">
      <h2 className="text-3xl font-bold mb-6">My Deliveries</h2>

      {deliveries.map((delivery) => (
        <Card key={delivery._id} className="w-full shadow-lg">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span className="text-sm px-2 py-1 rounded-full bg-gray-100 capitalize">
                {delivery.status}
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">
            <div>
              <p>
                <strong>Restaurant: </strong>{" "}
                <Link
                  className="text-red-600"
                  to={`/restaurants/${delivery.orderId.restaurantID._id}`}
                >
                  {delivery.orderId.restaurantID.name}
                </Link>
              </p>
              <p>
                <strong>Customer:</strong> {delivery.orderId.customerID.name}
              </p>
              <p>
                <strong>Phone Number:</strong>{" "}
                {delivery.orderId.customerID.phoneNumber}
              </p>
              <p>
                <strong>Estimated Delivery Time:</strong>{" "}
                {new Date(delivery.estimatedDeliveryTime).toLocaleString()}
              </p>
            </div>

            <div className="flex gap-3 mt-4 flex-wrap">
              <Dialog>
                <DialogTrigger asChild>
                  <Button onClick={() => setSelectedDelivery(delivery)}>
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Delivery Details</DialogTitle>
                  </DialogHeader>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p>
                        <strong>Status:</strong> {delivery.status}
                      </p>

                      {delivery.orderId?.orderDetails?.length > 0 && (
                        <div className="pt-2">
                          <strong>Items:</strong>
                          <ul className="list-disc pl-5 space-y-1">
                            {delivery.orderId.orderDetails.map(
                              ({ item, quantity }: any) => (
                                <li key={item._id}>
                                  {item.name} x {quantity} — ETB{" "}
                                  {(item.price * quantity).toFixed(2)}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    </div>

                    {delivery.orderId?.coordinates && (
                      <div className="rounded-md overflow-hidden h-[250px]">
                        <MapContainer
                          center={[
                            delivery.orderId.coordinates.lat,
                            delivery.orderId.coordinates.lng,
                          ]}
                          zoom={15}
                          style={{ height: "100%", width: "100%" }}
                        >
                          <TileLayer
                            attribution="&copy; OpenStreetMap"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          <Marker
                            position={[
                              delivery.orderId.coordinates.lat,
                              delivery.orderId.coordinates.lng,
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
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Status update buttons */}
              {delivery.status === "assigned" && (
                <Button
                  onClick={() => handleStatusUpdate(delivery._id, "picked_up")}
                  disabled={isUpdating}
                >
                  Mark as Picked Up
                </Button>
              )}

              {delivery.status === "picked_up" && (
                <>
                  <Button
                    onClick={() =>
                      handleStatusUpdate(delivery._id, "delivered")
                    }
                    disabled={isUpdating}
                  >
                    Mark as Delivered
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleStatusUpdate(delivery._id, "failed")}
                    disabled={isUpdating}
                  >
                    Mark as Failed
                  </Button>
                </>
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

export default DeliveryPersonDeliveries;
