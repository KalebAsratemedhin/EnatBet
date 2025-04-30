import { Menu, MenuItem } from "./menu";
import { Restaurant, User } from "./restaurant";

export interface Order {
  _id: string;
  customerID: User;
  status: "pending" | "preparing" | "ready" | "cancelled";
  restaurantID: Restaurant;
  deliveryAddress: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  paymentMethod: "telebirr" | "cbe";
  orderDetails: Array<{
    item: MenuItem;
    quantity: number;
  }>;
}
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}


export interface CreateOrderInput {
  restaurantID: string;
  deliveryAddress: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  paymentMethod: "telebirr" | "cbe";
  orderDetails: Array<{
    item: MenuItem;
    quantity: number;
  }>;
}

export interface UpdateOrderStatusInput {
  id: string;
  status: "preparing" | "ready";
}
