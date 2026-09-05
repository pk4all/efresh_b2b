export interface B2BLoginCredentials {
  email: string;
  password: string;
}

export interface B2BUser {
  id?: string | number;
  name?: string;
  email?: string;
  role?: string;
  accountId?: string | number;
  accountName?: string;
  [key: string]: any;
}

export interface B2BLoginResponse {
  access_token?: string;
  token?: string;
  token_type?: string;
  status?: string;
  success?: boolean;
  message?: string;
  user?: B2BUser;
  data?: any;
  detail?: string;
  [key: string]: any;
}
