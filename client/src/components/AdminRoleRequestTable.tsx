import {
  useGetAllRoleRequestsQuery,
  useUpdateRoleRequestStatusMutation,
} from "@/redux/api/authApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

const AdminRoleRequestTable = () => {
  const { data: requests = [], isLoading } = useGetAllRoleRequestsQuery();
  const [updateStatus] = useUpdateRoleRequestStatusMutation();

  const handleApprove = async (id: string) => {
    toast.promise(updateStatus({ id, status: "approved" }).unwrap(), {
      loading: "Approving role request...",
      success: () => "Role approved successfully.",
      error: (err) => err?.data?.message || "Failed to approve request.",
    });
  };

  const handleReject = async (id: string) => {
    toast.promise(updateStatus({ id, status: "disapproved" }).unwrap(), {
      loading: "Rejecting role request...",
      success: () => "Role disapproved successfully.",
      error: (err) => err?.data?.message || "Failed to reject request.",
    });
  };

  const columns = useMemo(
    () => [
      {
        header: "Requested Role",
        accessorKey: "requestedRole",
        cell: ({ row }: any) => row.original.requestedRole,
      },
      {
        header: "Remark",
        accessorKey: "remark",
        cell: ({ row }: any) => row.original.remark || "-",
      },
      {
        header: "User Email",
        accessorKey: "userId.email",
        cell: ({ row }: any) => row.original.userId?.email || "-",
      },
      {
        header: "Email Verified",
        accessorKey: "userId.isEmailVerified",
        cell: ({ row }: any) =>
          row.original.userId?.isEmailVerified ? "Yes" : "No",
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }: any) => row.original.status,
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }: any) => {
          const req = row.original;
          return (
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleApprove(req._id)}
              >
                Approve
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleReject(req._id)}
              >
                Reject
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: requests,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading)
    return (
      <p className="text-center py-10 text-muted-foreground">
        Loading role requests...
      </p>
    );

  if (requests.length === 0)
    return (
      <p className="text-center py-10 text-muted-foreground">
        No role requests found.
      </p>
    );

  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-gray-100">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="text-sm p-4 font-semibold text-gray-700 uppercase tracking-wider"
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
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="p-4">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminRoleRequestTable;
