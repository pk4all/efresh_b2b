export interface ClaimsSummary {
  openClaims?: {
    count?: number;
    requestedAmount?: number;
  };
  underReview?: {
    count?: number;
    amount?: number;
  };
  creditsApprovedThisMonth?: number;
  averageResolutionDays?: number;
  [key: string]: any;
}

export interface ClaimsSummaryResponse {
  status?: string;
  data?: ClaimsSummary;
  openClaims?: {
    count?: number;
    requestedAmount?: number;
  };
  underReview?: {
    count?: number;
    amount?: number;
  };
  creditsApprovedThisMonth?: number;
  averageResolutionDays?: number;
  [key: string]: any;
}

export interface ClaimListItem {
  id: string;
  grnId?: string;
  poId?: string;
  invoiceId?: string;
  raisedAt?: string;
  raisedBy?: string;
  issueSummary?: string;
  productSummary?: string;
  claimValue?: number;
  supplierResponse?: string;
  credit?: string;
  status?: string;
  [key: string]: any;
}

export interface ClaimsResponse {
  status?: string;
  data?: ClaimListItem[];
  claims?: ClaimListItem[];
  pagination?: {
    total?: number;
    page?: number;
    limit?: number;
  };
  [key: string]: any;
}

export interface ClaimQueryParams {
  status?: string;
  search?: string;
  vendor_id?: string;
  page?: number;
  limit?: number;
}

export interface ClaimItemDetail {
  productId?: string;
  productName?: string;
  unit?: string;
  issue?: string;
  qty?: number | string;
  appliedCost?: number;
  claimAmount?: number;
  description?: string;
  images?: string[];
  [key: string]: any;
}

export interface ClaimAlert {
  type?: string;
  message: string;
}

export interface ClaimDetail {
  id: string;
  grnId?: string;
  poId?: string;
  invoiceId?: string;
  status?: string;
  raisedAt?: string;
  raisedBy?: string;
  claimValue?: number;
  supplierResponse?: string;
  credit?: string;
  items?: ClaimItemDetail[];
  alerts?: ClaimAlert[];
  [key: string]: any;
}

export interface ClaimDetailResponse {
  status?: string;
  data?: ClaimDetail;
  id?: string;
  grnId?: string;
  poId?: string;
  invoiceId?: string;
  items?: ClaimItemDetail[];
  alerts?: ClaimAlert[];
  [key: string]: any;
}

export interface CreateClaimItemPayload {
  productId: string;
  reason: string;
  quantity: number;
  description?: string;
  images?: string[];
}

export interface CreateClaimPayload {
  poId: string;
  grnId: string;
  items: CreateClaimItemPayload[];
  vendor_id?: string;
}

export interface CreateClaimResponse {
  status?: string;
  id?: string;
  claimId?: string;
  message?: string;
  [key: string]: any;
}
