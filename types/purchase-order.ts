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

export interface PurchaseOrderItem {
  productId?: string;
  sku?: string;
  name?: string;
  product_name?: string;
  unit_type_name?: string;
  qty?: number;
  quantity?: number;
  standardCost?: number;
  price?: number;
  cost_price?: number;
  appliedSlab?: string;
  appliedPriceTier?: string;
  appliedCostPrice?: number;
  saving?: number;
  lineTotal?: number;
  total?: number;
  [key: string]: any;
}

export interface PurchaseOrderDelivery {
  deliverTo?: string;
  storeName?: string;
  storeAddress?: string;
  requestedDate?: string;
  window?: string;
  eta?: string;
  receivingContact?: string;
  deliveryId?: string;
  notes?: string;
  [key: string]: any;
}

export interface PurchaseOrderPayment {
  method?: string;
  status?: string;
  term?: string;
  [key: string]: any;
}

export interface CommercialSummary {
  standardPriceValue?: number;
  slabSavings?: number;
  appliedCostSubtotal?: number;
  gst?: number;
  poTotal?: number;
  [key: string]: any;
}

export interface PurchaseOrderDetail {
  id: string;
  customerPoRef?: string;
  poReference?: string;
  createdAt?: string;
  status?: string;
  createdBy?: {
    name?: string;
    role?: string;
  };
  supplier?: string;
  costCentre?: string;
  delivery?: PurchaseOrderDelivery;
  invoiceStatus?: string;
  payment?: PurchaseOrderPayment;
  timeline?: {
    submitted?: string | null;
    confirmed?: string | null;
    packed?: string | null;
    inTransit?: string | null;
    delivered?: string | null;
    received?: string | null;
    [key: string]: any;
  } | Array<{ step: string; status: string; description: string }>;
  items?: PurchaseOrderItem[];
  commercialSummary?: CommercialSummary;
  total?: number;
  subtotal?: number;
  gst?: number;
  savings?: number;
  [key: string]: any;
}

export interface PurchaseOrderDetailResponse {
  status?: string;
  data?: PurchaseOrderDetail;
  [key: string]: any;
}

