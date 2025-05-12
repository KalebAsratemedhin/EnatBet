import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import { PopulatedDelivery } from "@/types/delivery";

const DeliveryDetailsPage = ({ delivery }: { delivery: PopulatedDelivery }) => {
  useEffect(() => {
    if (delivery) {
      const { restaurantID } = delivery.orderId;
      const { coordinates } = delivery.orderId;

      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(
            restaurantID.location.coordinates[0],
            restaurantID.location.coordinates[1]
          ),
          L.latLng(coordinates.lat, coordinates.lng),
        ],
        routeWhileDragging: false,
        draggableWaypoints: false,
        createMarker: () => null, // no default markers
      });

      const map = L.map("map").setView(
        [
          restaurantID.location.coordinates[0],
          restaurantID.location.coordinates[0],
        ],
        13
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(map);

      routingControl.addTo(map);

      return () => {
        map.remove();
      };
    }
  }, [delivery]);

  if (!delivery) return null;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-4">
      <h1 className="text-2xl font-bold">Delivery Route</h1>
      <div id="map" className="h-[500px] rounded-md overflow-hidden" />
    </div>
  );
};

export default DeliveryDetailsPage;
