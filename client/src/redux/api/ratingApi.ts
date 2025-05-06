import { Restaurant } from "@/types/restaurant";
import { api } from ".";
import { PopulatedMenuItem } from "@/types/menu";

export const ratingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    rateEntity: builder.mutation({
      query: ({ entityType, entityId, rating }) => ({
        url: `/rating/${entityType}/${entityId}`,
        method: "PUT",
        body: { rating },
      }),
    }),
    getRatingForEntity: builder.query({
      query: ({ entityType, entityId }) => `/rating/${entityType}/${entityId}`,
    }),
    getTopRestaurants: builder.query<Restaurant[], void>({
      query: () => "/rating/top/restaurants",
    }),
    getTopMenuItems: builder.query<PopulatedMenuItem[], void>({
      query: () => "/rating/top/menu-items",
    }),
  }),
});

export const {
  useRateEntityMutation,
  useGetRatingForEntityQuery,
  useGetTopRestaurantsQuery,
  useGetTopMenuItemsQuery,
} = ratingApi;