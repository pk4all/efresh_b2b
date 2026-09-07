export interface InvoiceAging {
  current?: number;
  days1To30?: number;
  days31To60?: number;
  days60Plus?: number;
}

export interface InvoicesSummary {
  outstanding?: {
    total?: number;
    invoiceCount?: number;
  };
  dueWithin14Days?: {
    total?: number;
    invoiceCount?: number;
  };
  overdue?: {
    total?: number;
    invoiceCount?: number;
  };
  availableCredit?: {
    creditLimit?: number;
    available?: number;
  };
  aging?: InvoiceAging;
  nextDueDate?: string;
  [key: string]: any;
}

export interface InvoicesSummaryResponse {
  status?: string;
  data?: InvoicesSummary;
  outstanding?: {
    total?: number;
    invoiceCount?: number;
  };
  dueWithin14Days?: {
    total?: number;
    invoiceCount?: number;
  };
  overdue?: {
    total?: number;
    invoiceCount?: number;
  };
  availableCredit?: {
    creditLimit?: number;
    available?: number;
  };
  aging?: InvoiceAging;
  nextDueDate?: string;
  [key: string]: any;
}

export interface InvoiceListItem {
  id: string;
  poId?: string;
  grnDelivery?: string[] | string;
  invoiceDate?: string;
  dueDate?: string;
  amount?: number;
  creditsPending?: string | number | null;
  balance?: number;
  status?: string;
  locationId?: string;
  locationName?: string;
  [key: string]: any;
}

export interface InvoicesResponse {
  status?: string;
  data?: InvoiceListItem[];
  pagination?: {
    total?: number;
    page?: number;
    limit?: number;
  };
  [key: string]: any;
}

export interface InvoiceQueryParams {
  status?: string;
  locationId?: string;
  search?: string;
  vendor_id?: string;
  page?: number;
  limit?: number;
}

export interface InvoiceLineProduct {
  name: string;
  sku?: string;
  unit?: string;
  image?: string;
}

export interface InvoiceLineItem {
  product: InvoiceLineProduct;
  received?: string | number;
  poAppliedCost?: number;
  invoicePrice?: number;
  lineValue?: number;
  receiptIssue?: string | null;
  [key: string]: any;
}

export interface InvoiceRelatedDocument {
  type: string;
  id: string;
  date?: string;
  status?: string;
  link?: string;
}

export interface InvoiceSummaryTotals {
  subtotal?: number;
  gst?: number;
  invoiceTotal?: number;
  paid?: number;
  creditPending?: number;
  currentBalance?: number;
}

export interface InvoiceAlert {
  type?: string;
  message: string;
}

export interface InvoiceDetail {
  id: string;
  issueDate?: string;
  dueDate?: string;
  poId?: string;
  status?: string;
  lines?: InvoiceLineItem[];
  relatedDocuments?: InvoiceRelatedDocument[];
  summary?: InvoiceSummaryTotals;
  alerts?: InvoiceAlert[];
  [key: string]: any;
}

export interface InvoiceDetailResponse {
  status?: string;
  data?: InvoiceDetail;
  id?: string;
  issueDate?: string;
  dueDate?: string;
  poId?: string;
  statusText?: string;
  lines?: InvoiceLineItem[];
  relatedDocuments?: InvoiceRelatedDocument[];
  summary?: InvoiceSummaryTotals;
  alerts?: InvoiceAlert[];
  [key: string]: any;
}
