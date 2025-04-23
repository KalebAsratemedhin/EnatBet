"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { MoreHorizontal, Star } from "lucide-react"
import { useGetAllRestaurantQuery, useUpdateRestaurantStatusMutation } from "@/api/restaurantApi"
import { cn } from "@/lib/utils"

interface Restaurant {
  _id: string
  name: string
  address: string
  status: "approved" | "pending" | "rejected" | "suspended"
  rating: number
  logo?: string
  deliveryAreas?: number
  location?: {
    coordinates: [number, number]
    address: string
  }
  ownerId: {
    name: string
    email: string
  }
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  active: "bg-green-100 text-green-800",
  inactive: "bg-red-100 text-red-800"
}

const AdminRestaurantList = () => {
  const { data: restaurants, error, isLoading } = useGetAllRestaurantQuery()
  const [updateRestaurantStatus] = useUpdateRestaurantStatusMutation()
  const [selectedRestaurant, setSelectedRestaurant] = React.useState<Restaurant | null>(null)

  const handleStatusUpdate = async (newStatus: string, restaurant: Restaurant) => {
    try {
      await updateRestaurantStatus({ id: restaurant._id, status: newStatus }).unwrap()
      toast.success(`Restaurant status updated to: ${newStatus}`)
    } catch (err) {
      toast.error("Failed to update status")
    }
  }

  const columns: ColumnDef<Restaurant>[] = [
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
      accessorKey: "owner",
      header: "Owner",
      cell: ({ row }) => (
        <div className="text-sm">
          <p className="font-medium">{row.original.ownerId?.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.ownerId?.email}</p>
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const restaurant = row.original
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleStatusUpdate("active", restaurant)}>Activate</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusUpdate("inactive", restaurant)}>Deactivate</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedRestaurant(restaurant)}>View Details</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: restaurants?.allRestaurants || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="container  mx-12 w-auto mt-10 p-4 bg-gray-200 rounded-xl shadow-md">
      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">Failed to load restaurants.</p>
      ) : (
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className="text-sm font-semibold">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center text-muted-foreground">
                  No restaurants found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {/* Dialog for restaurant details */}
      <Dialog open={!!selectedRestaurant} onOpenChange={() => setSelectedRestaurant(null)}>
        <DialogContent className="max-w-lg">
          {selectedRestaurant && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedRestaurant.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                {selectedRestaurant.logo && (
                  <img src={selectedRestaurant.logo} alt={selectedRestaurant.name} className="w-full h-40 object-cover rounded-md" />
                )}
                <p><strong>Address:</strong> {selectedRestaurant.location?.address}</p>
                <p>
                  <strong>Coordinates:</strong>{" "}
                  {selectedRestaurant.location?.coordinates
                    ? `(${selectedRestaurant.location.coordinates[1]}, ${selectedRestaurant.location.coordinates[0]})`
                    : "N/A"}
                </p>
                <p><strong>Delivery Radius:</strong> {selectedRestaurant.deliveryAreas} meters</p>
                <p><strong>Owner:</strong> {selectedRestaurant.ownerId.name} ({selectedRestaurant.ownerId.email})</p>
                <p><strong>Status:</strong> {selectedRestaurant.status}</p>
                <div className="flex items-center gap-1">
                  <strong>Rating:</strong>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < Math.round(selectedRestaurant.rating) ? "#facc15" : "none"} stroke="#facc15" />
                  ))}
                  <span className="ml-1 text-sm text-muted-foreground">({selectedRestaurant.rating.toFixed(1)})</span>
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setSelectedRestaurant(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminRestaurantList
