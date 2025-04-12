import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
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

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  tagTypes: ["role-requests"],
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (data) => ({
        url: '/auth/signup',
        method: 'POST',
        body: data,
      }),
    }),
    signin: builder.mutation({
      query: (data) => ({
        url: '/auth/signin',
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    getCurrentUser: builder.query<any, void>({
      query: () => '/auth/current-user',
    }),
    updateUserProfile: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/user/profile',
        method: 'PUT',
        body: formData,
      }),
    }),
    changePassword: builder.mutation<void, void>({
      query: (data) => ({
        url: '/user/change-password',
        method: 'PUT',
        body: data,
      }),
    }),
    verifyEmail: builder.mutation<void, void>({
      query: () => ({
        url: '/user/verify-email',
        method: 'POST',
      }),
    }),
    deleteAccount: builder.mutation<void, void>({
      query: () => ({
        url: '/user/delete-account',
        method: 'DELETE',
      }),
    }),
    getMineRoleRequests: builder.query<any, void>({
      query: () => '/auth/role-request/mine',
      providesTags: ['role-requests']
    }),
    getAllRoleRequests: builder.query<any, void>({
      query: () => '/auth/role-request/all',
      providesTags: ['role-requests']
    }),
    createRoleRequest: builder.mutation<void, any>({
      query: (data) => ({
        url: '/auth/role-request',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['role-requests']
    }),
    updateRoleRequestStatus: builder.mutation<void, { id: string, status: string }>({
      query: ({id, status}) => ({
        url: `/auth/role-request/${id}`,
        method: 'PUT',
        body: {status}
      }),
      invalidatesTags: ['role-requests']

    }),
    cancelRoleRequest: builder.mutation<void, { id: string }>({
      query: ({id}) => ({
        url: `/auth/role-request/cancelled/${id}`,
        method: 'PUT'
      }),
      invalidatesTags: ['role-requests']

    }),
  }),
});

export const {
  useSignupMutation,
  useSigninMutation,
  useGetCurrentUserQuery,
  useLogoutMutation,
  useUpdateUserProfileMutation,
  useChangePasswordMutation,
  useVerifyEmailMutation,
  useDeleteAccountMutation,
  useCreateRoleRequestMutation,
  useGetMineRoleRequestsQuery,
  useGetAllRoleRequestsQuery,
  useUpdateRoleRequestStatusMutation,
  useCancelRoleRequestMutation,
} = authApi;
