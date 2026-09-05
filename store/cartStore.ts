import { create } from 'zustand';
import { B2BProduct, B2BCartItem, B2BCart, PriceTier, CartState, AddCartItemPayload, UpdateCartItemPayload } from '@/types';
import {
  getB2BCart,
  addB2BCartItem,
  updateB2BCartItem,
  removeB2BCartItem,
  clearB2BCart,
} from '@/lib/api';

export * from '@/types/cart';

export const getTierPrice = (
  quantity: number,
  tiers?: PriceTier[],
  basePrice: number = 0
): number => {
  if (!tiers || tiers.length === 0 || quantity <= 0) return basePrice;

  for (const tier of tiers) {
    const min =
      tier.rangeMin !== undefined && tier.rangeMin !== null
        ? Number(tier.rangeMin)
        : tier.minQty !== undefined && tier.minQty !== null
          ? Number(tier.minQty)
          : undefined;
    const max =
      tier.rangeMax !== undefined && tier.rangeMax !== null
        ? Number(tier.rangeMax)
        : tier.maxQty !== undefined && tier.maxQty !== null
          ? Number(tier.maxQty)
          : undefined;

    if (typeof min === 'number') {
      if (typeof max === 'number' && max !== null) {
        if (quantity >= min && quantity <= max) {
          return Number(tier.price);
        }
      } else {
        if (quantity >= min) {
          return Number(tier.price);
        }
      }
    } else if (tier.label) {
      const label = tier.label;
      if (label.includes('–') || label.includes('-')) {
        const parts = label.split(/[-–]/);
        const minVal = parseInt(parts[0], 10);
        const maxVal = parseInt(parts[1], 10);
        if (quantity >= minVal && quantity <= maxVal) {
          return Number(tier.price);
        }
      } else if (label.includes('+')) {
        const minVal = parseInt(label.replace('+', ''), 10);
        if (quantity >= minVal) {
          return Number(tier.price);
        }
      }
    }
  }

  return basePrice;
};

export const getApplicableTier = (
  quantity: number,
  tiers?: PriceTier[]
): PriceTier | null => {
  if (!tiers || tiers.length === 0 || quantity <= 0) return null;

  for (const tier of tiers) {
    const min =
      tier.rangeMin !== undefined && tier.rangeMin !== null
        ? Number(tier.rangeMin)
        : tier.minQty !== undefined && tier.minQty !== null
          ? Number(tier.minQty)
          : undefined;
    const max =
      tier.rangeMax !== undefined && tier.rangeMax !== null
        ? Number(tier.rangeMax)
        : tier.maxQty !== undefined && tier.maxQty !== null
          ? Number(tier.maxQty)
          : undefined;

    if (typeof min === 'number') {
      if (typeof max === 'number' && max !== null) {
        if (quantity >= min && quantity <= max) {
          return tier;
        }
      } else {
        if (quantity >= min) {
          return tier;
        }
      }
    } else if (tier.label) {
      const label = tier.label;
      if (label.includes('–') || label.includes('-')) {
        const parts = label.split(/[-–]/);
        const minVal = parseInt(parts[0], 10);
        const maxVal = parseInt(parts[1], 10);
        if (quantity >= minVal && quantity <= maxVal) {
          return tier;
        }
      } else if (label.includes('+')) {
        const minVal = parseInt(label.replace('+', ''), 10);
        if (quantity >= minVal) {
          return tier;
        }
      }
    }
  }

  return tiers[0] || null;
};

