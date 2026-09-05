export interface DeliveriesSummary {
  arrivingToday?: {
    count?: number;
    eta?: string;
  };
  scheduled?: {
    count?: number;
    timeframe?: string;
  };
  needsReceiving?: {
    count?: number;
    description?: string;
  };
  receivedThisWeek?: {
    count?: number;
    withVariance?: number;
  };
  [key: string]: any;
}

export interface DeliveriesSummaryResponse {
  status?: string;
  data?: DeliveriesSummary;
  arrivingToday?: {
    count?: number;
    eta?: string;
  };
  scheduled?: {
    count?: number;
    timeframe?: string;
  };
  needsReceiving?: {
    count?: number;
    description?: string;
  };
  receivedThisWeek?: {
    count?: number;
    withVariance?: number;
  };
  [key: string]: any;
}

export interface DeliveryListItem {
  id: string;
  poId?: string;
  locationName?: string;
  scheduledEta?: string;
  productSummary?: string;
  driverRun?: string;
  deliveryStatus?: string;
  receivingStatus?: string | null;
  [key: string]: any;
}

export interface DeliveriesResponse {
  status?: string;
  data?: DeliveryListItem[];
  pagination?: {
    total?: number;
    page?: number;
    limit?: number;
  };
  [key: string]: any;
}

export interface DeliveryQueryParams {
  status?: string;
  locationId?: string;
  search?: string;
  vendor_id?: string;
  page?: number;
  limit?: number;
}
