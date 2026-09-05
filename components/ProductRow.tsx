import React, { useState, useEffect } from 'react';
import { useCartStore, getTierPrice } from '@/store/cartStore';
import { B2BProduct, PriceTier } from '@/types';

function formatTierLabel(tier: PriceTier): string {
  if (tier.label) return tier.label;
  const min = tier.rangeMin !== undefined && tier.rangeMin !== null ? Number(tier.rangeMin) : tier.minQty;
  const max = tier.rangeMax !== undefined && tier.rangeMax !== null ? Number(tier.rangeMax) : tier.maxQty;
  if (typeof min === 'number') {
    if (max !== null && max !== undefined) {
      return `${min}–${max}`;
    }
    return `${min}+`;
  }
  return '';
}

function getAvailableUnits(product: B2BProduct): string[] {
  const units: string[] = [];

  if (Array.isArray(product.unitTypes)) {
    for (const u of product.unitTypes) {
      if (typeof u === 'string' && u.trim()) {
        units.push(u.trim());
      } else if (u && typeof u === 'object') {
        const name = u.name || u.unit_type_name || u.label || u.unit;
        if (name && typeof name === 'string' && name.trim()) {
          units.push(name.trim());
        }
      }
    }
  } else if (typeof product.unitTypes === 'string' && product.unitTypes.trim()) {
    units.push(product.unitTypes.trim());
  }

  if (Array.isArray(product.unit_types)) {
    for (const u of product.unit_types) {
      if (typeof u === 'string' && u.trim()) {
        units.push(u.trim());
      } else if (u && typeof u === 'object') {
        const name = u.name || u.unit_type_name || u.label || u.unit;
        if (name && typeof name === 'string' && name.trim()) {
          units.push(name.trim());
        }
      }
    }
  }

  // Also collect unitType defined in priceTiers
  const allTiers = product.priceTiers || product.tiers || [];
  if (Array.isArray(allTiers)) {
    for (const t of allTiers) {
      if (t.unitType && typeof t.unitType === 'string' && t.unitType.trim()) {
        if (!units.includes(t.unitType.trim())) {
          units.push(t.unitType.trim());
        }
      }
    }
  }

  if (units.length === 0) {
    const single =
      product.unit_type_name ||
      product.unitType ||
      product.unit ||
      product.unit_type_uom;
    if (single && typeof single === 'string' && single.trim()) {
      units.push(single.trim());
    } else {
      units.push('Unit');
    }
  }

  return Array.from(new Set(units));
}

