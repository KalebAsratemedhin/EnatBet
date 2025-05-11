// types/api.ts
export interface User {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  phoneNumber: string;
  address: string;
  profileImage?: string;
  role: ("admin" | "customer" | "restaurant_owner" | "delivery_person")[];
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}

export interface RoleRequest {
  _id: string;
  userId: User;
  requestedRole: ("restaurant_owner" | "delivery_person" | "admin")[];
  status: "pending" | "approved" | "disapproved" | "cancelled";
  remark?: string;
  createdAt: string;
  updatedAt: string;
}
