import {
  SignupPayload,
  SigninPayload,
  ChangePasswordPayload,
  RoleRequestPayload,
  UpdateRoleStatusPayload,
  CancelRoleRequestPayload,
} from "@/types/requests";
import { User, RoleRequest } from "@/types/api";
import { api } from '.';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['current-user']
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
      providesTags: ['current-user'],
    }),
    
    changePassword: builder.mutation<void, ChangePasswordPayload>({
      query: (data) => ({
        url: '/user/change-password',
        method: 'PUT',
        body: data,
      }),
    }),
    
    getMineRoleRequests: builder.query<RoleRequest[], void>({
      query: () => '/role-request/mine',
      providesTags: ['role-requests']
    }),
    
    getAllRoleRequests: builder.query<RoleRequest[], void>({
      query: () => '/role-request/all',
      providesTags: ['role-requests']
    }),
    
    createRoleRequest: builder.mutation<void, RoleRequestPayload>({
      query: (data) => ({
        url: '/role-request',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['role-requests']
    }),
    
    updateRoleRequestStatus: builder.mutation<void, UpdateRoleStatusPayload>({
      query: ({id, status}) => ({
        url: `/role-request/${id}`,
        method: 'PUT',
        body: {status}
      }),
      invalidatesTags: ['role-requests']
    }),
    
    cancelRoleRequest: builder.mutation<void, CancelRoleRequestPayload>({
      query: ({id}) => ({
        url: `/role-request/cancelled/${id}`,
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
