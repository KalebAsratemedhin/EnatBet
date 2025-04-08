import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

import { FaShoppingBag, FaStar, FaClock, FaUtensils } from 'react-icons/fa';
import CountdownTimer from '../components/CountdownTimer';
import { StatsCard } from '../components/StatsCard';

const spendingData = [
  { month: 'Jan', amount: 120 },
  { month: 'Feb', amount: 250 },
  { month: 'Mar', amount: 200 },
  { month: 'Apr', amount: 300 },
];

const orderStatusData = [
  { name: 'Completed', value: 12 },
  { name: 'Cancelled', value: 2 },
  { name: 'In Progress', value: 4 },
];

const favoriteRestaurants = [
  { name: 'Burger Palace', orders: 10 },
  { name: 'Pizza Hub', orders: 7 },
  { name: 'Sushi Place', orders: 5 },
];

const COLORS = ['#00C49F', '#FF8042', '#FFBB28'];

const recentOrders = [
  { id: 1, restaurant: 'Burger Palace', status: 'Completed', time: '30 mins' },
  { id: 2, restaurant: 'Pizza Hub', status: 'In Progress', time: '—' },
  { id: 3, restaurant: 'Sushi Place', status: 'Cancelled', time: '—' },
];

const CustomerDashboard = () => {
  return (
    <div className="p-4 md:p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">Customer Dashboard</h2>
        <CountdownTimer targetTime="2025-04-01T17:30:00" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard label="Orders Made" value={42} icon={<FaShoppingBag className="text-xl text-red-500" />} />
        <StatsCard label="Avg. Delivery Time" value="30 mins" icon={<FaClock className="text-xl text-yellow-500" />} />
        <StatsCard label="Rating" value="4.5/5" icon={<FaStar className="text-xl text-green-500" />} />
        <StatsCard label="Restaurants Ordered From" value={15} icon={<FaUtensils className="text-xl text-blue-500" />} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Spending Trend */}
        <section className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Monthly Spending</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={spendingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#EF4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </section>

        {/* Order Status */}
        <section className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Order Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </section>
      </div>

      {/* Favorite Restaurants */}
      <section className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Most Ordered Restaurants</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={favoriteRestaurants}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="orders" fill="#F59E0B" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Recent Orders */}
      <section className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm text-left">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-2 px-4">Restaurant</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Delivery Time</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="py-2 px-4">{order.restaurant}</td>
                  <td className="py-2 px-4">{order.status}</td>
                  <td className="py-2 px-4">{order.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default CustomerDashboard;
