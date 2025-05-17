import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useGetNotificationsQuery } from "@/redux/api/notificationsApi";
import { formatDistanceToNow } from "date-fns";

const NotificationsPage = () => {
  const { data: notifications = [], isLoading } = useGetNotificationsQuery();

  if (isLoading) return <p className="p-4">Loading notifications...</p>;

  if (notifications.length === 0)
    return <p className="p-4 text-muted-foreground">No notifications yet.</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">All Notifications</h1>
      {notifications.map((notif) => (
        <Card key={notif._id}>
          <CardContent className="flex justify-between items-center py-4">
            <div>
              <p className="text-sm">{notif.message}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
              </p>
            </div>
            {!notif.seen && <Badge variant="destructive">Unseen</Badge>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NotificationsPage;
