import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FaHamburger, FaPizzaSlice, FaWineBottle, FaUsers } from 'react-icons/fa';
import { StatsCard } from '../components/StatsCard';

const salesData = [
  { name: 'Burger', sales: 240 },
  { name: 'Pizza', sales: 390 },
  { name: 'Pasta', sales: 170 },
];

const orderStatusData = [
  { name: 'Completed', value: 12 },
  { name: 'Pending', value: 5 },
  { name: 'Cancelled', value: 3 },
];

const customerRatings = [
  { rating: '5 Stars', count: 20 },
  { rating: '4 Stars', count: 10 },
  { rating: '3 Stars', count: 5 },
  { rating: '2 Stars', count: 1 },
];

const COLORS = ['#4CAF50', '#FF9800', '#F44336'];

const RestaurantOwnerDashboard = () => (
  <div className="p-4 md:p-6 space-y-8">
    {/* Header */}
    <div className="flex justify-between items-center flex-wrap gap-4">
      <h2 className="text-2xl font-semibold text-gray-800">Restaurant Dashboard</h2>
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <StatsCard label="Total Sales" value="$8,550" icon={<FaHamburger className="text-xl text-red-500" />} />
      <StatsCard label="Avg. Order Value" value="$20.50" icon={<FaPizzaSlice className="text-xl text-yellow-500" />} />
      <StatsCard label="Total Customers" value={350} icon={<FaUsers className="text-xl text-blue-500" />} />
      <StatsCard label="Total Orders" value={200} icon={<FaWineBottle className="text-xl text-green-500" />} />
    </div>

    {/* Charts Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Sales Data Bar Chart */}
      <section className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Sales by Product</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Order Status Pie Chart */}
      <section className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Order Status Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={orderStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
              {orderStatusData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </section>
    </div>

    {/* Customer Ratings */}
    <section className="bg-white p-6 rounded shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Customer Ratings</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {customerRatings.map((rating, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded shadow">
            <h4 className="font-semibold text-gray-700">{rating.rating}</h4>
            <p className="text-gray-500">Count: {rating.count}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default RestaurantOwnerDashboard;
