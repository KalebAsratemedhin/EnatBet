import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  AddRestaurantRequest,
  UpdateRestaurantRequest,
  GenericResponse,
  GetRestaurantsResponse,
  GetRestaurantDetailsResponse,
} from '../types/restaurant';

const url = import.meta.env.VITE_API_URL;

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

export const restaurantApi = createApi({
  reducerPath: 'restaurantApi',
  baseQuery,
  tagTypes: ['my-restaurants', 'a-restaurant', 'all-restaurants', 'active-restaurants'],
  endpoints: (builder) => ({
    addRestaurant: builder.mutation<GenericResponse, AddRestaurantRequest>({
      query: (data) => ({
        url: '/restaurant/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['my-restaurants'],
    }),

    updateRestaurant: builder.mutation<GenericResponse, UpdateRestaurantRequest>({
      query: ({ id, data }) => ({
        url: `/restaurant/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['my-restaurants'],
    }),

    deleteRestaurant: builder.mutation<GenericResponse, string>({
      query: (id) => ({
        url: `/restaurant/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['my-restaurants'],
    }),

    getAllMineRestaurant: builder.query<GetRestaurantsResponse, { page?: number; limit?: number;}>({
      query: ({ page, limit }) =>
        `/restaurant/mine?page=${page}&limit=${limit}`,
      providesTags: ["my-restaurants"],
    }),

    rateRestaurant:  builder.mutation<GenericResponse, UpdateRestaurantRequest>({
      query: ({ id, data }) => ({
        url: `/restaurant/rate/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['my-restaurants'],
    }), 

    getActiveRestaurants: builder.query<GetRestaurantsResponse, { page: number; limit: number; search?: string; rating?: string }>({
      query: ({ page, limit, search, rating }) =>
        `/restaurant/active?page=${page}&limit=${limit}&search=${search}&rating=${rating}`,
      providesTags: ["active-restaurants"],
    }),

    getRestaurantById: builder.query<GetRestaurantDetailsResponse, string>({
      query: (id) => `/restaurant/${id}`,
      providesTags: ['a-restaurant'],
    }),
    getAllRestaurant: builder.query<GetRestaurantsResponse, {page: number, limit: number}>({
      query: ({ page = 1, limit = 10 }) => `/restaurant/all?page=${page}&limit=${limit}`,
      providesTags: ['all-restaurants'],
    }),

    updateRestaurantStatus: builder.mutation<GenericResponse, {id: string, status: string}>({
      query: ({id, status}) => ({
        url: `/restaurant/status/${id}`,
        method: 'PATCH',
        body: {status}
      }),
      invalidatesTags: ['all-restaurants'],
    }),
  }),
});

export const {
  useAddRestaurantMutation,
  useUpdateRestaurantMutation,
  useDeleteRestaurantMutation,
  useGetAllMineRestaurantQuery,
  useGetActiveRestaurantsQuery,
  useGetAllRestaurantQuery,
  useUpdateRestaurantStatusMutation,
  useGetRestaurantByIdQuery,
  useRateRestaurantMutation
} = restaurantApi;
