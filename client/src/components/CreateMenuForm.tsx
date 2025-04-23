import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { useCreateMenuMutation } from "@/api/menuApi"; // new import

const createMenuSchema = z.object({
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
type Props = {
  selectedRestaurantId?: string | null;
  onCreated?: () => void;
};
type CreateMenuFormData = z.infer<typeof createMenuSchema>;

const CreateMenuForm = ({ selectedRestaurantId }: Props) => {

  const {
    register,
    handleSubmit,
    setValue,
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

  const [createMenu, { isLoading: isCreating }] = useCreateMenuMutation();


  const onSubmit = async (data: CreateMenuFormData) => {
    try {
      console.log("yebo")
      const formData = new FormData();
      formData.append("restaurantId", selectedRestaurantId as string);
      formData.append("menuName", data.title);
      const menuItemsWithoutImage = data.menuItems.map(({ itemPicture, ...rest }) => rest);
      formData.append("menuItems", JSON.stringify(menuItemsWithoutImage));
      data.menuItems.forEach((item) => {
        if (item.itemPicture) formData.append("itemPictures", item.itemPicture);
      });

      console.log("creating", formData)

      await createMenu({ restaurantId: selectedRestaurantId as string, formData }).unwrap();
      toast.success("Menu created successfully!");
      // onCreated?.();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create menu");
    }
  };
  
  

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">

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
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setValue(`menuItems.${index}.itemPicture`, file);
              }}
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
