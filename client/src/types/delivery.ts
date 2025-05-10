import { Order } from "./order";

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
