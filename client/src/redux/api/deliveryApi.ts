import {
  CustomerPopulatedDelivery,
  Delivery,
  PaginatedResponse,
  PopulatedDelivery,
  UpdateDeliveryStatusInput,
} from "@/types/delivery";
import { api } from ".";

export const deliveryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    updateDeliveryStatus: builder.mutation<
      { success: boolean; delivery: Delivery },
      UpdateDeliveryStatusInput
    >({
      query: ({ id, status }) => ({
        url: `/delivery/status/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: [
        "delivery-person-deliveries",
        "all-deliveries",
        "customer-deliveries",
      ],
    }),

    getDeliveryPersonDeliveries: builder.query<
      PaginatedResponse<Delivery>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/delivery/delivery-person?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["delivery-person-deliveries"],
    }),

    getCustomerDeliveries: builder.query<
      PaginatedResponse<CustomerPopulatedDelivery>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/delivery/customer?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["customer-deliveries"],
    }),

    getAllDeliveries: builder.query<
      PaginatedResponse<Delivery>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/delivery/all?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["all-deliveries"],
    }),
  }),
});

export const {
  useUpdateDeliveryStatusMutation,
  useGetDeliveryPersonDeliveriesQuery,
  useGetCustomerDeliveriesQuery,
  useGetAllDeliveriesQuery,
} = deliveryApi;
