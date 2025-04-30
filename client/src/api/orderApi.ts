import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  Order,
  CreateOrderInput,
  UpdateOrderStatusInput,
  PaginatedResponse,
} from '@/types/order'; // Add PaginatedResponse type

const url = import.meta.env.VITE_API_URL + '/order';

const baseQuery = fetchBaseQuery({
  baseUrl: url,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: baseQuery,
  tagTypes: ['order', 'my-orders', 'all-orders', 'restaurant-orders'],
  endpoints: (builder) => ({
    createOrder: builder.mutation<{ success: boolean; order: Order }, CreateOrderInput>({
      query: (orderData) => ({
        url: '/',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['order'],
    }),

    updateOrderStatus: builder.mutation<{ success: boolean; order: Order }, UpdateOrderStatusInput>({
      query: ({ id, status }) => ({
        url: `/status/${id}`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['order'],
    }),

    cancelOrder: builder.mutation<{ success: boolean; order: Order }, string>({
      query: (id) => ({
        url: `/cancel/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: ['my-orders'],
    }),

    getAllOrders: builder.query<PaginatedResponse<Order>, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => ({
        url: `?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      providesTags: ['all-orders'],
    }),

    getCustomerOrders: builder.query<PaginatedResponse<Order>, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/customer?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      providesTags: ['my-orders'],
    }),

    getRestaurantOrders: builder.query<PaginatedResponse<Order>, { restaurantId: string; page?: number; limit?: number }>({
      query: ({ restaurantId, page = 1, limit = 10 }) => ({
        url: `/restaurant/${restaurantId}?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      providesTags: ['restaurant-orders'],
    }),

    getOrderById: builder.query<{ success: boolean; order: Order }, string>({
      query: (orderId) => ({
        url: `/${orderId}`,
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
