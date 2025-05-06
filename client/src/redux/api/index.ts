import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { FetchBaseQueryError, BaseQueryFn, FetchArgs } from '@reduxjs/toolkit/query/react';

const url = import.meta.env.VITE_API_URL

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
  
  
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async(args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        localStorage.clear()
    }

    return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}), 
  tagTypes: ["role-requests", "current-user", "Menu", "Menus", 'order', 'my-orders', 'all-orders', 'restaurant-orders', 'my-restaurants', 'a-restaurant', 'all-restaurants', 'active-restaurants']
});
