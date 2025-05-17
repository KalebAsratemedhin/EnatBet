import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FaUsers,
  FaHotel,
  FaMotorcycle,
} from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useGetAdminDashboardQuery } from "@/redux/api/dashboardApi";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetAdminDashboardQuery();

  if (isLoading) return <div className="p-6">Loading dashboard...</div>;
  if (isError || !data) return <div className="p-6 text-red-500">Failed to load dashboard.</div>;

  const {
    stats,
    salesData,
    userData,
    revenueData,
    recentUsers,
  } = data;

  return (
    <div className="p-4 md:p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex items-center gap-2">
            <FaUsers className="text-xl text-blue-500" />
            <CardTitle>Total Customers</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold pl-2">{stats.totalCustomers}</CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center gap-2">
            <FaHotel className="text-xl text-green-500" />
            <CardTitle>Total Restaurants</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold pl-2">{stats.totalRestaurants}</CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center gap-2">
            <FaMotorcycle className="text-xl text-orange-500" />
            <CardTitle>Total Delivery People</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold pl-2">{stats.totalDeliveryPeople}</CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend (Monthly)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recently Joined Users */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Joined Users</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="capitalize">{user.role}</TableCell>
                  <TableCell className={user.isActive ? "text-green-600" : "text-red-500"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/admin/user-management")}
                    >
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
