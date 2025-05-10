import {
  Order,
  CreateOrderInput,
  UpdateOrderStatusInput,
  PaginatedResponse,
} from '@/types/order';
import { api } from '.';


export const orderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<{ success: boolean; order: Order }, CreateOrderInput>({
      query: (orderData) => ({
        url: '/order',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['order'],
    }),

    updateOrderStatus: builder.mutation<{ success: boolean; order: Order }, UpdateOrderStatusInput>({
      query: ({ id, status }) => ({
        url: `/order/status/${id}`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['restaurant-orders'],
    }),

    cancelOrder: builder.mutation<{ success: boolean; order: Order }, string>({
      query: (id) => ({
        url: `/order/cancel/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: ['my-orders'],
    }),

    getAllOrders: builder.query<PaginatedResponse<Order>, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/order?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      providesTags: ['all-orders'],
    }),

    getCustomerOrders: builder.query<PaginatedResponse<Order>, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/order/customer?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      providesTags: ['my-orders'],
    }),

    getRestaurantOrders: builder.query<PaginatedResponse<Order>, { restaurantId: string; page?: number; limit?: number }>({
      query: ({ restaurantId, page = 1, limit = 10 }) => ({
        url: `/order/restaurant/${restaurantId}?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      providesTags: ['restaurant-orders'],
    }),

    getOrderById: builder.query<{ success: boolean; order: Order }, string>({
      query: (orderId) => ({
        url: `/order/${orderId}`,
        method: 'GET',
      }),
      providesTags: ['order'],
    }),
  }),
});

// Export hooks
export const {
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useGetAllOrdersQuery,
  useGetCustomerOrdersQuery,
  useGetRestaurantOrdersQuery,
  useGetOrderByIdQuery,
} = orderApi;
