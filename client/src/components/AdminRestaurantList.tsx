import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MoreHorizontal, Star } from "lucide-react";
import {
  useGetAllRestaurantQuery,
  useUpdateRestaurantStatusMutation,
} from "@/redux/api/restaurantApi";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { PopulatedRestaurant } from "@/types/restaurant";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  active: "bg-green-100 text-green-800",
  inactive: "bg-red-100 text-red-800",
};

const AdminRestaurantList = () => {
  const [page, setPage] = React.useState(1);
  const limit = 5;
  const { data, error, isLoading } = useGetAllRestaurantQuery({ page, limit });
  const [updateRestaurantStatus] = useUpdateRestaurantStatusMutation();
  const [selectedRestaurant, setSelectedRestaurant] =
    React.useState<PopulatedRestaurant | null>(null);

  const handleStatusUpdate = async (
    newStatus: string,
    restaurant: PopulatedRestaurant
  ) => {
    try {
      await updateRestaurantStatus({
        id: restaurant._id,
        status: newStatus,
      }).unwrap();
      toast.success(`Restaurant status updated to: ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const restaurants = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const columns: ColumnDef<PopulatedRestaurant>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <span>{row.original.name}</span>,
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => <span>{row.original.location?.address}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className={cn("capitalize", statusColors[row.original.status])}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "ownerId",
      header: "Owner",
      cell: ({ row }) => {
        const owner = row.original.ownerId;
        return (
          <div className="text-sm">
            <p className="font-medium">{owner.name}</p>
            <p className="text-xs text-muted-foreground">{owner.email}</p>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const restaurant = row.original;
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleStatusUpdate("active", restaurant)}
                >
                  Activate
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusUpdate("inactive", restaurant)}
                >
                  Deactivate
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedRestaurant(restaurant)}
                >
                  View Details
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: restaurants,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="container mx-10 w-auto mt-10 p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Restaurant Management
      </h2>
      {/* <hr className="border-gray-300" /> */}

      {isLoading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">Failed to load restaurants.</p>
      ) : (
        <>
          <div className="rounded-xl overflow-hidden border border-gray-200">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-gray-100">
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="text-sm font-semibold text-gray-700 uppercase tracking-wider"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <TableRow
                      key={row.id}
                      className={cn(
                        index % 2 === 0 ? "bg-white" : "bg-gray-50",
                        "hover:bg-gray-100 transition"
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="py-3 px-4 align-middle"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No restaurants found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between items-center mt-6">
            <span className="text-sm text-gray-500">
              Showing page {page} of {totalPages}
            </span>
            <Pagination>
              <PaginationContent className="gap-4">
                <PaginationItem>
                  <PaginationPrevious>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                  </PaginationPrevious>
                </PaginationItem>

                <PaginationItem>
                  <PaginationNext>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </PaginationNext>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}

      <Dialog
        open={!!selectedRestaurant}
        onOpenChange={() => setSelectedRestaurant(null)}
      >
        <DialogContent className="max-w-lg p-6 rounded-xl shadow-xl">
          {selectedRestaurant && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  {selectedRestaurant.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm text-gray-700">
                {selectedRestaurant.logo && (
                  <img
                    src={selectedRestaurant.logo}
                    alt={selectedRestaurant.name}
                    className="w-full h-40 object-cover rounded-md border"
                  />
                )}
                <p>
                  <strong>Address:</strong>{" "}
                  {selectedRestaurant.location?.address}
                </p>
                <p>
                  <strong>Coordinates:</strong>{" "}
                  {selectedRestaurant.location?.coordinates
                    ? `(${selectedRestaurant.location.coordinates[1]}, ${selectedRestaurant.location.coordinates[0]})`
                    : "N/A"}
                </p>
                <p>
                  <strong>Delivery Radius:</strong>{" "}
                  {selectedRestaurant.deliveryAreaRadius} meters
                </p>
                <p>
                  <strong>Owner:</strong> {selectedRestaurant.ownerId.name} (
                  {selectedRestaurant.ownerId.email})
                </p>
                <p>
                  <strong>Status:</strong> {selectedRestaurant.status}
                </p>
                <div className="flex items-center gap-1">
                  <strong>Rating:</strong>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={
                        i < Math.round(selectedRestaurant.rating)
                          ? "#facc15"
                          : "none"
                      }
                      stroke="#facc15"
                    />
                  ))}
                  <span className="ml-1 text-sm text-muted-foreground">
                    ({selectedRestaurant.rating.toFixed(1)})
                  </span>
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedRestaurant(null)}
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRestaurantList;
