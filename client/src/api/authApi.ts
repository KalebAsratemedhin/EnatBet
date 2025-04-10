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
    getRoleRequests: builder.query<any, void>({
      query: () => '/auth/role-request/mine',
    }),
    createRoleRequest: builder.mutation<void, any>({
      query: (data) => ({
        url: '/auth/role-request',
        method: 'POST',
        body: data,
      }),
    }),
    updateRoleRequestStatus: builder.mutation<void, { id: string }>({
      query: (data) => ({
        url: `/auth/role-request/${data.id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    cancelRoleRequest: builder.mutation<void, { id: string }>({
      query: (data) => ({
        url: `/user/role-request/cancelled/${data.id}`,
        method: 'PUT',
        body: data,
      }),
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
  useGetRoleRequestsQuery,
  useUpdateRoleRequestStatusMutation,
  useCancelRoleRequestMutation,
} = authApi;