export default function ProductRow({ product }: { product: B2BProduct }) {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const availableUnits = getAvailableUnits(product);
  const [selectedUnit, setSelectedUnit] = useState<string>(() => availableUnits[0] || 'Unit');

  // Keep selectedUnit valid if product prop changes
  useEffect(() => {
    if (!availableUnits.includes(selectedUnit)) {
      setSelectedUnit(availableUnits[0] || 'Unit');
    }
  }, [product, availableUnits, selectedUnit]);

  // Filter price tiers for the selected unit type
  const allTiers: PriceTier[] = product.priceTiers || product.tiers || [];
  const hasUnitTypeInTiers = allTiers.some((t) => Boolean(t.unitType));
  const tiers: PriceTier[] = hasUnitTypeInTiers
    ? allTiers.filter((t) => !t.unitType || t.unitType.toLowerCase() === selectedUnit.toLowerCase())
    : allTiers;

  const defaultBasePrice = Number(product.startingCost ?? product.price ?? 0);
  const basePrice = tiers.length > 0 ? Number(tiers[0].price) : defaultBasePrice;

  const productId = product.id.toString();
  // Find cart item for this product strictly matching the selected unit type
  const cartItem = items.find((item) => {
    if (String(item.productId) !== String(productId)) return false;
    const itemUnit =
      item.unitType ||
      item.unit_type_name ||
      item.product?.unitType ||
      item.product?.unit_type_name ||
      item.product?.unit ||
      '';
    if (!itemUnit && availableUnits.length === 1) return true;
    return itemUnit.toLowerCase() === selectedUnit.toLowerCase();
  });
  const quantity = cartItem ? (cartItem.quantity || 0) : 0;
  const cartItemId = cartItem?.cartItemId || cartItem?.id || '';
  const currentPrice = getTierPrice(quantity > 0 ? quantity : 1, tiers, basePrice);

  const [loading, setLoading] = useState(false);

  const handlePlus = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const productWithTiers: B2BProduct = {
        ...product,
        unit_type_name: selectedUnit,
        priceTiers: tiers,
        startingCost: basePrice,
      };

      if (quantity === 0) {
        await addItem(productWithTiers, 1, selectedUnit);
      } else {
        await updateQuantity(cartItemId, productId, quantity + 1, selectedUnit, productWithTiers);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMinus = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (loading || quantity <= 0) return;
    setLoading(true);
    try {
      const productWithTiers: B2BProduct = {
        ...product,
        unit_type_name: selectedUnit,
        priceTiers: tiers,
        startingCost: basePrice,
      };
      await updateQuantity(cartItemId, productId, quantity - 1, selectedUnit, productWithTiers);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 0) {
      setLoading(true);
      try {
        const productWithTiers: B2BProduct = {
          ...product,
          unit_type_name: selectedUnit,
          priceTiers: tiers,
          startingCost: basePrice,
        };

        if (quantity === 0 && val > 0) {
          await addItem(productWithTiers, val, selectedUnit);
        } else {
          await updateQuantity(cartItemId, productId, val, selectedUnit, productWithTiers);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const metaText = [
    product.sku,
    product.category,
    product.stockStatus,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="product-row">
      <div className="prod-icon">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '6px' }}
          />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '20px' }}>
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          </svg>
        )}
      </div>

      <div style={{ minWidth: 0, flex: '1 1 180px' }}>
        <div className="prod-name" style={{ fontWeight: 600, color: 'var(--ink)' }}>
          {product.name}
        </div>
        <div className="prod-meta" style={{ fontSize: '11px', color: 'var(--muted)' }}>
          {metaText || 'Standard B2B Item'}
        </div>
      </div>

      <div className="prod-unit">
        {availableUnits.length > 1 ? (
          <>
            <div className="unit-btn-group">
              {availableUnits.map((u) => {
                const isSelected = u.toLowerCase() === selectedUnit.toLowerCase();
                return (
                  <button
                    key={u}
                    type="button"
                    className={`unit-btn ${isSelected ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedUnit(u);
                    }}
                    title={`Select ${u}`}
                  >
                    {u}
                  </button>
                );
              })}
            </div>
            <small>Select unit</small>
          </>
        ) : (
          <>
            <span className="unit-badge-single">
              {availableUnits[0] || selectedUnit || 'Unit'}
            </span>
            <small>Unit</small>
          </>
        )}
      </div>

      {tiers.length > 0 && (
        <div className="tier-strip" style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {tiers.map((tier, index) => {
            const isApplied = currentPrice === Number(tier.price) && quantity > 0;
            const label = formatTierLabel(tier);
            return (
              <div
                key={index}
                className={`tier-chip ${isApplied ? 'active' : ''}`}
                style={
                  isApplied
                    ? { backgroundColor: '#e2e8f0', borderColor: '#cbd5e1', fontWeight: 600 }
                    : {}
                }
              >
                {label ? `${label} · ` : ''}
                <strong>${Number(tier.price).toFixed(2)}</strong>
              </div>
            );
          })}
        </div>
      )}

      <div className={`qty-box ${loading ? 'loading' : ''}`}>
        <button
          type="button"
          onClick={handleMinus}
          title="Decrease quantity"
          disabled={loading || quantity === 0}
        >
          -
        </button>
        {loading ? (
          <div className="qty-loading-spinner" title="Updating cart...">
            <svg
              style={{
                width: '14px',
                height: '14px',
                color: 'var(--blue)',
                animation: 'spin 0.8s linear infinite',
              }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
          </div>
        ) : (
          <input
            type="number"
            min="0"
            value={quantity}
            onChange={handleInputChange}
            disabled={loading}
            style={{ textAlign: 'center', width: '40px' }}
          />
        )}
        <button
          type="button"
          onClick={handlePlus}
          title="Increase quantity"
          disabled={loading}
        >
          +
        </button>
      </div>

      <div className="prod-price">
        <strong>${currentPrice.toFixed(2)}</strong>
        <small>{quantity > 0 ? `applied cost / ${selectedUnit}` : `starting cost / ${selectedUnit}`}</small>
      </div>
    </div>
  );
}
