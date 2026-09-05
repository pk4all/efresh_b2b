export interface ReceivingSummary {
  readyToReceive?: {
    count?: number;
    description?: string;
  };
  arrivingToday?: {
    count?: number;
    description?: string;
  };
  partiallyReceived?: {
    count?: number;
    description?: string;
  };
  receivedToday?: {
    count?: number;
    claims?: string;
  };
  [key: string]: any;
}

export interface ReceivingSummaryResponse {
  status?: string;
  data?: ReceivingSummary;
  readyToReceive?: {
    count?: number;
    description?: string;
  };
  arrivingToday?: {
    count?: number;
    description?: string;
  };
  partiallyReceived?: {
    count?: number;
    description?: string;
  };
  receivedToday?: {
    count?: number;
    claims?: string;
  };
  [key: string]: any;
}

export interface ReceivingListItem {
  poId: string;
  deliveryId?: string;
  supplier?: string;
  location?: string;
  dueDelivered?: string;
  productCount?: number;
  expectedQty?: string;
  deliveryStatus?: string;
  receivingStatus?: string;
  priority?: string;
  [key: string]: any;
}

export interface ReceivingResponse {
  status?: string;
  data?: ReceivingListItem[];
  pagination?: {
    total?: number;
    page?: number;
    limit?: number;
  };
  [key: string]: any;
}

export interface ReceivingQueryParams {
  status?: string;
  locationId?: string;
  search?: string;
  vendor_id?: string;
  page?: number;
  limit?: number;
}

export interface ReceivingReason {
  id: string;
  label: string;
}
