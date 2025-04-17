import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllMineRestaurantQuery } from "@/api/restaurantApi";
import { useCreateMenuMutation } from "@/api/menuApi"; // new import

const createMenuSchema = z.object({
  restaurantId: z.string().min(1, "Restaurant is required"),
  title: z.string().min(1, "Menu title is required"),
  menuItems: z
    .array(
      z.object({
        name: z.string().min(1, "Item name required"),
        description: z.string().min(1, "Description required"),
        price: z.coerce.number().min(0.01, "Valid price required"),
        itemPicture: z.any(),
      })
    )
    .min(1, "At least one item is required"),
});

type CreateMenuFormData = z.infer<typeof createMenuSchema>;

const CreateMenuForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<CreateMenuFormData>({
    resolver: zodResolver(createMenuSchema),
    defaultValues: {
      menuItems: [{ name: "", description: "", price: 0, itemPicture: null }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "menuItems",
  });

  const { data: restaurants, isLoading } = useGetAllMineRestaurantQuery();
  const [createMenu, { isLoading: isCreating }] = useCreateMenuMutation();

  const onSubmit = async (data: CreateMenuFormData) => {
    const formData = new FormData();
    formData.append("menuName", data.title);
    formData.append("restaurant", data.restaurantId);

    data.menuItems.forEach((item, index) => {
      formData.append(`menuItems[${index}][name]`, item.name);
      formData.append(`menuItems[${index}][description]`, item.description);
      formData.append(`menuItems[${index}][price]`, item.price.toString());
      if (item.itemPicture instanceof File) {
        formData.append("itemPictures", item.itemPicture);
      }
    });

    try {
      console.log("menu ", formData)
      await createMenu(formData).unwrap();
      toast.success("Menu created successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create menu");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      <div>
        <Select onValueChange={(value) => setValue("restaurantId", value)}>
          <SelectTrigger>
            <SelectValue placeholder={isLoading ? "Loading..." : "Select Restaurant"} />
          </SelectTrigger>
          <SelectContent>
            {restaurants?.data?.map((restaurant) => (
              <SelectItem key={restaurant._id} value={restaurant._id}>
                {restaurant.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.restaurantId && (
          <p className="text-red-500 text-sm">{errors.restaurantId.message}</p>
        )}
      </div>

      <div>
        <Input placeholder="Menu Title" {...register("title")} />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="border p-4 rounded-lg space-y-2">
            <Input
              placeholder="Item Name"
              {...register(`menuItems.${index}.name`)}
            />
            <Input
              placeholder="Description"
              {...register(`menuItems.${index}.description`)}
            />
            <Input
              type="number"
              placeholder="Price"
              {...register(`menuItems.${index}.price`, { valueAsNumber: true })}
            />
            <Input
              type="file"
              accept="image/*"
              {...register(`menuItems.${index}.itemPicture`)}
            />
            <Button
              type="button"
              variant="destructive"
              onClick={() => remove(index)}
              className="mt-2"
            >
              Remove Item
            </Button>
          </div>
        ))}

        {errors.menuItems && (
          <p className="text-red-500 text-sm">{(errors.menuItems as any).message}</p>
        )}
        <Button type="button" onClick={() => append({ name: "", description: "", price: 0, itemPicture: null })}>
          Add Menu Item
        </Button>
      </div>

      <Button type="submit" disabled={isCreating}>
        {isCreating ? "Creating..." : "Create Menu"}
      </Button>
      <Toaster />
    </form>
  );
};

export default CreateMenuForm;
