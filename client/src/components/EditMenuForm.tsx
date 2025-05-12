import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import {
  useGetMenuByIdQuery,
  useUpdateMenuMutation,
} from "@/redux/api/menuApi";
import { useEffect } from "react";

const editMenuSchema = z.object({
  title: z.string().min(1, "Menu title is required"),
  menuItems: z
    .array(
      z.object({
        _id: z.string().optional(), // existing items may have an _id
        name: z.string().min(1, "Item name is required"),
        description: z.string().min(1, "Description is required"),
        price: z.coerce.number().min(0.01, "Valid price required"),
        itemPicture: z.any().optional(), // file or existing image string
      })
    )
    .min(1, "At least one menu item is required"),
});

type EditMenuFormData = z.infer<typeof editMenuSchema>;

type EditMenuFormProps = {
  menuId: string;
  onUpdated?: () => void;
};

const EditMenuForm = ({ menuId, onUpdated }: EditMenuFormProps) => {
  const { data, isLoading } = useGetMenuByIdQuery(menuId);
  const [updateMenu, { isLoading: isUpdating }] = useUpdateMenuMutation();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<EditMenuFormData>({
    resolver: zodResolver(editMenuSchema),
    defaultValues: {
      title: "",
      menuItems: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "menuItems",
  });

  // Load menu data into form
  useEffect(() => {
    if (data) {
      reset({
        title: data.menuName,
        menuItems: data.menuItems.map((item: any) => ({
          _id: item._id,
          name: item.name,
          description: item.description,
          price: item.price,
          itemPicture: item.itemPicture || null,
        })),
      });
    }
  }, [data, reset]);

  const onSubmit = async (form: EditMenuFormData) => {
    try {
      const formData = new FormData();
      formData.append("menuName", form.title);

      formData.append("menuItems", JSON.stringify(form.menuItems));

      form.menuItems.forEach((item, index) => {
        if (item.itemPicture instanceof File) {
          formData.append(`itemPictures-${index}`, item.itemPicture);
        }
      });

      await updateMenu({ menuId, formData }).unwrap();
      toast.success("Menu updated successfully!");
      onUpdated?.();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update menu");
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      <div>
        <Input placeholder="Menu Title" {...register("title")} />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
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

            {typeof field.itemPicture === "string" && (
              <img
                src={field.itemPicture}
                alt="Item Preview"
                className="w-32 h-32 object-cover rounded-md mb-2"
              />
            )}
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
            >
              Remove Item
            </Button>
          </div>
        ))}
        <Button
          type="button"
          onClick={() =>
            append({ name: "", description: "", price: 0, itemPicture: null })
          }
        >
          Add Menu Item
        </Button>
        {errors.menuItems && (
          <p className="text-red-500 text-sm">
            {(errors.menuItems as any).message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isUpdating}>
        {isUpdating ? "Updating..." : "Update Menu"}
      </Button>
      <Toaster />
    </form>
  );
};

export default EditMenuForm;
