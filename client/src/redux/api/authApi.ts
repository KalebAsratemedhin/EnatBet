import {
  SignupPayload,
  SigninPayload,
  ChangePasswordPayload,
  UpdateRoleStatusPayload,
} from "@/types/requests";
import { User } from "@/types/api";
import { api } from ".";
import { PaginatedResponse } from "@/types/order";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["current-user"],
    }),
    updateUserProfile: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/user/profile",
        method: "PUT",
        body: formData,
      }),
    }),

    sendOTP: builder.mutation<void, void>({
      query: () => ({
        url: "/user/send-verification-email",
        method: "POST",
      }),
    }),
    
    verifyEmail: builder.mutation<void, { otp: string }>({
      query: (body) => ({
        url: "/user/verify-email",
        method: "POST",
        body,
      }),
    }),

    deleteAccount: builder.mutation<void, void>({
      query: () => ({
        url: "/user/delete-account",
        method: "DELETE",
      }),
    }),

    signup: builder.mutation<{ token: string; user: User }, SignupPayload>({
      query: (data) => ({
        url: "/auth/signup",
        method: "POST",
        body: data,
      }),
    }),

    signin: builder.mutation<{ token: string; user: User }, SigninPayload>({
      query: (data) => ({
        url: "/auth/signin",
        method: "POST",
        body: data,
      }),
    }),

    getCurrentUser: builder.query<User, void>({
      query: () => "/auth/current-user",
      providesTags: ["current-user"],
    }),

    changePassword: builder.mutation<void, ChangePasswordPayload>({
      query: (data) => ({
        url: "/user/change-password",
        method: "PUT",
        body: data,
      }),
    }),

    getAllUsers: builder.query<
      PaginatedResponse<User>,
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => `/user/all?page=${page}&limit=${limit}`,
      providesTags: ["users"],
    }),

    updateUserStatus: builder.mutation<void, UpdateRoleStatusPayload>({
      query: ({ id, isActive }) => ({
        url: `/user/status/${id}`,
        method: "PUT",
        body: { isActive },
      }),
      invalidatesTags: ["users"],
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
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
  useSendOTPMutation
} = authApi;
