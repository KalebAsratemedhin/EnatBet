import { Notification } from "@/types/notification";
import { api } from "./index";

export const notificationsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<Notification[], void>({
      query: () => "/notification",
    }),
    markNotificationsAsSeen: builder.mutation<Notification, {id: string}>({
      query: ({id}) => ({
        url: `/notification/mark-as-seen/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationsAsSeenMutation,
} = notificationsApi;
