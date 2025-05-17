import React, { useState } from "react";
import {
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useSendOTPMutation,
  useVerifyEmailMutation,
} from "@/redux/api/authApi";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const passwordSchema = yup.object({
  oldPassword: yup.string().required("Old password is required"),
  newPassword: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
});

const SettingsPage: React.FC = () => {
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();
  const [deleteAccount, { isLoading: isDeletingAccount }] =
    useDeleteAccountMutation();
  const [sendOTP, { isLoading: isSendingOTP }] = useSendOTPMutation();
  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();

  const [emailVerified, setEmailVerified] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [otp, setOtp] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const handleChangePassword = async (data: any) => {
    try {
      await changePassword(data).unwrap();
      toast.success("Password changed successfully");
    } catch(error: any) {
      toast.error(`Error changing password ${error?.data?.message} `);
    }
  };

  const handleSendVerificationEmail = async () => {
    try {
      await sendOTP().unwrap();
      toast.success("Verification email sent");
      setIsDialogOpen(true);
    } catch(error: any) {
      toast.error(`Failed to send verification email ${error?.data?.message} `);

    }
  };

  const handleVerifyOTP = async () => {
    try {
      await verifyEmail({ otp }).unwrap();
      toast.success("Email verified successfully");
      setEmailVerified(true);
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(`Invalid or expired OTP ${error?.data?.message}`);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount().unwrap();
      toast.success("Account deleted successfully");
      localStorage.clear();
    } catch (error: any) {
      toast.error(`Error deleting account ${error?.data?.message}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-3xl font-bold text-center text-primary">
        ⚙️ Account Settings
      </h1>

      <Tabs defaultValue="password" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="password">Change Password</TabsTrigger>
          <TabsTrigger value="email">Verify Email</TabsTrigger>
          <TabsTrigger value="delete">Delete Account</TabsTrigger>
        </TabsList>

        {/* Change Password Tab */}
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>🔒 Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit(handleChangePassword)}
                className="space-y-4"
              >
                <Input
                  type="password"
                  placeholder="Old Password"
                  {...register("oldPassword")}
                />
                {errors.oldPassword && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.oldPassword.message}
                  </p>
                )}
                <Input
                  type="password"
                  placeholder="New Password"
                  {...register("newPassword")}
                />
                {errors.newPassword && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.newPassword.message}
                  </p>
                )}
                <Button type="submit" disabled={isChangingPassword}>
                  {isChangingPassword && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Change Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Verification Tab */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>📨 Email Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleSendVerificationEmail}
                disabled={isSendingOTP || emailVerified}
                variant={emailVerified ? "default" : "secondary"}
              >
                {isSendingOTP ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : emailVerified ? (
                  "✅ Email Verified"
                ) : (
                  "Send Verification Email"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* OTP Dialog */}
          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Enter the OTP sent to your email
                </AlertDialogTitle>
              </AlertDialogHeader>
              <Input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                maxLength={6}
              />
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleVerifyOTP}
                  disabled={isVerifying}
                >
                  {isVerifying && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Verify Email
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TabsContent>

        {/* Delete Account Tab */}
        <TabsContent value="delete">
          <Card>
            <CardHeader>
              <CardTitle>🗑️ Delete Account</CardTitle>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete Account</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to delete your account?
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      disabled={isDeletingAccount}
                    >
                      {isDeletingAccount && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Confirm Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
