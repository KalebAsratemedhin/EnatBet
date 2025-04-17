// src/services/menuApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  CreateMenuRequest,
  UpdateMenuRequest,
  GetMenuResponse,
  GenericResponse,
} from '../types/menu';

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
  tagTypes: ['Menu'],
  endpoints: (builder) => ({
    createMenu: builder.mutation<GenericResponse, CreateMenuRequest>({
      query: (data) => {
        // const formData = new FormData();
        // formData.append('menuName', data.menuName);
        // formData.append('restaurant', data.restaurant);
        // formData.append('menuItems', JSON.stringify(data.menuItems));
        // data.itemPictures?.forEach((file) => {
        //   formData.append('itemPictures', file);
        // });

        return {
          url: '/menu',
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['Menu'],
    }),

    getMenuById: builder.query<GetMenuResponse, string>({
      query: (id) => `/menu/${id}`,
      providesTags: ['Menu'],
    }),

    updateMenu: builder.mutation<GenericResponse, UpdateMenuRequest>({
      query: ({ id, ...data }) => {
        const formData = new FormData();
        formData.append('menuName', data.menuName);
        formData.append('restaurant', data.restaurant);
        formData.append('menuItems', JSON.stringify(data.menuItems));
        data.itemPictures?.forEach((file) => {
          formData.append('itemPictures', file);
        });

        return {
          url: `/menu/${id}`,
          method: 'PUT',
          body: formData,
        };
      },
      invalidatesTags: ['Menu'],
    }),

    deleteMenu: builder.mutation<GenericResponse, string>({
      query: (id) => ({
        url: `/menu/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Menu'],
    }),
  }),
});


export const {
    useCreateMenuMutation,
    useDeleteMenuMutation,
    useGetMenuByIdQuery,
    useUpdateMenuMutation
} = menuApi;