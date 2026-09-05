export interface DashboardMetrics {
  activeOrders?: number;
  openPurchaseOrders?: number;
  openPurchaseOrdersAmount?: number;
  inTransitDeliveries?: number;
  deliveriesThisWeek?: number;
  nextDeliverySlot?: string;
  overdueInvoices?: number;
  overdue?: number;
  invoicesDue?: number;
  invoicesDueCount?: number;
  openClaims?: number;
  cartItemCount?: number;
  [key: string]: any;
}

export interface DashboardSummaryResponse {
  status?: string;
  metrics?: DashboardMetrics;
  data?: any;
  [key: string]: any;
}

export interface AgingSummary {
  current?: number;
  days_1_30?: number;
  days_31_60?: number;
  days_60_plus?: number;
  [key: string]: any;
}

export interface AccountsWarning {
  overdueCount?: number;
  oldestOverdueDays?: number;
  message?: string;
  [key: string]: any;
}

export interface AccountsSnapshotResponse {
  status?: string;
  totalOutstanding?: number;
  aging?: AgingSummary;
  warnings?: AccountsWarning;
  data?: any;
  [key: string]: any;
}

export interface RecentOrder {
  poId: string;
  date: string;
  items: number;
  total: number;
  status: string;
  delivery: string;
  [key: string]: any;
}

export interface UpcomingDelivery {
  deliveryId: string;
  poId: string;
  eta: string;
  products: string;
  location: string;
  status: string;
  receiving?: string | null;
  [key: string]: any;
}

export interface RecentActivityResponse {
  status?: string;
  recentOrders?: RecentOrder[];
  upcomingDeliveries?: UpcomingDelivery[];
  data?: any;
  [key: string]: any;
}
