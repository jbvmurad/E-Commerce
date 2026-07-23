export interface MessageResponse {
  message: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  refreshTokenExpires: string | null;
  userId: string;
}

export type ExternalLoginStatus = 'Authenticated' | 'RegistrationRequired' | 'AccountExists';

export interface ExternalLoginResponse {
  status: ExternalLoginStatus;
  token: string | null;
  refreshToken: string | null;
  refreshTokenExpires: string | null;
  userId: string | null;
  fullName: string | null;
  email: string | null;
}

export interface UserResponse {
  id: string;
  fullName: string;
  email: string | null;
  userName: string | null;
  phoneNumber: string | null;
  imageUrl: string | null;
  emailConfirmed: boolean;
}

export interface RoleResponse {
  id: string;
  name: string | null;
}

export interface UserRoleResponse {
  userId: string;
  userFullName: string;
  userEmail: string | null;
  roleId: string;
  roleName: string | null;
}

export interface ProfileResponse {
  id: string;
  userId: string;
  fullName: string;
  phoneNumber: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface UserAddressResponse {
  id: string;
  title: string;
  recipientFullName: string;
  phoneNumber: string;
  countryCode: string;
  city: string;
  stateOrRegion: string | null;
  district: string | null;
  addressLine1: string;
  addressLine2: string | null;
  postalCode: string | null;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface AddressPayload {
  title: string;
  recipientFullName: string;
  phoneNumber: string;
  countryCode: string;
  city: string;
  addressLine1: string;
  stateOrRegion?: string;
  district?: string;
  addressLine2?: string;
  postalCode?: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
}