const mergeCartItemsWithProducts = (
  serverItems: B2BCartItem[],
  existingItems: B2BCartItem[] = [],
  fallbackProduct?: B2BProduct
): B2BCartItem[] => {
  return serverItems.map((item) => {
    const prev = existingItems.find(
      (e) =>
        (item.cartItemId && (e.cartItemId === item.cartItemId || e.id === item.cartItemId)) ||
        (String(item.productId) === String(e.productId) &&
          (!item.unit_type_name || !e.unit_type_name || item.unit_type_name.toLowerCase() === e.unit_type_name.toLowerCase()))
    );

    const product =
      item.product ||
      prev?.product ||
      (fallbackProduct && String(fallbackProduct.id) === String(item.productId) ? fallbackProduct : undefined);

    const selectedUnit = item.unitType || item.unit_type_name || product?.unitType || product?.unit_type_name || product?.unit;
    const allTiers: PriceTier[] = product?.priceTiers || product?.tiers || prev?.product?.priceTiers || [];
    const tiers =
      selectedUnit && allTiers.some((t) => Boolean(t.unitType))
        ? allTiers.filter((t) => !t.unitType || t.unitType.toLowerCase() === selectedUnit.toLowerCase())
        : allTiers;

    const basePrice =
      tiers.length > 0
        ? Number(tiers[0].price)
        : Number(product?.startingCost ?? product?.price ?? item.unitPrice ?? 0);

    const tierPrice = getTierPrice(item.quantity, tiers, basePrice);
    const applicableTier = getApplicableTier(item.quantity, tiers);

    return {
      ...item,
      product: product ? { ...product, priceTiers: allTiers.length > 0 ? allTiers : product.priceTiers } : undefined,
      unitPrice: item.unitPrice ?? tierPrice,
      appliedPriceTier: item.appliedPriceTier || applicableTier || prev?.appliedPriceTier,
    };
  });
};

