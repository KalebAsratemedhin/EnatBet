import { useParams } from "react-router-dom";
import { useGetMenuByIdQuery } from "@/api/menuApi";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const MenuDetailsPage = () => {
  const { menuId } = useParams<{ menuId: string }>();
  const { data: menu, isLoading, isError } = useGetMenuByIdQuery(menuId!);

  if (isError) toast.error("Failed to fetch menu details");

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/2" />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-500">
              🍽 {menu?.menuName} Menu
            </h1>
            <p className="text-muted-foreground mt-2">
              Explore all the delicious dishes in this menu.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menu?.menuItems?.map((item: any, index: number) => (
              <Card
                key={index}
                className="transition pt-0 duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl shadow-md rounded-2xl overflow-hidden h-96 w-80"
              >
                {item.itemPicture && (
                  <img
                    src={item.itemPicture}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                )}

                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-semibold text-primary">
                    {item.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">{item.price.toFixed(2)} ETB</span>
                    <Badge variant="outline">Available</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MenuDetailsPage;
