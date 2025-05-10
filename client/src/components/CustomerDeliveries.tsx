import { useState } from "react";
import { useGetCustomerDeliveriesQuery } from "@/redux/api/deliveryApi";
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
import { Toaster } from "sonner";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Link } from "react-router-dom";

const CustomerDeliveries = () => {
  const [page, setPage] = useState(1);
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);

  const { data, isLoading, isError } = useGetCustomerDeliveriesQuery({
    page,
    limit: 5,
  });

  const deliveries = data?.data || [];
  const totalPages = data?.pagination?.total || 1;

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
        You have no deliveries yet.
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
              <strong>Delivery Person:</strong>{" "}
              <div className="flex gap-2 items-center">
                <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full text-xl text-gray-700">
                  {delivery.deliveryPersonId?.profileImage ? (
                    <img
                      src={delivery.deliveryPersonId?.profileImage}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    delivery.deliveryPersonId?.name?.charAt(0)?.toUpperCase()
                  )}
                </div>
                {delivery.deliveryPersonId.name || "Not Assigned"}
              </div>
              <p>
                <strong>Estimated Delivery Time:</strong>{" "}
                {new Date(delivery.estimatedDeliveryTime).toLocaleString()}
              </p>
            </div>

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

export default CustomerDeliveries;
