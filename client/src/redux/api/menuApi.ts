import { MenuResponse } from '@/types/menu';
import { api } from '.';


export const menuApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createMenu: builder.mutation({
      query: ({ restaurantId, formData }) => ({
        url: `/menu/createMenu/${restaurantId}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Menus"],
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
          method: 'PUT',
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