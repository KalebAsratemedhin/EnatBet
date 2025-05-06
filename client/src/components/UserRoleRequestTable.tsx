import {
  useGetMineRoleRequestsQuery,
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
import { RoleRequest } from "@/types/api";

const UserRoleRequestTable = () => {
  const { data: requests = [], isLoading } = useGetMineRoleRequestsQuery();
  const [updateStatus] = useUpdateRoleRequestStatusMutation();

  const handleToggleCancel = async (req: RoleRequest) => {
    const updatedStatus = req.status === "cancelled" ? "pending" : "cancelled";
    try {
      await updateStatus({ id: req._id, status: updatedStatus }).unwrap();
      toast.success(`Request ${updatedStatus}`);
    } catch (err) {
      toast.error("Failed to update request");
    }
  };

  if (isLoading) return <p className="text-center">Loading your requests...</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Requested Role</TableHead>
          <TableHead>Remark</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-4">
              You haven't made any requests yet.
            </TableCell>
          </TableRow>
        ) : (
          requests.map((req) => (
            <TableRow key={req._id}>
              <TableCell>{req.requestedRole}</TableCell>
              <TableCell>{req.remark || "-"}</TableCell>
              <TableCell>{req.status}</TableCell>
              <TableCell className="text-right">
                {["pending", "cancelled"].includes(req.status) && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => handleToggleCancel(req)}
                  >
                    {req.status === "cancelled" ? "Reactivate" : "Cancel"}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default UserRoleRequestTable;
