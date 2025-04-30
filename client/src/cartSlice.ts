import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MenuItem } from "@/types/menu";

interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface CartState {
  items: Record<string, CartItem>;
  restaurantId: string | null;
}

const initialState: CartState = {
  items: {},
  restaurantId: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    add: (state, action: PayloadAction<{ item: MenuItem; restaurantId: string }>) => {
      const { item, restaurantId } = action.payload;
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        state.items = {};
      }
      if (!state.restaurantId || state.restaurantId !== restaurantId) {
        state.restaurantId = restaurantId;
      }
      if (state.items[item._id]) {
        state.items[item._id].quantity++;
      } else {
        state.items[item._id] = { item, quantity: 1 };
      }
    },
    increment: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;

      if (state.items[itemId]) {
        state.items[itemId].quantity++;
      }
    },
    decrement: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      if (state.items[itemId]) {
        if (state.items[itemId].quantity > 1) {
          state.items[itemId].quantity--;
        } else {
          delete state.items[itemId];
        }

        if (Object.keys(state.items).length === 0) {
          state.restaurantId = null;
        }
      }
    },
    clearCart: (state) => {
      state.items = {};
      state.restaurantId = null;
    },
  },
});

export const { increment, add, decrement, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
