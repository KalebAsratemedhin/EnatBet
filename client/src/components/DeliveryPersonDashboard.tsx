import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { FaTruck, FaCheckCircle, FaHourglassHalf, FaTimesCircle } from 'react-icons/fa';
import { StatsCard } from '../components/StatsCard';

const deliveryData = [
  { name: 'Completed', value: 24 },
  { name: 'Pending', value: 10 },
  { name: 'Cancelled', value: 3 },
];

const COLORS = ['#22c55e', '#facc15', '#ef4444'];

const totalDeliveries = 37; // Total deliveries for the current period
const avgDeliveryTime = '35 mins'; // Average time per delivery

const recentDeliveries = [
  { id: 1, order: 'Pizza', status: 'Completed', time: '25 mins' },
  { id: 2, order: 'Burger', status: 'Pending', time: '—' },
  { id: 3, order: 'Sushi', status: 'Cancelled', time: '—' },
];

const DeliveryDashboard = () => (
  <div className="p-4 md:p-6 space-y-8">
    {/* Header */}
    <div className="flex justify-between items-center flex-wrap gap-4">
      <h2 className="text-2xl font-semibold text-gray-800">Delivery Dashboard</h2>
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <StatsCard label="Total Deliveries" value={totalDeliveries} icon={<FaTruck className="text-xl text-blue-500" />} />
      <StatsCard label="Avg. Delivery Time" value={avgDeliveryTime} icon={<FaHourglassHalf className="text-xl text-yellow-500" />} />
      <StatsCard label="Completed" value={deliveryData[0].value} icon={<FaCheckCircle className="text-xl text-green-500" />} />
      <StatsCard label="Cancelled" value={deliveryData[2].value} icon={<FaTimesCircle className="text-xl text-red-500" />} />
    </div>

    {/* Charts Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Delivery Status Pie Chart */}
      <section className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Delivery Status Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={deliveryData} dataKey="value" nameKey="name" outerRadius={100} fill="#8884d8" label>
              {deliveryData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </section>

      {/* Recent Deliveries Table */}
      <section className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Recent Deliveries</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm text-left">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-2 px-4">Order</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Delivery Time</th>
              </tr>
            </thead>
            <tbody>
              {recentDeliveries.map((delivery) => (
                <tr key={delivery.id} className="border-b">
                  <td className="py-2 px-4">{delivery.order}</td>
                  <td className="py-2 px-4">{delivery.status}</td>
                  <td className="py-2 px-4">{delivery.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
);

export default DeliveryDashboard;
