import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader, // Import DialogHeader etc. for structure
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose, // Import DialogClose for cancel
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import { Input } from "@/components/ui/input"; // Input not used in form
import { Textarea } from "@/components/ui/textarea";
import {
  useGetRoleRequestsQuery,
  useCreateRoleRequestMutation,
  useCancelRoleRequestMutation,
  useUpdateRoleRequestStatusMutation,
  useGetCurrentUserQuery, // Keep this if needed
} from "@/api/authApi"; // Adjust path if needed
import { toast } from "sonner";
// import { useGetCurrentUserQuery } from "@/api/authApi"; // Duplicate import removed

// *** Correct Shadcn UI Imports ***
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import from your shadcn ui folder

// *** Shadcn UI Form Imports ***
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"; // Import shadcn form components

// Define the type based on the schema
type RoleRequestFormData = z.infer<typeof formSchema>;

const formSchema = z.object({
  // Use refine or specific enum if roles are fixed
  requestedRole: z.string({ required_error: "Please select a role."}).min(1, "Please select a role."),
  remark: z.string().optional(),
});

const RoleManagement = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  // Provide default value during destructuring and handle loading/error states
  const { data: requests = [], isLoading: isLoadingRequests, error: requestsError } = useGetRoleRequestsQuery();
  const [createRoleRequest, { isLoading: isCreating }] = useCreateRoleRequestMutation();
  const [cancelRoleRequest] = useCancelRoleRequestMutation();
  const [updateRoleRequest] = useUpdateRoleRequestStatusMutation();
  // Add loading/error check for user
  const { data: user, isLoading: isLoadingUser, error: userError } = useGetCurrentUserQuery();

  // *** Use Shadcn UI Form hook integration ***
  const form = useForm<RoleRequestFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requestedRole: "", // Initialize role
      remark: "",
    },
  });

  // Use form.handleSubmit directly
  const onSubmit = async (values: RoleRequestFormData) => {
    console.log("values", values)
    const promise = createRoleRequest(values).unwrap();
    toast.promise(promise, {
        loading: 'Submitting request...',
        success: () => {
            form.reset(); // Use form.reset()
            setDialogOpen(false);
            return "Request submitted successfully.";
        },
        error: (err) => {
            console.error("Failed to create request:", err);
            return err?.data?.message || "Failed to create request.";
        }
    })
  };

  const handleCancel = async (id: number | string) => { // Use number or string depending on your ID type
    // Add confirmation dialog here in a real app
    const promise = cancelRoleRequest(id).unwrap();
    toast.promise(promise, {
        loading: 'Cancelling request...',
        success: 'Request cancelled successfully.',
        error: (err) => err?.data?.message || 'Failed to cancel request.'
    });
  };

  const handleApprove = async (id: number | string) => {
    const promise = updateRoleRequest({ id, status: "approved" }).unwrap();
     toast.promise(promise, {
        loading: 'Approving request...',
        success: 'Request approved successfully.',
        error: (err) => err?.data?.message || 'Failed to approve request.'
    });
  };

  const handleDisapprove = async (id: number | string) => {
     const promise = updateRoleRequest({ id, status: "rejected" }).unwrap(); // Use 'rejected' or 'disapproved' consistently
     toast.promise(promise, {
        loading: 'Rejecting request...',
        success: 'Request rejected successfully.',
        error: (err) => err?.data?.message || 'Failed to reject request.'
    });
  };

  // Handle loading states
  if (isLoadingRequests || isLoadingUser) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  // Handle error states
  if (requestsError || userError) {
    console.error("Data loading error:", { requestsError, userError });
    return <div className="p-4 text-center text-red-500">Error loading data. Please try again later.</div>;
  }

   // Ensure user and user.role exist before trying to use .includes
   const canCancel = user?.role?.includes("customer"); // Or based on request owner ID?
   const isAdmin = user?.role?.includes("admin");

  return (
    <div className="p-4">
      <div className="flex justify-end mb-4"> {/* Added more margin */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Request New Role</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Request Additional Role</DialogTitle>
              <DialogDescription>
                Select the role you need and add an optional remark.
              </DialogDescription>
            </DialogHeader>
            {/* *** Use Shadcn UI Form Component *** */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Role Select Field */}
                <FormField
                  control={form.control}
                  name="requestedRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      {/* Pass field props correctly to Shadcn Select */}
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* Ensure values match what your backend expects */}
                          <SelectItem value="delivery_person">Delivery Person</SelectItem>
                          <SelectItem value="restaurant_owner">Restaurant Owner</SelectItem>
                          {/* Add other roles as needed */}
                        </SelectContent>
                      </Select>
                      <FormMessage /> {/* Displays validation errors */}
                    </FormItem>
                  )}
                />

                {/* Remark Textarea Field */}
                <FormField
                  control={form.control}
                  name="remark"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remark (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Add remark..." {...field} />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                   <DialogClose asChild>
                       <Button type="button" variant="outline" disabled={isCreating}>
                           Cancel
                       </Button>
                   </DialogClose>
                   <Button type="submit" disabled={isCreating}>
                       {isCreating ? 'Submitting...' : 'Submit Request'}
                   </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableCaption>A list of your recent role requests.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Requested Role</TableHead>
            <TableHead>Remark</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 && (
            <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                    No role requests found.
                </TableCell>
            </TableRow>
          )}
          {requests.map((req) => (
            <TableRow key={req.id}>
              <TableCell className="font-medium">{req.requestedRole}</TableCell> {/* Adjust field name if needed */}
              <TableCell>{req.remark ?? '-'}</TableCell> {/* Handle missing remark */}
              <TableCell>{req.status}</TableCell> {/* Add badge here later */}
              <TableCell className="text-right">
                {/* Check if current user is the owner? Or just based on role? */}
                {/* Assuming 'customer' role means owner for cancelling */}
                {canCancel && req.status === "pending" && (
                  <Button
                     size="sm"
                     variant="outline" // Use outline for cancel usually
                     className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700" // More specific destructive outline
                     onClick={() => handleCancel(req.id)}
                   >
                    Cancel
                  </Button>
                )}
                 {isAdmin && req.status === "pending" && (
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700" onClick={() => handleApprove(req.id)}> {/* Added variant */}
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDisapprove(req.id)}>
                      Reject
                    </Button>
                  </div>
                )}
                {/* Optionally display text if no actions available */}
                {req.status !== 'pending' && <span className="text-xs text-muted-foreground">No actions available</span>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* <Toaster /> Make sure Toaster is in your App.tsx or layout root */}
    </div>
  );
};

export default RoleManagement;