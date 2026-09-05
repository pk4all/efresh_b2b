export interface PriceTier {
  minQty?: number;
  maxQty?: number | null;
  rangeMin?: number;
  rangeMax?: number | null;
  unitType?: string;
  price: number;
  label?: string;
  markupPercentage?: number;
  minMarkupPercentage?: number;
  [key: string]: any;
}

export interface B2BProduct {
  id: string;
  sku?: string;
  name: string;
  category?: string;
  unit_type_name?: string;
  unit_type_id?: string;
  unit_type_uom?: string;
  unit?: string;
  unitTypes?: any;
  unitType?: string;
  unit_types?: any;
  startingCost?: number;
  price?: number;
  priceTiers?: PriceTier[];
  tiers?: PriceTier[];
  stockStatus?: string;
  imageUrl?: string;
  meta?: string;
  [key: string]: any;
}

// Alias for backward compatibility
export type ProductData = B2BProduct;
export type Product = B2BProduct;
export type ProductTier = PriceTier;

export interface ProductCategory {
  id: string | number;
  name: string;
  count?: number;
  [key: string]: any;
}

export interface ProductsPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  [key: string]: any;
}

export interface ProductsResponse {
  status?: string;
  data: B2BProduct[];
  pagination?: ProductsPagination;
  [key: string]: any;
}

export interface CategoriesResponse {
  status?: string;
  data: ProductCategory[];
  [key: string]: any;
}
