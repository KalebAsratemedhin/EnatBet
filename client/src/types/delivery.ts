import { Order } from "./order";
import { Restaurant, User } from "./restaurant";

export type DeliveryStatus =
  | "assigned"
  | "picked_up"
  | "on_the_way"
  | "delivered"
  | "failed"
  | "unassigned";

export interface Delivery {
  _id: string;
  status: DeliveryStatus;
  deliveryPersonId: string;
  orderId: Order;
  rating: number;
  totalRating: number;
  createdAt: string;
  updatedAt: string;
  estimatedDeliveryTime: Date;
}

export interface CustomerPopulatedDelivery {
  _id: string;
  status: DeliveryStatus;
  deliveryPersonId: {
    _id: string;
    rating: number;
    userId: {
      name: string;
      phoneNumber: string;
      email: string;
      profileImage: string;
      _id: string;
    };
  };
  orderId: {
    _id: string;
    restaurantID: Restaurant;
    customerID: User;
    orderDetails: {
      item: {
        _id: string;
        name: string;
        price: number;
      };
      quantity: number;
    }[];
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  createdAt: string;
  updatedAt: string;
  estimatedDeliveryTime: Date;
}

export interface PopulatedDelivery {
  _id: string;
  status: DeliveryStatus;
  deliveryPersonId: {
    _id: string;
    name: string;
    phoneNumber: string;
    email: string;
    profileImage: string;
  };
  orderId: Order;
  rating: number;
  totalRating: number;
  createdAt: string;
  updatedAt: string;
  estimatedDeliveryTime: Date;
}

export interface UpdateDeliveryStatusInput {
  id: string;
  status: DeliveryStatus;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}
