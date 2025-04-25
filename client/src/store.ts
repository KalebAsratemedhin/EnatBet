import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/authApi';
import { restaurantApi } from './api/restaurantApi';
import { menuApi } from './api/menuApi';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [restaurantApi.reducerPath]: restaurantApi.reducer,
    [menuApi.reducerPath]: menuApi.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware)
                          .concat(restaurantApi.middleware)
                          .concat(menuApi.middleware)

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;