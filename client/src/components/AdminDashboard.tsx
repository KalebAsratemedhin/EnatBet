import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaUsers, FaChartBar, FaBox, FaDollarSign } from 'react-icons/fa';
import { StatsCard } from '../components/StatsCard';

const salesData = [
  { name: 'January', sales: 1200 },
  { name: 'February', sales: 1500 },
  { name: 'March', sales: 1700 },
  { name: 'April', sales: 1900 },
];

const userData = [
  { name: 'Active Users', value: 120 },
  { name: 'Inactive Users', value: 45 },
  { name: 'New Users', value: 30 },
];

const revenueData = [
  { name: 'Completed Orders', value: 5000 },
  { name: 'Pending Orders', value: 1500 },
  { name: 'Cancelled Orders', value: 700 },
];

const COLORS = ['#22c55e', '#facc15', '#ef4444'];

const AdminDashboard = () => (
  <div className="p-4 md:p-6 space-y-8">
    {/* Header */}
    <div className="flex justify-between items-center flex-wrap gap-4">
      <h2 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h2>
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <StatsCard label="Total Users" value={150} icon={<FaUsers className="text-xl text-blue-500" />} />
      <StatsCard label="Total Revenue" value="$12,500" icon={<FaDollarSign className="text-xl text-green-500" />} />
      <StatsCard label="Orders Processed" value={1200} icon={<FaBox className="text-xl text-yellow-500" />} />
      <StatsCard label="Pending Orders" value={150} icon={<FaChartBar className="text-xl text-red-500" />} />
    </div>

    {/* Charts Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Sales Trend */}
      <section className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Sales Trend (Monthly)</h3>
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

      {/* User Distribution */}
      <section className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">User Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={userData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>

    {/* Revenue Breakdown */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Revenue Breakdown */}
      <section className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Revenue Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>

    {/* Pending Orders Table */}
    <section className="bg-white p-6 rounded shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Pending Orders</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm text-left">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-2 px-4">Order ID</th>
              <th className="py-2 px-4">Customer</th>
              <th className="py-2 px-4">Restaurant</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Replace the below rows with dynamic data */}
            <tr className="border-b">
              <td className="py-2 px-4">12345</td>
              <td className="py-2 px-4">John Doe</td>
              <td className="py-2 px-4">Pizza Hub</td>
              <td className="py-2 px-4">Pending</td>
              <td className="py-2 px-4">
                <button className="bg-blue-500 text-white py-1 px-3 rounded">Process</button>
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4">12346</td>
              <td className="py-2 px-4">Jane Smith</td>
              <td className="py-2 px-4">Burger Palace</td>
              <td className="py-2 px-4">Pending</td>
              <td className="py-2 px-4">
                <button className="bg-blue-500 text-white py-1 px-3 rounded">Process</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
);

export default AdminDashboard;
