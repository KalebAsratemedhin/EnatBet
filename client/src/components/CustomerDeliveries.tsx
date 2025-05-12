import { useState } from "react";
import { useGetCustomerDeliveriesQuery } from "@/redux/api/deliveryApi";
import { useRateEntityMutation } from "@/redux/api/ratingApi";
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
import { Toaster, toast } from "sonner";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

const DeliveryPersonRating = ({
  deliveryPersonId,
  currentRating,
}: {
  deliveryPersonId: string;
  currentRating: number;
}) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [rateEntity] = useRateEntityMutation();

  const handleRate = async (value: number) => {
    try {
      await rateEntity({
        entityType: "Delivery_Person",
        entityId: deliveryPersonId,
        rating: value,
      }).unwrap();
      toast.success(`Rated delivery person ${value} stars!`);
    } catch {
      toast.error("Failed to rate delivery person.");
    }
  };

  return (
    <div className="flex items-center gap-1 mt-1 text-yellow-500 text-sm">
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
              : value <= Math.round(currentRating)
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
        ({currentRating?.toFixed(1) || 0})
      </span>
    </div>
  );
};

const CustomerDeliveries = () => {
  const [page, setPage] = useState(1);

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

      {deliveries.map((delivery) => {
        const deliveryPerson = delivery.deliveryPersonId?.userId;
        return (
          <Card
            key={delivery._id}
            className="w-full shadow-md border border-gray-200 rounded-xl pt-0"
          >
            <CardHeader className="bg-gray-50 rounded-t-xl px-5 py-6">
              <CardTitle className="flex justify-between items-center text-sm text-gray-700">
                <span className="capitalize px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">
                  {delivery.status}
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-5 space-y-3">
              <div>
                <p className="text-sm text-gray-700">
                  <strong>Restaurant:</strong>{" "}
                  <Link
                    className="text-red-600 underline"
                    to={`/restaurants/${delivery.orderId.restaurantID._id}`}
                  >
                    {delivery.orderId.restaurantID.name}
                  </Link>
                </p>

                <div className="mt-2">
                  <strong className="text-sm">Delivery Person:</strong>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-700 text-lg">
                      {deliveryPerson?.profileImage ? (
                        <img
                          src={deliveryPerson.profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        deliveryPerson?.name?.charAt(0)?.toUpperCase()
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {deliveryPerson?.name || "Not Assigned"}
                      </span>
                      {deliveryPerson?._id && (
                        <DeliveryPersonRating
                          deliveryPersonId={delivery.deliveryPersonId._id}
                          currentRating={delivery.deliveryPersonId.rating || 0}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <p className="mt-2 text-sm text-gray-700">
                  <strong>Estimated Delivery Time:</strong>{" "}
                  {new Date(delivery.estimatedDeliveryTime).toLocaleString()}
                </p>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
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
        );
      })}

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
