import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateRoleRequestMutation,
  useGetCurrentUserQuery,
} from "@/redux/api/authApi";
import { toast, Toaster } from "sonner";

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
import AdminRoleRequestTable from "./AdminRoleRequestTable";
import UserRoleRequestTable from "./UserRoleRequestTable";

// Define the type based on the schema
type RoleRequestFormData = z.infer<typeof formSchema>;

const formSchema = z.object({
  // Use refine or specific enum if roles are fixed
  requestedRole: z
    .string({ required_error: "Please select a role." })
    .min(1, "Please select a role."),
  remark: z.string().optional(),
});

const RoleManagement = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const [createRoleRequest, { isLoading: isCreating }] =
    useCreateRoleRequestMutation();
  const { data: user } = useGetCurrentUserQuery();

  const form = useForm<RoleRequestFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requestedRole: "",
      remark: "",
    },
  });

  const onSubmit = async (values: RoleRequestFormData) => {
    toast.promise(createRoleRequest(values).unwrap(), {
      loading: "Submitting request...",
      success: () => {
        form.reset();
        setDialogOpen(false);

        return "Request submitted successfully.";
      },
      error: (err) => {
        console.error("Failed to create request:", err);
        return err?.data?.message || "Failed to create request.";
      },
    });
  };

  const isAdmin = user?.role?.includes("admin");

  return (
    <div className="p-4">
      <div className="flex justify-end mb-4">
        {" "}
        {/* Added more margin */}
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
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Role Select Field */}
                <FormField
                  control={form.control}
                  name="requestedRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      {/* Pass field props correctly to Shadcn Select */}
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* Ensure values match what your backend expects */}
                          <SelectItem value="delivery_person">
                            Delivery Person
                          </SelectItem>
                          <SelectItem value="restaurant_owner">
                            Restaurant Owner
                          </SelectItem>
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
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isCreating}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? "Submitting..." : "Submit Request"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isAdmin ? <AdminRoleRequestTable /> : <UserRoleRequestTable />}

      <Toaster />
      {/* Make sure Toaster is in your App.tsx or layout root */}
    </div>
  );
};

export default RoleManagement;
