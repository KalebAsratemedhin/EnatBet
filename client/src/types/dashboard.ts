export interface CustomerDashboard {
   
    monthlySpending: { month: string; amount: number }[];
    orderStatusDistribution: { name: string; value: number }[];
    favoriteRestaurants: { name: string; orders: number }[];
    stats: {
        totalOrders: number;
        totalSpent: number;
        restaurantsOrderedFrom: number;
    }
    recentOrders: {
      id: string;
      restaurant: string;
      status: string;
      time: string;
    }[];
  }
  
  export interface AdminDashboard {
    stats: {
      totalCustomers: number;
      totalRestaurants: number;
      totalDeliveryPeople: number;
    };
    salesData: {
      name: string;
      sales: number;
    }[];
    userData: {
      name: string;
      value: number;
    }[];
    revenueData: {
      name: string;
      value: number;
    }[];
    recentUsers: {
      _id: string;
      name: string;
      email: string;
      role: string;
      isActive: boolean;
      createdAt: string;
    }[];
  }
  
  export type DeliverySummary = {
    name: string;
    value: number;
  };
  
  export type RecentDelivery = {
    id: string;
    order: string;
    status: string;
    time: string;
  };
  
  export type DashboardData = {
    totalDeliveries: number;
    deliveryData: DeliverySummary[];
    recentDeliveries: RecentDelivery[];
  };


export interface RestaurantDashboard {
  totalSales: number;
  totalOrders: number;
  restaurantCount: number;
  salesOverTime: {
    date: string;
    [restaurantName: string]: number | string;
  }[];
  salesShare: {
    name: string;
    value: number;
  }[];
  ordersPerRestaurant: {
    name: string;
    orders: number;
  }[];
  customersPerRestaurant: {
    name: string;
    customers: number;
  }[];
}
