// types/requests.ts
export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
}

export interface SigninPayload {
  email: string;
  password: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface RoleRequestPayload {
  requestedRole: string;
  remark?: string;
}

export interface UpdateRoleStatusPayload {
  id: string;
  isActive: boolean;
}

export interface CancelRoleRequestPayload {
  id: string;
}
