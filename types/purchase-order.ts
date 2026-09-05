export interface PurchaseOrdersSummary {
  openPos?: {
    count?: number;
    totalValue?: number;
  };
  awaitingConfirmation?: {
    count?: number;
    latestPoRef?: string;
  };
  inDelivery?: {
    count?: number;
    arrivingToday?: number;
  };
  completedThisMonth?: {
    count?: number;
    totalValuePurchased?: number;
  };
  [key: string]: any;
}

export interface PurchaseOrdersSummaryResponse {
  status?: string;
  data?: PurchaseOrdersSummary;
  openPos?: {
    count?: number;
    totalValue?: number;
  };
  awaitingConfirmation?: {
    count?: number;
    latestPoRef?: string;
  };
  inDelivery?: {
    count?: number;
    arrivingToday?: number;
  };
  completedThisMonth?: {
    count?: number;
    totalValuePurchased?: number;
  };
  [key: string]: any;
}

export interface PurchaseOrderStatusOption {
  id: string;
  label: string;
}

export interface PurchaseOrderStatusOptionsResponse {
  status?: string;
  data: PurchaseOrderStatusOption[];
}

export interface PurchaseOrderListItem {
  id: string;
  customerPoRef?: string;
  createdBy?: {
    name?: string;
    role?: string;
  };
  createdAt?: string;
  itemCount?: number;
  total?: number;
  slabSaving?: number;
  payment?: {
    term?: string;
    method?: string;
  };
  status?: string;
  deliveryDate?: string;
  location?: string;
  locationId?: string;
  [key: string]: any;
}

export interface PurchaseOrdersResponse {
  status?: string;
  data?: PurchaseOrderListItem[];
  pagination?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
  [key: string]: any;
}

export interface PurchaseOrderQueryParams {
  status?: string;
  locationId?: string;
  search?: string;
  vendor_id?: string;
  page?: number;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
}
