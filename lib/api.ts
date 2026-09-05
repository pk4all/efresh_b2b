import { getStoredToken, getStoredUser } from './auth';
import {
  B2BLoginCredentials,
  B2BLoginResponse,
  DashboardSummaryResponse,
  AccountsSnapshotResponse,
  RecentActivityResponse,
  ProductsResponse,
  CategoriesResponse,
  B2BCart,
  AddCartItemPayload,
  UpdateCartItemPayload,
  PoNumberResponse,
  PaymentOption,
  CreateOrderPayload,
  CreateOrderResponse,
  PurchaseOrdersSummaryResponse,
  PurchaseOrderStatusOptionsResponse,
  PurchaseOrdersResponse,
  PurchaseOrderQueryParams,
  PurchaseOrderDetailResponse,
  PurchaseOrderDetail,
  DeliveriesSummaryResponse,
  DeliveriesResponse,
  DeliveryQueryParams,
  ReceivingSummaryResponse,
  ReceivingResponse,
  ReceivingQueryParams,
  ReceivingReason,
} from '@/types';

export * from '@/types';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://api-efresh-698528526600.australia-southeast2.run.app';

// Helper for authenticated requests
async function authFetch(url: string, options: RequestInit = {}) {
  const token = getStoredToken();
  const user = getStoredUser();
  const defaultVendorId = user?.accountName;

  let finalUrl = url;
  if (defaultVendorId) {
    try {
      const parsedUrl = new URL(url, API_BASE_URL);
      if (!parsedUrl.searchParams.has('vendor_id')) {
        parsedUrl.searchParams.append('vendor_id', defaultVendorId);
      }
      finalUrl = parsedUrl.toString();
    } catch {
      if (!finalUrl.includes('vendor_id=')) {
        const sep = finalUrl.includes('?') ? '&' : '?';
        finalUrl = `${finalUrl}${sep}vendor_id=${encodeURIComponent(defaultVendorId)}`;
      }
    }
  }

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const response = await fetch(finalUrl, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    let errorMsg = 'Request failed';
    if (typeof data.detail === 'string') {
      errorMsg = data.detail;
    } else if (Array.isArray(data.detail) && data.detail.length > 0) {
      errorMsg = data.detail.map((d: any) => d.msg || JSON.stringify(d)).join(', ');
    } else if (data.message) {
      errorMsg = data.message;
    }
    throw new Error(errorMsg);
  }

  return data;
}

// -------------------------------------------------------------
// Authentication APIs
// -------------------------------------------------------------

export async function loginB2B(credentials: B2BLoginCredentials): Promise<B2BLoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/b2b/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      email: credentials.email.trim(),
      password: credentials.password,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    let errorMsg = 'Authentication failed. Please check your credentials.';
    if (typeof data.detail === 'string') {
      errorMsg = data.detail;
    } else if (Array.isArray(data.detail) && data.detail.length > 0) {
      errorMsg = data.detail.map((d: any) => d.msg || JSON.stringify(d)).join(', ');
    } else if (data.message) {
      errorMsg = data.message;
    }
    throw new Error(errorMsg);
  }

  return data;
}

export async function getB2BProfile(token?: string, vendor_id?: string) {
  const url = `${API_BASE_URL}/api/v1/b2b/auth/me${vendor_id ? `?vendor_id=${encodeURIComponent(vendor_id)}` : ''}`;
  return authFetch(url, {
    ...(token ? { headers: { 'Authorization': `Bearer ${token}` } } : {}),
  });
}

// -------------------------------------------------------------
// Dashboard Module APIs
// -------------------------------------------------------------

export async function getDashboardSummary(token?: string, vendor_id?: string): Promise<DashboardSummaryResponse> {
  const url = `${API_BASE_URL}/api/v1/b2b/dashboard/summary${vendor_id ? `?vendor_id=${encodeURIComponent(vendor_id)}` : ''}`;
  return authFetch(url, {
    ...(token ? { headers: { 'Authorization': `Bearer ${token}` } } : {}),
  });
}

export async function getAccountsSnapshot(token?: string, vendor_id?: string): Promise<AccountsSnapshotResponse> {
  const url = `${API_BASE_URL}/api/v1/b2b/dashboard/accounts-snapshot${vendor_id ? `?vendor_id=${encodeURIComponent(vendor_id)}` : ''}`;
  return authFetch(url, {
    ...(token ? { headers: { 'Authorization': `Bearer ${token}` } } : {}),
  });
}

