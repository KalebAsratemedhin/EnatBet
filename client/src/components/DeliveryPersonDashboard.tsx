import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import {
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa';
import { useGetDeliveryDashboardQuery } from '../redux/api/dashboardApi';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const COLORS = ['#22c55e', '#facc15', '#ef4444'];

const DeliveryDashboard = () => {
  const { data, isLoading, error } = useGetDeliveryDashboardQuery();

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-8">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return <p className="text-red-500 p-4">Failed to load delivery dashboard.</p>;
  }

  return (
    <div className="p-4 md:p-6 space-y-8">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-3xl font-bold text-primary tracking-tight">🚚 Delivery Dashboard</h2>
      </div>

      {/* Stats Cards using ShadCN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-transform duration-200 hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
            <FaTruck className="text-xl text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {data.totalDeliveries}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-transform duration-200 hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <FaCheckCircle className="text-xl text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {data.deliveryData.find((d) => d.name === 'Completed')?.value || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-transform duration-200 hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <FaTimesCircle className="text-xl text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {data.deliveryData.find((d) => d.name === 'Cancelled')?.value || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart and Recent Deliveries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-lg text-primary">📊 Delivery Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.deliveryData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {data.deliveryData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-lg text-primary">📦 Recent Deliveries</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm">
              <thead>
                <tr className="border-b bg-muted text-muted-foreground">
                  <th className="py-2 px-4 text-left">Order</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Delivery Time</th>
                </tr>
              </thead>
              <tbody>
                {data.recentDeliveries.map((delivery) => (
                  <tr key={delivery.id} className="border-b hover:bg-muted/50">
                    <td className="py-2 px-4 font-medium text-primary">
                      {delivery.order}
                    </td>
                    <td className="py-2 px-4">
                      <Badge
                        variant={
                          delivery.status === 'Completed'
                            ? 'default'
                            : delivery.status === 'Cancelled'
                            ? 'destructive'
                            : 'secondary'
                        }
                        className="capitalize px-3 py-1 text-xs"
                      >
                        {delivery.status}
                      </Badge>
                    </td>
                    <td className="py-2 px-4 text-muted-foreground">
                      {new Date(delivery.time).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
