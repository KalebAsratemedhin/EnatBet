import AdminDashboard from "@/components/AdminDashboard";
import CustomerDashboard from "@/components/CustomerDashboard";
import DeliveryDashboard from "@/components/DeliveryPersonDashboard";
import RestaurantOwnerDashboard from "@/components/RestaurantOwnerDashboard";
import { useGetCurrentUserQuery } from "@/redux/api/authApi";

const Dashboard = () => {
  const { data: user } = useGetCurrentUserQuery();

  return <div>
    {user?.role === "customer" && <CustomerDashboard /> }
    {user?.role === "restaurant_owner" && <RestaurantOwnerDashboard /> }
    {user?.role === "delivery_person" && <DeliveryDashboard /> }
    {user?.role === "admin" && <AdminDashboard /> }

  </div>;
};

export default Dashboard;