export async function getRecentActivity(token?: string, vendor_id?: string): Promise<RecentActivityResponse> {
  const url = `${API_BASE_URL}/api/v1/b2b/dashboard/recent-activity${vendor_id ? `?vendor_id=${encodeURIComponent(vendor_id)}` : ''}`;
  return authFetch(url, {
    ...(token ? { headers: { 'Authorization': `Bearer ${token}` } } : {}),
  });
}

// -------------------------------------------------------------
// Products & Catalog Module APIs
// -------------------------------------------------------------

export interface ProductQueryParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
  sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'popular' | string;
  vendor_id?: string;
}

export async function getB2BProducts(params?: ProductQueryParams): Promise<ProductsResponse> {
  const query = new URLSearchParams();
  const user = getStoredUser();
  const vendor_id = params?.vendor_id || user?.accountName;
  if (vendor_id) query.append('vendor_id', vendor_id);
  if (params?.search) query.append('search', params.search);
  if (params?.category && params.category !== 'All' && params.category !== 'all') {
    query.append('category', params.category);
  }
  if (params?.page) query.append('page', params.page.toString());
  if (params?.limit) query.append('limit', params.limit.toString());
  if (params?.sort) query.append('sort', params.sort);

  const queryString = query.toString();
  const url = `${API_BASE_URL}/api/v1/b2b/products${queryString ? `?${queryString}` : ''}`;
  return authFetch(url);
}

export async function getB2BCategories(vendor_id?: string): Promise<CategoriesResponse> {
  const url = `${API_BASE_URL}/api/v1/b2b/products/categories${vendor_id ? `?vendor_id=${encodeURIComponent(vendor_id)}` : ''}`;
  return authFetch(url);
}

// -------------------------------------------------------------
// Cart & PO Creation Module APIs
// -------------------------------------------------------------

export async function getB2BCart(vendor_id?: string): Promise<B2BCart> {
  const url = `${API_BASE_URL}/api/v1/b2b/cart${vendor_id ? `?vendor_id=${encodeURIComponent(vendor_id)}` : ''}`;
  return authFetch(url);
}

