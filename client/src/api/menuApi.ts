import { MenuResponse } from '@/types/menu';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


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

export const menuApi = createApi({
  reducerPath: 'menuApi',
  baseQuery,
  tagTypes: ['Menu', 'Menus'],
  endpoints: (builder) => ({
    createMenu: builder.mutation({
      query: ({ restaurantId, formData }) => ({
        url: `/menu/createMenu/${restaurantId}`, // Adjust this based on your Express route
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ['Menus'],
    }),
    
    getMenusByRestaurant: builder.query<MenuResponse, string>({
      query: (restaurantId) => `/menu/getMenu/${restaurantId}`,
      providesTags: ['Menus'],
    }),

    getMenuById: builder.query({
      query: (id: string) => `/menu/${id}`,
      providesTags: ['Menu'],
    }),

    updateMenu: builder.mutation({
      query: ({ menuId, formData}) => (
        {
          url: `/menu/updateMenu/${menuId}`,
          method: 'PATCH',
          body: formData
      }),
      invalidatesTags: ['Menus', 'Menu'],
    }),

    deleteMenu: builder.mutation({
      query: (menuId: string) => ({
        url: `/menu/deleteMenu/${menuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Menu', 'Menus'],
    }),
  }),
});


export const {
  useCreateMenuMutation,
  useGetMenusByRestaurantQuery,
  useGetMenuByIdQuery,
  useUpdateMenuMutation,
  useDeleteMenuMutation,
} = menuApi;