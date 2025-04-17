import { useAddRestaurantMutation } from "@/api/restaurantApi";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Circle } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const restaurantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  deliveryAreaRadius: z.coerce.number().min(1, "Radius must be greater than 0"),
});

type FormData = z.infer<typeof restaurantSchema>;

const CreateRestaurantForm = () => {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(restaurantSchema),
  });

  const [addRestaurant, { isLoading }] = useAddRestaurantMutation();
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [radius, setRadius] = useState<number | null>(null);

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        name: data.name,
        location: {
          coordinates: [data.longitude, data.latitude],
          address: data.address,
        },
        deliveryAreas:  data.deliveryAreaRadius,
        promotion: [],
      };

      await addRestaurant(payload).unwrap();
      toast.success("Restaurant created successfully");
      reset();
      setPosition(null);
      setRadius(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        setValue("latitude", e.latlng.lat);
        setValue("longitude", e.latlng.lng);
      },
    });

    return position === null ? null : (
      <Marker position={position}>
        <Popup>Restaurant location</Popup>
      </Marker>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4 max-w-md">
      <Input {...register("name")} placeholder="Restaurant Name" />
      {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

      <Input {...register("address")} placeholder="Address" />
      {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}

      <div style={{ height: '400px', width: '100%' }}>
        <MapContainer
          style={{ height: "100%", width: "100%" }}
          center={{ lat: 9.678112707591637, lng: 39.532579779624946 }}
          zoom={8}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker />
          {position && radius !== null && (
            <Circle
              center={position}
              radius={radius}
              pathOptions={{ color: "blue", fillColor: "blue", fillOpacity: 0.2 }}
            />
          )}
        </MapContainer>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Input {...register("latitude")} type="number" step="any" placeholder="Latitude" />
          {errors.latitude && <p className="text-red-500 text-sm">{errors.latitude.message}</p>}
        </div>
        <div>
          <Input {...register("longitude")} type="number" step="any" placeholder="Longitude" />
          {errors.longitude && <p className="text-red-500 text-sm">{errors.longitude.message}</p>}
        </div>
      </div>

      <div>
        <Input
          {...register("deliveryAreaRadius")}
          type="number"
          step="any"
          placeholder="Delivery Area Radius (meters)"
          onChange={(e) => setRadius(Number(e.target.value))}
        />
        {errors.deliveryAreaRadius && <p className="text-red-500 text-sm">{errors.deliveryAreaRadius.message}</p>}
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Restaurant"}
      </Button>

      <Toaster />
    </form>
  );
};

export default CreateRestaurantForm;