export async function addB2BCartItem(payload: AddCartItemPayload, vendor_id?: string): Promise<B2BCart> {
  const url = `${API_BASE_URL}/api/v1/b2b/cart/items${vendor_id ? `?vendor_id=${encodeURIComponent(vendor_id)}` : ''}`;
  return authFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function updateB2BCartItem(
  cartItemId: string,
  payload: UpdateCartItemPayload,
  vendor_id?: string
): Promise<B2BCart> {
  const url = `${API_BASE_URL}/api/v1/b2b/cart/items/${encodeURIComponent(cartItemId)}${vendor_id ? `?vendor_id=${encodeURIComponent(vendor_id)}` : ''}`;
  return authFetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function removeB2BCartItem(cartItemId: string, vendor_id?: string): Promise<B2BCart> {
  const user = getStoredUser();
  const vId = vendor_id || user?.accountName;
  const url = `${API_BASE_URL}/api/v1/b2b/cart/items/${encodeURIComponent(cartItemId)}${vId ? `?vendor_id=${encodeURIComponent(vId)}` : ''}`;
  return authFetch(url, {
    method: 'DELETE',
  });
}

export async function clearB2BCart(vendor_id?: string): Promise<{ status?: string; message?: string }> {
  const user = getStoredUser();
  const vId = vendor_id || user?.accountName;
  const url = `${API_BASE_URL}/api/v1/b2b/cart${vId ? `?vendor_id=${encodeURIComponent(vId)}` : ''}`;
  return authFetch(url, {
    method: 'DELETE',
  });
}

// -------------------------------------------------------------
// Checkout & Order Creation Module APIs
// -------------------------------------------------------------

export async function getB2BLocationStores(vendor_id?: string): Promise<any> {
  const user = getStoredUser();
  const vId = vendor_id || user?.accountName;
  const url = `${API_BASE_URL}/api/v1/b2b/locations/stores${vId ? `?vendor_id=${encodeURIComponent(vId)}` : ''}`;
  try {
    return await authFetch(url);
  } catch {
    const fallbackUrl = `${API_BASE_URL}/api/v1/b2b/locations/stors${vId ? `?vendor_id=${encodeURIComponent(vId)}` : ''}`;
    return authFetch(fallbackUrl).catch(() =>
      authFetch(`${API_BASE_URL}/api/v1/b2b/locations${vId ? `?vendor_id=${encodeURIComponent(vId)}` : ''}`)
    );
  }
}

export async function getB2BLocations(vendor_id?: string): Promise<any> {
  const user = getStoredUser();
  const vId = vendor_id || user?.accountName;
  const url = `${API_BASE_URL}/api/v1/b2b/locations${vId ? `?vendor_id=${encodeURIComponent(vId)}` : ''}`;
  return authFetch(url);
}

export async function getB2BPoNumber(vendor_id?: string): Promise<PoNumberResponse> {
  const user = getStoredUser();
  const vId = vendor_id || user?.accountName;
  const url = `${API_BASE_URL}/api/v1/b2b/po-number${vId ? `?vendor_id=${encodeURIComponent(vId)}` : ''}`;
  return authFetch(url);
}

export async function getB2BPaymentOptions(
  vendor_id?: string
): Promise<{ status?: string; data: PaymentOption[] }> {
  const user = getStoredUser();
  const vId = vendor_id || user?.accountName;
  const url = `${API_BASE_URL}/api/v1/b2b/payment-options${vId ? `?vendor_id=${encodeURIComponent(vId)}` : ''}`;
  return authFetch(url);
}

export async function createB2BOrder(
  payload: CreateOrderPayload,
  vendor_id?: string
): Promise<CreateOrderResponse> {
  const user = getStoredUser();
  const vId = vendor_id || user?.accountName;
  const url = `${API_BASE_URL}/api/v1/b2b/create-order${vId ? `?vendor_id=${encodeURIComponent(vId)}` : ''}`;
  return authFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

// -------------------------------------------------------------
// Purchase Orders Module APIs
// -------------------------------------------------------------

export async function getB2BPurchaseOrdersSummary(
  vendor_id?: string
): Promise<PurchaseOrdersSummaryResponse> {
  const user = getStoredUser();
  const vId = vendor_id || user?.accountName;
  const url = `${API_BASE_URL}/api/v1/b2b/purchase-orders/summary${vId ? `?vendor_id=${encodeURIComponent(vId)}` : ''}`;
  return authFetch(url);
}

export async function getB2BPurchaseOrdersStatuses(
  vendor_id?: string
): Promise<PurchaseOrderStatusOptionsResponse> {
  const user = getStoredUser();
  const vId = vendor_id || user?.accountName;
  const url = `${API_BASE_URL}/api/v1/b2b/purchase-orders/statuses${vId ? `?vendor_id=${encodeURIComponent(vId)}` : ''}`;
  return authFetch(url);
}

export async function getB2BPurchaseOrders(
  params?: PurchaseOrderQueryParams
): Promise<PurchaseOrdersResponse> {
  const user = getStoredUser();
  const vId = params?.vendor_id || user?.accountName;
  const query = new URLSearchParams();
  if (vId) query.append('vendor_id', vId);
  if (params?.status && params.status !== 'all' && params.status !== 'All' && params.status !== 'All Statuses') {
    query.append('status', params.status);
  }
  if (params?.locationId && params.locationId !== 'all' && params.locationId !== 'All' && params.locationId !== 'All Locations') {
    query.append('locationId', params.locationId);
  }
  if (params?.search) {
    query.append('search', params.search);
  }
  if (params?.page) {
    query.append('page', params.page.toString());
  }
  if (params?.limit) {
    query.append('limit', params.limit.toString());
  }
  if (params?.dateFrom) {
    query.append('dateFrom', params.dateFrom);
  }
  if (params?.dateTo) {
    query.append('dateTo', params.dateTo);
  }

  const queryString = query.toString();
  const url = `${API_BASE_URL}/api/v1/b2b/purchase-orders${queryString ? `?${queryString}` : ''}`;
  return authFetch(url);
}

export async function getB2BPurchaseOrderById(
  po_id: string,
  vendor_id?: string
): Promise<PurchaseOrderDetailResponse> {
  const user = getStoredUser();
  const vId = vendor_id || user?.accountName;
  const url = `${API_BASE_URL}/api/v1/b2b/purchase-orders/${encodeURIComponent(po_id)}${vId ? `?vendor_id=${encodeURIComponent(vId)}` : ''}`;
  return authFetch(url);
}

export async function getB2BPurchaseOrderTimeline(
  po_id: string,
  vendor_id?: string
): Promise<{ status?: string; data: Array<{ step: string; status: string; description: string }> }> {
  const user = getStoredUser();
  const vId = vendor_id || user?.accountName;
  const url = `${API_BASE_URL}/api/v1/b2b/purchase-orders/${encodeURIComponent(po_id)}/timeline${vId ? `?vendor_id=${encodeURIComponent(vId)}` : ''}`;
  return authFetch(url);
}

export async function downloadB2BPurchaseOrderPdf(
  po_id: string,
  vendor_id?: string
): Promise<Blob> {
  const token = getStoredToken();
  const user = getStoredUser();
  const vId = vendor_id || user?.accountName;
  const url = `${API_BASE_URL}/api/v1/b2b/purchase-orders/${encodeURIComponent(po_id)}/pdf${vId ? `?vendor_id=${encodeURIComponent(vId)}` : ''}`;

  const headers: Record<string, string> = {
    'Accept': 'application/pdf, application/json, */*',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, { headers });
  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    throw new Error(errorJson.detail || errorJson.message || `Failed to download PDF (${response.status})`);
  }

  return await response.blob();
}

// -------------------------------------------------------------
// Deliveries Module APIs
// -------------------------------------------------------------

export async function getB2BDeliveriesSummary(
  vendor_id?: string
): Promise<DeliveriesSummaryResponse> {
  const user = getStoredUser();
  const vId = vendor_id || user?.accountName;
  const url = `${API_BASE_URL}/api/v1/b2b/deliveries/summary${vId ? `?vendor_id=${encodeURIComponent(vId)}` : ''}`;
  return authFetch(url);
}

export async function getB2BDeliveries(
  params?: DeliveryQueryParams
): Promise<DeliveriesResponse> {
  const user = getStoredUser();
  const vId = params?.vendor_id || user?.accountName;
  const query = new URLSearchParams();
  if (vId) query.append('vendor_id', vId);
  if (params?.status && params.status !== 'all' && params.status !== 'All' && params.status !== 'All Statuses') {
    query.append('status', params.status);
  }
  if (params?.locationId && params.locationId !== 'all' && params.locationId !== 'All' && params.locationId !== 'All Locations') {
    query.append('locationId', params.locationId);
  }
  if (params?.search) {
    query.append('search', params.search);
  }
  if (params?.page) {
    query.append('page', params.page.toString());
  }
  if (params?.limit) {
    query.append('limit', params.limit.toString());
  }

  const queryString = query.toString();
  const url = `${API_BASE_URL}/api/v1/b2b/deliveries${queryString ? `?${queryString}` : ''}`;
  return authFetch(url);
}

// -------------------------------------------------------------
// Receiving (GRN) Module APIs
// -------------------------------------------------------------

export async function getB2BReceivingSummary(
  vendor_id?: string
): Promise<ReceivingSummaryResponse> {
  const user = getStoredUser();
  const vId = vendor_id || user?.accountName;
  const url = `${API_BASE_URL}/api/v1/b2b/receiving/summary${vId ? `?vendor_id=${encodeURIComponent(vId)}` : ''}`;
  return authFetch(url);
}

export async function getB2BReceivingReasons(
  vendor_id?: string
): Promise<{ status?: string; data: ReceivingReason[] }> {
  const user = getStoredUser();
  const vId = vendor_id || user?.accountName;
  const url = `${API_BASE_URL}/api/v1/b2b/receiving/reasons${vId ? `?vendor_id=${encodeURIComponent(vId)}` : ''}`;
  return authFetch(url);
}

export async function getB2BReceivingList(
  params?: ReceivingQueryParams
): Promise<ReceivingResponse> {
  const user = getStoredUser();
  const vId = params?.vendor_id || user?.accountName;
  const query = new URLSearchParams();
  if (vId) query.append('vendor_id', vId);
  if (params?.status && params.status !== 'all' && params.status !== 'All' && params.status !== 'All Due to Receive') {
    query.append('status', params.status);
  }
  if (params?.locationId && params.locationId !== 'all' && params.locationId !== 'All' && params.locationId !== 'All Locations') {
    query.append('locationId', params.locationId);
  }
  if (params?.search) {
    query.append('search', params.search);
  }
  if (params?.page) {
    query.append('page', params.page.toString());
  }
  if (params?.limit) {
    query.append('limit', params.limit.toString());
  }

  const queryString = query.toString();
  const url = `${API_BASE_URL}/api/v1/b2b/receiving${queryString ? `?${queryString}` : ''}`;
  return authFetch(url);
}