export const useCartStore = create<CartState>()((set, get) => ({
  cart: null,
  items: [],
  loading: false,
  subtotal: 0,
  tax: 0,
  total: 0,
  itemCount: 0,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const cart = await getB2BCart();
      const rawItems = cart?.items || [];
      const items = mergeCartItemsWithProducts(rawItems, get().items);
      const subtotal = cart?.subtotal || items.reduce((sum, i) => sum + (i.total || i.unitPrice * i.quantity), 0);
      const tax = cart?.tax || subtotal * 0.1;
      const total = cart?.total || subtotal + tax;
      const itemCount = items.reduce((sum, i) => sum + (i.quantity || 0), 0);

      set({ cart, items, subtotal, tax, total, itemCount, loading: false });
    } catch (err) {
      console.warn('Failed to fetch server cart:', err);
      set({ loading: false });
    }
  },

  addItem: async (product: B2BProduct, quantity = 1, unitType?: string) => {
    const productId = product.id.toString();
    const selectedUnit = unitType || product.unitType || product.unit_type_name || product.unit;
    // Check if product already exists with matching unit type in current items
    const existing = get().items.find(
      (i) =>
        i.productId === productId &&
        (!selectedUnit ||
          (i.unitType && i.unitType.toLowerCase() === selectedUnit.toLowerCase()) ||
          (i.unit_type_name && i.unit_type_name.toLowerCase() === selectedUnit.toLowerCase()))
    );

    const allTiers = product.priceTiers || product.tiers || [];
    const tiers =
      selectedUnit && allTiers.some((t) => Boolean(t.unitType))
        ? allTiers.filter((t) => !t.unitType || t.unitType.toLowerCase() === selectedUnit.toLowerCase())
        : allTiers;

    const basePrice = tiers.length > 0 ? Number(tiers[0].price) : Number(product.startingCost ?? product.price ?? 0);
    const effectiveQty = existing ? (existing.quantity || 0) + quantity : quantity;
    const unitPrice = getTierPrice(effectiveQty, tiers, basePrice);
    const applicablePriceTier = getApplicableTier(effectiveQty, tiers);

    const appliedTierPayload = applicablePriceTier
      ? {
          ...applicablePriceTier,
          minQty: applicablePriceTier.rangeMin ?? applicablePriceTier.minQty ?? 1,
          maxQty: applicablePriceTier.rangeMax ?? applicablePriceTier.maxQty ?? null,
          rangeMin: applicablePriceTier.rangeMin ?? applicablePriceTier.minQty ?? 1,
          rangeMax: applicablePriceTier.rangeMax ?? applicablePriceTier.maxQty ?? null,
          price: Number(applicablePriceTier.price),
        }
      : null;

    try {
      let updatedCart: B2BCart;
      const targetId = existing?.cartItemId || existing?.id;
      if (existing && targetId) {
        const newQty = (existing.quantity || 0) + quantity;
        const updatePayload: UpdateCartItemPayload = {
          quantity: newQty,
          price: unitPrice,
          unitType: selectedUnit,
          appliedPriceTier: appliedTierPayload,
          applicablePriceTier: appliedTierPayload,
        };
        if (selectedUnit) {
          updatePayload.unit_type_name = selectedUnit;
        }
        updatedCart = await updateB2BCartItem(targetId, updatePayload);
      } else {
        const payload: AddCartItemPayload = {
          productId,
          quantity,
          unitType: selectedUnit,
          price: unitPrice,
          appliedPriceTier: appliedTierPayload,
          applicablePriceTier: appliedTierPayload,
        };
        if (selectedUnit) {
          payload.unit_type_name = selectedUnit;
        }
        updatedCart = await addB2BCartItem(payload);
      }

      const rawItems = updatedCart?.items || [];
      const items = mergeCartItemsWithProducts(rawItems, get().items, product);
      const subtotal = updatedCart?.subtotal ?? items.reduce((sum, i) => sum + (i.total || i.unitPrice * i.quantity), 0);
      const tax = updatedCart?.tax ?? subtotal * 0.1;
      const total = updatedCart?.total ?? subtotal + tax;
      const itemCount = items.reduce((sum, i) => sum + (i.quantity || 0), 0);

      set({ cart: updatedCart, items, subtotal, tax, total, itemCount });
    } catch (err) {
      console.error('Failed to add item to cart via API:', err);
      // Optimistic fallback for seamless UI response if needed
      const currentItems = [...get().items];
      const idx = currentItems.findIndex(
        (i) =>
          i.productId === productId &&
          (!selectedUnit ||
            (i.unitType && i.unitType.toLowerCase() === selectedUnit.toLowerCase()) ||
            (i.unit_type_name && i.unit_type_name.toLowerCase() === selectedUnit.toLowerCase()))
      );

      if (idx >= 0) {
        const newQty = currentItems[idx].quantity + quantity;
        const optimisticUnitPrice = getTierPrice(newQty, tiers, basePrice);
        const optimisticTier = getApplicableTier(newQty, tiers);
        const optTierPayload = optimisticTier
          ? {
              ...optimisticTier,
              minQty: optimisticTier.rangeMin ?? optimisticTier.minQty ?? 1,
              maxQty: optimisticTier.rangeMax ?? optimisticTier.maxQty ?? null,
              rangeMin: optimisticTier.rangeMin ?? optimisticTier.minQty ?? 1,
              rangeMax: optimisticTier.rangeMax ?? optimisticTier.maxQty ?? null,
              price: Number(optimisticTier.price),
            }
          : null;
        currentItems[idx] = {
          ...currentItems[idx],
          quantity: newQty,
          unitPrice: optimisticUnitPrice,
          total: optimisticUnitPrice * newQty,
          appliedPriceTier: optTierPayload,
          product: {
            ...product,
            priceTiers: tiers,
          },
        };
      } else {
        const optimisticUnitPrice = getTierPrice(quantity, tiers, basePrice);
        const optimisticTier = getApplicableTier(quantity, tiers);
        const optTierPayload = optimisticTier
          ? {
              ...optimisticTier,
              minQty: optimisticTier.rangeMin ?? optimisticTier.minQty ?? 1,
              maxQty: optimisticTier.rangeMax ?? optimisticTier.maxQty ?? null,
              rangeMin: optimisticTier.rangeMin ?? optimisticTier.minQty ?? 1,
              rangeMax: optimisticTier.rangeMax ?? optimisticTier.maxQty ?? null,
              price: Number(optimisticTier.price),
            }
          : null;
        currentItems.push({
          cartItemId: `ci_${Date.now()}`,
          productId,
          sku: product.sku,
          name: product.name,
          unitType: selectedUnit,
          unit_type_name: selectedUnit,
          unitPrice: optimisticUnitPrice,
          quantity,
          total: optimisticUnitPrice * quantity,
          appliedPriceTier: optTierPayload,
          product: {
            ...product,
            unitType: selectedUnit,
            unit_type_name: selectedUnit,
            priceTiers: tiers,
          },
        });
      }

      const subtotal = currentItems.reduce((sum, i) => sum + i.total, 0);
      const tax = subtotal * 0.1;
      const total = subtotal + tax;
      const itemCount = currentItems.reduce((sum, i) => sum + i.quantity, 0);

      set({ items: currentItems, subtotal, tax, total, itemCount });
    }
  },

  updateQuantity: async (
    cartItemId: string,
    productId: string,
    quantity: number,
    unitType?: string,
    product?: B2BProduct
  ) => {
    if (quantity <= 0) {
      return get().removeItem(cartItemId, productId, unitType);
    }

    const existing = get().items.find(
      (i) =>
        (cartItemId && (i.cartItemId === cartItemId || i.id === cartItemId)) ||
        (String(i.productId) === String(productId) &&
          (!unitType ||
            (i.unitType && i.unitType.toLowerCase() === unitType.toLowerCase()) ||
            (i.unit_type_name && i.unit_type_name.toLowerCase() === unitType.toLowerCase())))
    );

    const productObj = product || existing?.product;
    const allTiers: PriceTier[] =
      productObj?.priceTiers || productObj?.tiers || existing?.product?.priceTiers || [];

    const selectedUnit =
      unitType ||
      existing?.unitType ||
      existing?.unit_type_name ||
      productObj?.unitType ||
      productObj?.unit_type_name ||
      productObj?.unit;

    const tiers =
      selectedUnit && allTiers.some((t) => Boolean(t.unitType))
        ? allTiers.filter((t) => !t.unitType || t.unitType.toLowerCase() === selectedUnit.toLowerCase())
        : allTiers;

    const basePrice =
      tiers.length > 0
        ? Number(tiers[0].price)
        : Number(productObj?.startingCost ?? productObj?.price ?? existing?.unitPrice ?? 0);

    const unitPrice = getTierPrice(quantity, tiers, basePrice);
    const applicablePriceTier = getApplicableTier(quantity, tiers);

    const appliedTierPayload = applicablePriceTier
      ? {
          ...applicablePriceTier,
          minQty: applicablePriceTier.rangeMin ?? applicablePriceTier.minQty ?? 1,
          maxQty: applicablePriceTier.rangeMax ?? applicablePriceTier.maxQty ?? null,
          rangeMin: applicablePriceTier.rangeMin ?? applicablePriceTier.minQty ?? 1,
          rangeMax: applicablePriceTier.rangeMax ?? applicablePriceTier.maxQty ?? null,
          price: Number(applicablePriceTier.price),
        }
      : null;

    try {
      let updatedCart: B2BCart;
      const targetId = cartItemId || existing?.cartItemId || existing?.id;
      if (targetId && !targetId.startsWith('ci_')) {
        const updatePayload: UpdateCartItemPayload = {
          quantity,
          price: unitPrice,
          unitType: selectedUnit,
          appliedPriceTier: appliedTierPayload,
          applicablePriceTier: appliedTierPayload,
        };
        if (selectedUnit) {
          updatePayload.unit_type_name = selectedUnit;
        }
        updatedCart = await updateB2BCartItem(targetId, updatePayload);
      } else {
        const payload: AddCartItemPayload = {
          productId,
          quantity,
          unitType: selectedUnit,
          price: unitPrice,
          appliedPriceTier: appliedTierPayload,
          applicablePriceTier: appliedTierPayload,
        };
        if (selectedUnit) {
          payload.unit_type_name = selectedUnit;
        }
        updatedCart = await addB2BCartItem(payload);
      }

      const rawItems = updatedCart?.items || [];
      const items = mergeCartItemsWithProducts(rawItems, get().items, productObj);
      const subtotal = updatedCart?.subtotal ?? items.reduce((sum, i) => sum + (i.total || i.unitPrice * i.quantity), 0);
      const tax = updatedCart?.tax ?? subtotal * 0.1;
      const total = updatedCart?.total ?? subtotal + tax;
      const itemCount = items.reduce((sum, i) => sum + (i.quantity || 0), 0);

      set({ cart: updatedCart, items, subtotal, tax, total, itemCount });
    } catch (err) {
      console.error('Failed to update cart item quantity via API:', err);
      // Local update fallback
      const currentItems = get().items.map((item) => {
        if (
          (cartItemId && (item.cartItemId === cartItemId || item.id === cartItemId)) ||
          (String(item.productId) === String(productId) &&
            (!unitType ||
              (item.unitType && item.unitType.toLowerCase() === unitType.toLowerCase()) ||
              (item.unit_type_name && item.unit_type_name.toLowerCase() === unitType.toLowerCase())))
        ) {
          return {
            ...item,
            quantity,
            unitPrice,
            total: unitPrice * quantity,
            appliedPriceTier: appliedTierPayload,
            product: productObj || item.product,
          };
        }
        return item;
      });

      const subtotal = currentItems.reduce((sum, i) => sum + (i.total || i.unitPrice * i.quantity), 0);
      const tax = subtotal * 0.1;
      const total = subtotal + tax;
      const itemCount = currentItems.reduce((sum, i) => sum + (i.quantity || 0), 0);

      set({ items: currentItems, subtotal, tax, total, itemCount });
    }
  },

  removeItem: async (cartItemId: string, productId?: string, unitType?: string) => {
    try {
      let updatedCart: B2BCart | null = null;
      
      // Determine the cartItemId to delete
      let targetId = cartItemId;
      if (!targetId && productId) {
        const found = get().items.find(
          (i) =>
            String(i.productId) === String(productId) &&
            (!unitType ||
              (i.unitType && i.unitType.toLowerCase() === unitType.toLowerCase()) ||
              (i.unit_type_name && i.unit_type_name.toLowerCase() === unitType.toLowerCase()))
        );
        targetId = found?.cartItemId || found?.id || '';
      }

      if (targetId) {
        updatedCart = await removeB2BCartItem(targetId);
      }

      const items =
        updatedCart?.items ||
        get().items.filter((i) => {
          if (targetId && (i.cartItemId === targetId || i.id === targetId)) return false;
          if (cartItemId && (i.cartItemId === cartItemId || i.id === cartItemId)) return false;
          if (productId && String(i.productId) === String(productId)) {
            if (unitType) {
              const u = i.unitType || i.unit_type_name;
              return u?.toLowerCase() !== unitType.toLowerCase();
            }
            return false;
          }
          return true;
        });

      const subtotal = updatedCart?.subtotal ?? items.reduce((sum, i) => sum + (i.total || i.unitPrice * i.quantity), 0);
      const tax = updatedCart?.tax ?? subtotal * 0.1;
      const total = updatedCart?.total ?? subtotal + tax;
      const itemCount = items.reduce((sum, i) => sum + (i.quantity || 0), 0);

      set({ cart: updatedCart, items, subtotal, tax, total, itemCount });
    } catch (err) {
      console.error('Failed to remove cart item via API:', err);
      const items = get().items.filter((i) => {
        if (cartItemId && (i.cartItemId === cartItemId || i.id === cartItemId)) return false;
        if (productId && String(i.productId) === String(productId)) {
          if (unitType) {
            const u = i.unitType || i.unit_type_name;
            return u?.toLowerCase() !== unitType.toLowerCase();
          }
          return false;
        }
        return true;
      });

      const subtotal = items.reduce((sum, i) => sum + i.total, 0);
      const tax = subtotal * 0.1;
      const total = subtotal + tax;
      const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

      set({ items, subtotal, tax, total, itemCount });
    }
  },

  clearCart: async () => {
    try {
      await clearB2BCart();
    } catch (err) {
      console.error('Failed to clear cart via API:', err);
    }
    set({ cart: null, items: [], subtotal: 0, tax: 0, total: 0, itemCount: 0 });
  },

  getCartTotal: () => {
    return get().subtotal;
  },

  getItemCount: () => {
    return get().itemCount;
  },
}));
