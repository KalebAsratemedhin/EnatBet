import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { useUpdateRestaurantMutation } from "@/api/restaurantApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { UpdateRestaurantRequest } from "@/types/restaurant";

const updateRestaurantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  deliveryAreaRadius: z.coerce.number().min(1, "Radius must be greater than 0"),
});

type UpdateFormData = z.infer<typeof updateRestaurantSchema>;

interface UpdateRestaurantFormProps {
  restaurant: any;
  onClose: () => void;
}

const UpdateRestaurantForm = ({ restaurant, onClose }: UpdateRestaurantFormProps) => {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<UpdateFormData>({
    resolver: zodResolver(updateRestaurantSchema),
    defaultValues: {
      name: restaurant.name,
      address: restaurant.location?.address,
      latitude: restaurant.location?.coordinates[1],
      longitude: restaurant.location?.coordinates[0],
      deliveryAreaRadius: restaurant.deliveryAreaRadius,
    },
  });

  const [updateRestaurant, { isLoading }] = useUpdateRestaurantMutation();
  const [logoPreview, setLogoPreview] = useState<string | null>(restaurant.logo ?? null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const onSubmit = async (data: UpdateFormData) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("address", data.address);
      formData.append("latitude", data.latitude.toString());
      formData.append("longitude", data.longitude.toString());
      formData.append("deliveryAreaRadius", data.deliveryAreaRadius.toString());

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      await updateRestaurant({ id: restaurant._id, data: formData as any}).unwrap();
      toast.success("Restaurant updated successfully");
      onClose(); // Close the dialog after updating
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update restaurant");
    }
  };

  useEffect(() => {
    setValue("latitude", restaurant.location?.coordinates[1]);
    setValue("longitude", restaurant.location?.coordinates[0]);
  }, [restaurant, setValue]);

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Restaurant</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4 max-w-md">
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
              className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {logoPreview && (
              <img src={logoPreview} alt="Logo Preview" className="mt-2 h-24 object-contain" />
            )}
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
            />
            {errors.deliveryAreaRadius && <p className="text-red-500 text-sm">{errors.deliveryAreaRadius.message}</p>}
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Restaurant"}
          </Button>
        </form>

        <DialogClose asChild>
          <Button variant="outline" className="mt-4" onClick={onClose}>
            Close
          </Button>
        </DialogClose>
      </DialogContent>
      <Toaster />
    </Dialog>
  );
};

export default UpdateRestaurantForm;
