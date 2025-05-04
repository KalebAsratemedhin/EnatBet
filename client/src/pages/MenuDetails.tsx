import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetMenuByIdQuery,
  useDeleteMenuMutation,
} from "@/api/menuApi";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CreateMenuForm from "@/components/CreateMenuForm";
import { Pencil, Eye, Trash2 } from "lucide-react";
import EditMenuForm from "@/components/EditMenuForm";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogContent,
} from "@/components/ui/dialog";

const MenuDetailsPage = () => {
  const { menuId } = useParams<{ menuId: string }>();
  const { data: menu, isLoading, isError } = useGetMenuByIdQuery(menuId!);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteMenu] = useDeleteMenuMutation();
  const navigate = useNavigate();

  if (isError) toast.error("Failed to fetch menu details");

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div className="text-center flex-1">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-500">
            🍽 {menu?.menuName} Menu
          </h1>
          <p className="text-muted-foreground mt-2">
            {editMode
              ? "Edit and manage the items in this menu."
              : "Explore all the delicious dishes in this menu."}
          </p>
        </div>

        <div className="flex gap-4 items-center">
          <Button variant="outline" onClick={() => setEditMode((prev) => !prev)}>
            {editMode ? (
              <>
                <Eye className="w-4 h-4 mr-2" />
                View Mode
              </>
            ) : (
              <>
                <Pencil className="w-4 h-4 mr-2" />
                Edit Menu
              </>
            )}
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Menu
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/2" />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : editMode ? (
        <EditMenuForm
          menuId={menu?._id!}
          onUpdated={() => {
            toast.success("Menu updated!");
            setEditMode(false);
          }}
        />
      ) : (
        <div className="flex flex-wrap gap-8 ">
          {menu?.menuItems?.map((item: any, index: number) => (
            <Card
              key={index}
              className="transition pt-0 duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl shadow-md rounded-2xl overflow-hidden h-96 w-64"
            >
              {item.itemPicture && (
                <img
                  src={item.itemPicture}
                  alt={item.name}
                  className="w-full h-40 object-cover"
                />
              )}
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold text-primary truncate">
                  {item.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {item.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">
                    {item.price.toFixed(2)} ETB
                  </span>
                  <Badge variant="outline">Available</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the menu{" "}
              <strong>{menu?.menuName}</strong>? This action is irreversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                try {
                  await deleteMenu(menuId!).unwrap();
                  toast.success("Menu deleted successfully!");
                  navigate(-1); // Go back to previous page
                } catch (error) {
                  toast.error("Failed to delete menu.");
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MenuDetailsPage;
