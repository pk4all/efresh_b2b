import { B2BProduct, PriceTier } from './product';

export interface AppliedPriceTier {
  minQty?: number;
  maxQty?: number | null;
  price: number;
  label?: string;
  [key: string]: any;
}

export interface B2BCartItem {
  cartItemId?: string;
  id?: string;
  productId: string;
  sku?: string;
  name: string;
  unitType?: string;
  unit_type_name?: string;
  unit_type_id?: string;
  unitPrice: number;
  quantity: number;
  total: number;
  appliedPriceTier?: AppliedPriceTier | null;
  product?: B2BProduct;
  [key: string]: any;
}

export interface B2BCart {
  id?: string;
  items: B2BCartItem[];
  subtotal: number;
  tax: number;
  total: number;
  status?: string;
  [key: string]: any;
}

export interface AddCartItemPayload {
  productId: string;
  quantity: number;
  unitType?: string;
  unit_type_name?: string;
  unit_type_id?: string;
  price?: number;
  appliedPriceTier?: PriceTier | AppliedPriceTier | null;
  applicablePriceTier?: PriceTier | AppliedPriceTier | null;
  [key: string]: any;
}

export interface UpdateCartItemPayload {
  quantity: number;
  price?: number;
  unitType?: string;
  unit_type_name?: string;
  appliedPriceTier?: PriceTier | AppliedPriceTier | null;
  applicablePriceTier?: PriceTier | AppliedPriceTier | null;
  [key: string]: any;
}

// Backward compatibility aliases
export type CartItem = B2BCartItem;

export interface CartState {
  cart: B2BCart | null;
  items: B2BCartItem[];
  loading: boolean;
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
  fetchCart: () => Promise<void>;
  addItem: (product: B2BProduct, quantity?: number, unitType?: string) => Promise<void>;
  updateQuantity: (
    cartItemId: string,
    productId: string,
    quantity: number,
    unitType?: string,
    product?: B2BProduct
  ) => Promise<void>;
  removeItem: (cartItemId: string, productId?: string, unitType?: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getItemCount: () => number;
}

export interface CostCentreOption {
  id: string;
  name: string;
  [key: string]: any;
}

export interface ReceivingContactOption {
  id: string;
  name: string;
  phone?: string;
  [key: string]: any;
}

export interface StoreLocation {
  id: string;
  name: string;
  address?: string;
  deliverTo?: {
    id?: string;
    storeName?: string;
    storeAddress?: string;
  };
  costCentres?: CostCentreOption[];
  receivingContacts?: ReceivingContactOption[];
  preferredWindows?: string[];
  [key: string]: any;
}

export interface PoNumberResponse {
  status?: string;
  poReference: string;
  [key: string]: any;
}

export interface PaymentOptionSummary {
  paymentTerm: string;
  method: string;
  collection: string;
  [key: string]: any;
}

export interface PaymentOption {
  id: string;
  title: string;
  description: string;
  savedAccount?: string;
  summary?: PaymentOptionSummary;
  [key: string]: any;
}

export interface CreateOrderPayload {
  poReference: string;
  costCentreId?: string;
  locationId?: string;
  deliveryDate?: string;
  receivingContactId?: string;
  preferredWindow?: string;
  paymentOptionId?: string;
  notes?: string;
  [key: string]: any;
}

export interface CreateOrderResponse {
  status?: string;
  orderId?: string;
  estimatedDelivery?: string;
  message?: string;
  [key: string]: any;
}
