import { AdminDashboard, CustomerDashboard, DashboardData, RestaurantDashboard } from "@/types/dashboard"; // import the interface you just created
import { api } from ".";

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCustomerDashboard: builder.query<CustomerDashboard, void>({
      query: () => ({
        url: `/dashboard/customer`,
        method: "GET",
      }),
      providesTags: ["customer-dashboard"],
    }),
    getAdminDashboard: builder.query<AdminDashboard, void>({
      query: () => ({
        url: `/dashboard/admin`,
        method: "GET",
      }),
      providesTags: ["admin-dashboard"],
    }),
    getRestaurantDashboard: builder.query<RestaurantDashboard, string>({
      query: (restaurantId) => ({
        url: `/dashboard/restaurant/${restaurantId}`,
        method: "GET",
      }),
      providesTags: ["restaurant-dashboard"],
    }),
    getRestaurantOwnerDashboard: builder.query<RestaurantDashboard, void>({
      query: () => ({
        url: `/dashboard/restaurant-owner`,
        method: "GET",
      }),
      providesTags: ["restaurant-dashboard"],
    }),
    getDeliveryDashboard: builder.query<DashboardData, void>({
      query: () => `/dashboard/delivery-person`,
    }),
  }),
});

export const {
  useGetCustomerDashboardQuery,
  useGetAdminDashboardQuery,
  useGetRestaurantDashboardQuery,
  useGetRestaurantOwnerDashboardQuery,
  useGetDeliveryDashboardQuery
} = dashboardApi;
