import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/authApi';
import { restaurantApi } from './api/restaurantApi';
import { menuApi } from './api/menuApi';
import { orderApi } from './api/orderApi';
import cartReducer from './cartSlice'

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [restaurantApi.reducerPath]: restaurantApi.reducer,
    [menuApi.reducerPath]: menuApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    cart: cartReducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware)
                          .concat(restaurantApi.middleware)
                          .concat(menuApi.middleware)
                          .concat(orderApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;