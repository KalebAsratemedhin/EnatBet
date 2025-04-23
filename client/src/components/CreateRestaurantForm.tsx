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

// Schema update
const restaurantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  deliveryAreaRadius: z.coerce.number().min(1, "Radius must be greater than 0")
});

type FormData = z.infer<typeof restaurantSchema>;

const CreateRestaurantForm = () => {
  const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(restaurantSchema),
  });

  const [addRestaurant, { isLoading }] = useAddRestaurantMutation();
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [radius, setRadius] = useState<number | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);


  const onSubmit = async (data: FormData) => {
    try {
      console.log("data rest create ", data, logoFile)
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("address", data.address);
      formData.append("latitude", data.latitude.toString());
      formData.append("longitude", data.longitude.toString());
      formData.append("deliveryAreaRadius", data.deliveryAreaRadius.toString());

      if (logoFile) {
        formData.append("logo", logoFile);
      }
      

      await addRestaurant(formData as any).unwrap();

      toast.success("Restaurant created successfully");
      reset();
      setLogoPreview(null);
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4 max-w-md" encType="multipart/form-data">
      <Input {...register("name")} placeholder="Restaurant Name" />
      {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

      <Input {...register("address")} placeholder="Address" />
      {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}

      {/* Logo input and preview */}
      <div>
        <label className="block text-sm font-medium mb-1">Logo</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setLogoFile(file);
              setLogoPreview(URL.createObjectURL(file));
            }
          }}
          className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0 file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                     
        />
        {logoPreview && (
          <img src={logoPreview} alt="Logo Preview" className="mt-2 h-24 object-contain" />
        )}

      </div>

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
