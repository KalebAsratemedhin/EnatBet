import { useGetCurrentUserQuery, useLogoutMutation } from "@/redux/api/authApi";
import {
  useGetNotificationsQuery,
  useMarkNotificationsAsSeenMutation,
} from "@/redux/api/notificationsApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { HiBell } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import socket from "@/lib/socket";

const CurrentUser = () => {
  const { data: user, refetch } = useGetCurrentUserQuery();
  const { data: notifications = [], refetch: refetchNotifications } =
    useGetNotificationsQuery();
  const [markAsSeen] = useMarkNotificationsAsSeenMutation();
  const [logout, { isError, error, isSuccess }] = useLogoutMutation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigator = useNavigate();

  const unseenNotifications = notifications.filter((n) => !n.seen);

  useEffect(() => {
    if (user?._id) {
      const connectSocket = () => {
        if (!socket.connected) {
          socket.connect();
  
          socket.on("connect", () => {
            socket.emit("join", user._id);
          });
  
          socket.on("connect_error", () => {
            setTimeout(connectSocket, 5000);
          });
        }
      };
  
      connectSocket();
  
      // Avoid multiple listeners
      socket.off("new-notification");
      socket.on("new-notification", (newNotification) => {
        toast(newNotification.message);
        refetchNotifications();
      });
  
      return () => {
        socket.off("new-notification");
        socket.off("connect");
        socket.off("connect_error");
      };
    }
  }, [user?._id]);
  

  useEffect(() => {
    if (isError) {
      localStorage.clear();
      refetch();
      toast.error("Logout failed");
      navigator("/");

    }
    if (isSuccess) {
      localStorage.clear();
      refetch();
      navigator("/");
    }
  }, [isError, isSuccess, error]);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleOpenNotifications = async (id: string) => {
    if (unseenNotifications.length > 0) {
      await markAsSeen({ id });
      refetchNotifications();
    }
  };

  return (
    <div className="flex items-center space-x-4 relative">
      {/* User Avatar Button */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full text-xl text-gray-700"
        >
          {user?.profileImage ? (
            <img
              src={user?.profileImage}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            user?.name?.charAt(0)?.toUpperCase()
          )}
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
            <Link
              to="/profile"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Profile
            </Link>
            <Link
              to="/settings"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Notification Bell with Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative p-2 text-gray-700">
            <HiBell className="text-2xl" />
            {unseenNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 text-[10px] text-white bg-red-500 rounded-full w-4 h-4 flex items-center justify-center">
                {unseenNotifications.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64">
          {unseenNotifications.length === 0 ? (
            <DropdownMenuItem className="text-muted-foreground text-sm">
              No new notifications
            </DropdownMenuItem>
          ) : (
            <>
              {unseenNotifications.slice(0, 3).map((notif) => (
                <DropdownMenuItem
                  key={notif._id}
                  className="text-sm"
                  onClick={() => handleOpenNotifications(notif._id)}
                >
                  {notif.message}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem asChild>
                <Link
                  to="/notifications"
                  className="w-full text-sm text-blue-600 hover:underline"
                >
                  View All Notifications
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <Toaster />
    </div>
  );
};

export default CurrentUser;
