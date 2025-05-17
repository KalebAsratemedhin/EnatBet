import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import { FaShoppingBag, FaUtensils, FaMoneyBillWave } from 'react-icons/fa';
import { StatsCard } from '../components/StatsCard';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useGetCustomerDashboardQuery } from '@/redux/api/dashboardApi';

const COLORS = ['#00C49F', '#FF8042', '#FFBB28'];

const statusColor: Record<string, { text: string; border: string }> = {
  "Completed": { text: 'text-green-600', border: 'border-green-300' },
  "In Progress": { text: 'text-yellow-600', border: 'border-yellow-300' },
  "Cancelled": { text: 'text-red-600', border: 'border-red-300' },
};

const CustomerDashboard = () => {
  const { data, isLoading, error } = useGetCustomerDashboardQuery();

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (error || !data) return <div className="p-6 text-red-600">Failed to load dashboard</div>;

  return (
    <div className="p-4 md:p-6 space-y-8">

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard label="Orders Made" value={data.stats.totalOrders} icon={<FaShoppingBag className="text-xl text-red-500" />} />
        <StatsCard label="Total Money Spent" value={data.stats.totalSpent} icon={<FaMoneyBillWave className="text-xl text-yellow-500" />} />
        <StatsCard label="Restaurants Ordered From" value={data.stats.restaurantsOrderedFrom} icon={<FaUtensils className="text-xl text-blue-500" />} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.monthlySpending}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#EF4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.orderStatusDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {data.orderStatusDistribution.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Favorite Restaurants */}
      <Card>
        <CardHeader>
          <CardTitle>Most Ordered Restaurants</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.favoriteRestaurants}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="orders" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Restaurant</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Delivery Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recentOrders.map((order) => {
                const color = statusColor[order.status] || {
                  text: 'text-gray-600',
                  border: 'border-gray-300',
                };
                return (
                  <TableRow key={order.id}>
                    <TableCell>{order.restaurant}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${color.text} ${color.border}`}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.time}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDashboard;
