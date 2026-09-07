export interface AccountLocation {
  id: string;
  type?: string;
  name: string;
  address?: string;
}

export interface AccountDetail {
  id: string;
  businessName?: string;
  abn?: string;
  primaryContact?: string;
  accountsEmail?: string;
  paymentTerms?: string;
  creditLimit?: number;
  creditUsed?: number;
  availableCredit?: number;
  status?: string;
  pricingGroup?: string;
  locations?: AccountLocation[];
  [key: string]: any;
}

export interface AccountDetailResponse {
  status?: string;
  data?: AccountDetail;
  id?: string;
  businessName?: string;
  abn?: string;
  primaryContact?: string;
  accountsEmail?: string;
  paymentTerms?: string;
  creditLimit?: number;
  creditUsed?: number;
  availableCredit?: number;
  statusText?: string;
  pricingGroup?: string;
  locations?: AccountLocation[];
  [key: string]: any;
}

export interface AccountUserPermissions {
  location?: string;
  ordering?: string;
  invoices?: string;
  receiving?: string;
  [key: string]: any;
}

export interface AccountUser {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions?: AccountUserPermissions;
  status?: string;
  [key: string]: any;
}

export interface AccountUsersResponse {
  status?: string;
  data?: AccountUser[];
  users?: AccountUser[];
  [key: string]: any;
}

export interface CreateAccountUserPayload {
  name: string;
  email: string;
  role: string;
  permissions?: AccountUserPermissions;
  vendor_id?: string;
}

export interface CreateAccountUserResponse {
  status?: string;
  id?: string;
  message?: string;
  [key: string]: any;
}
