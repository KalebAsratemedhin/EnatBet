import { useGetAllRoleRequestsQuery, useUpdateRoleRequestStatusMutation } from "@/api/authApi";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect } from "react";

const AdminRoleRequestTable = () => {
  const { data: requests = [], isLoading } = useGetAllRoleRequestsQuery();
  const [updateStatus] = useUpdateRoleRequestStatusMutation();

  const handleApprove = async (id: string) => {

    toast.promise(
        updateStatus({id, status: "approved"}).unwrap(),
        {
            loading: "approving role request...",
            success: () => {

                return "Role approved successfully.";
            },
            error: (err) => {
                return err?.data?.message || "Failed to approve request.";
            }
        })
  };

  const handleReject = async (id: string) => {
    toast.promise(
        updateStatus({id, status: "disapproved"}).unwrap(),
        {
            loading: "rejecting role request...",
            success: () => {

                return "Role disapproved successfully.";
            },
            error: (err) => {
                return err?.data?.message || "Failed to reject request.";
            }
        })
  };

  useEffect(()=>{

    if(requests){
      console.log("role reqs ", requests);
    }

  },[requests])

  if (isLoading) return <p className="text-center">Loading requests...</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Requested Role</TableHead>
          <TableHead>Remark</TableHead>
          <TableHead>User email</TableHead>
          <TableHead>Email verified</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-4">No role requests found.</TableCell>
          </TableRow>
        ) : (
          requests.map((req) => (
            <TableRow key={req._id}>
              <TableCell>{req.requestedRole}</TableCell>
              <TableCell>{req.remark || "-"}</TableCell>
              <TableCell>{req.userId.email || "-"}</TableCell>
              <TableCell>{req.userId.isEmailVerified ? "True" : "False"}</TableCell>


              <TableCell>{req.status}</TableCell>
              <TableCell className="text-right space-x-2">
                {(
                  <>
                    <Button size="sm" variant="outline" onClick={() => handleApprove(req._id)}>
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleReject(req._id)}>
                      Reject
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default AdminRoleRequestTable;
