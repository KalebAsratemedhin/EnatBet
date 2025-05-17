import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { Card } from "@/components/ui/card";
import { useGetRestaurantOwnerDashboardQuery } from "@/redux/api/dashboardApi";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#6366f1"];

const StatCard = ({ label, value }: { label: string; value: string | number }) => (
  <Card className="p-4 rounded-lg shadow-sm border">
    <h4 className="text-sm text-gray-500">{label}</h4>
    <p className="text-xl font-semibold text-gray-800">{value}</p>
  </Card>
);

const RestaurantOwnerDashboard = () => {
  const { data, isLoading } = useGetRestaurantOwnerDashboardQuery();

  if (isLoading || !data) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }

  const {
    totalSales,
    totalOrders,
    restaurantCount,
    salesOverTime,
    salesShare,
    ordersPerRestaurant,
    customersPerRestaurant,
  } = data;

  const restaurantNames = salesShare.map((r) => r.name);

  return (
    <div className="p-4 md:p-6 space-y-10">
      <h2 className="text-2xl font-bold text-gray-800">My Restaurants Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Total Sales" value={`$${totalSales.toLocaleString()}`} />
        <StatCard label="Total Orders" value={totalOrders} />
        <StatCard label="Number of Restaurants" value={restaurantCount} />
      </div>

      {/* Line & Pie Chart Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Line Chart */}
        <section className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Monthly Sales per Restaurant</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {restaurantNames.map((name, index) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </section>

        {/* Pie Chart */}
        <section className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Sales Share by Restaurant</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={salesShare}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {salesShare.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </section>
      </div>

      {/* Orders and Customers Bar Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Orders */}
        <section className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Orders per Restaurant</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ordersPerRestaurant}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* Customers */}
        <section className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Customers per Restaurant</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={customersPerRestaurant}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="customers" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>
    </div>
  );
};

export default RestaurantOwnerDashboard;
