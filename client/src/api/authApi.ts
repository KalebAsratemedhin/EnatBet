import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const url = import.meta.env.VITE_API_URL
import { FetchBaseQueryError, BaseQueryFn, FetchArgs } from '@reduxjs/toolkit/query/react';
import {
  SignupPayload,
  SigninPayload,
  ChangePasswordPayload,
  RoleRequestPayload,
  UpdateRoleStatusPayload,
  CancelRoleRequestPayload,
} from "@/types/requests";
import { User, RoleRequest } from "@/types/api";

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


// Wrap the baseQuery to check for a 401 error
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async(args, api, extraOptions) => {
  // Execute the query
  const result = await baseQuery(args, api, extraOptions);

  // Check if we received a 401 Unauthorized error
  if (result.error && result.error.status === 401) {
    localStorage.clear()
  }
  
  return result;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ["role-requests"],
  endpoints: (builder) => ({
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    updateUserProfile: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/user/profile',
        method: 'PUT',
        body: formData,
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
 
    
    signup: builder.mutation<{ token: string; user: User }, SignupPayload>({
      query: (data) => ({
        url: '/auth/signup',
        method: 'POST',
        body: data,
      }),
    }),
    
    signin: builder.mutation<{ token: string; user: User }, SigninPayload>({
      query: (data) => ({
        url: '/auth/signin',
        method: 'POST',
        body: data,
      }),
    }),
    
    getCurrentUser: builder.query<User, void>({
      query: () => '/auth/current-user',
    }),
    
    changePassword: builder.mutation<void, ChangePasswordPayload>({
      query: (data) => ({
        url: '/user/change-password',
        method: 'PUT',
        body: data,
      }),
    }),
    
    getMineRoleRequests: builder.query<RoleRequest[], void>({
      query: () => '/auth/role-request/mine',
      providesTags: ['role-requests']
    }),
    
    getAllRoleRequests: builder.query<RoleRequest[], void>({
      query: () => '/auth/role-request/all',
      providesTags: ['role-requests']
    }),
    
    createRoleRequest: builder.mutation<void, RoleRequestPayload>({
      query: (data) => ({
        url: '/auth/role-request',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['role-requests']
    }),
    
    updateRoleRequestStatus: builder.mutation<void, UpdateRoleStatusPayload>({
      query: ({id, status}) => ({
        url: `/auth/role-request/${id}`,
        method: 'PUT',
        body: {status}
      }),
      invalidatesTags: ['role-requests']
    }),
    
    cancelRoleRequest: builder.mutation<void, CancelRoleRequestPayload>({
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
