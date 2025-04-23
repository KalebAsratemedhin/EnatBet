import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  AddRestaurantRequest,
  UpdateRestaurantRequest,
  Restaurant,
  GenericResponse,
  GetRestaurantsResponse,
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
  tagTypes: ['Restaurant'],
  endpoints: (builder) => ({
    addRestaurant: builder.mutation<GenericResponse, AddRestaurantRequest>({
      query: (data) => ({
        url: '/restaurant/addRestaurant',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Restaurant'],
    }),

    updateRestaurant: builder.mutation<GenericResponse, UpdateRestaurantRequest>({
      query: ({ id, data }) => ({
        url: `/restaurant/updateRestaurant/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Restaurant'],
    }),

    deleteRestaurant: builder.mutation<GenericResponse, string>({
      query: (id) => ({
        url: `/restaurant/deleteRestaurant/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Restaurant'],
    }),

    getAllMineRestaurant: builder.query<GetRestaurantsResponse, void>({
      query: () => '/restaurant/getAllMineRestaurant',
      providesTags: ['Restaurant'],
    }),

    getActiveRestaurants: builder.query<GetRestaurantsResponse, void>({
      query: () => '/restaurant/activeRestaurants',
      providesTags: ['Restaurant'],
    }),

    getAllRestaurant: builder.query<GetRestaurantsResponse, void>({
      query: () => '/restaurant/getAllRestaurant',
      providesTags: ['Restaurant'],
    }),

    updateRestaurantStatus: builder.mutation<GenericResponse, {id: string, status: string}>({
      query: ({id, status}) => ({
        url: `/restaurant/updateRestaurantStatus/${id}`,
        method: 'PATCH',
        body: {status}
      }),
      invalidatesTags: ['Restaurant'],
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
} = restaurantApi;
