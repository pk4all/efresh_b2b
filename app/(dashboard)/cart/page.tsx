'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore, getTierPrice } from '@/store/cartStore';
import {
  getB2BLocationStores,
  getB2BLocations,
  getB2BPoNumber,
  getB2BPaymentOptions,
  createB2BOrder,
} from '@/lib/api';
import {
  StoreLocation,
  CostCentreOption,
  ReceivingContactOption,
  PaymentOption,
  CreateOrderPayload,
  CreateOrderResponse,
} from '@/types';

export default function CartPage() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const getCartTotal = useCartStore((state) => state.getCartTotal);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const fetchCart = useCartStore((state) => state.fetchCart);

  // Form states from APIs
  const [poReference, setPoReference] = useState('STORE-8848');
  const [loadingPoNumber, setLoadingPoNumber] = useState(false);

  const [costCentres, setCostCentres] = useState<CostCentreOption[]>([
    { id: 'cc-01', name: 'Brunswick Retail' },
    { id: 'cc-02', name: 'Richmond Retail' },
    { id: 'cc-03', name: 'Central Warehouse' },
  ]);
  const [selectedCostCentreId, setSelectedCostCentreId] = useState('cc-01');

  const [locations, setLocations] = useState<StoreLocation[]>([
    {
      id: 'loc-001',
      name: 'Brunswick Store · 248 Sydney Rd',
      address: '248 Sydney Rd',
    },
    {
      id: 'loc-002',
      name: 'Richmond Store · 310 Swan St',
      address: '310 Swan St',
    },
  ]);
  const [selectedLocationId, setSelectedLocationId] = useState('loc-001');

  const [receivingContacts, setReceivingContacts] = useState<ReceivingContactOption[]>([
    { id: 'rc-01', name: 'Jordan Mills', phone: '0412 555 221' },
    { id: 'rc-02', name: 'Samantha Lee', phone: '0412 555 483' },
  ]);
  const [selectedReceivingContactId, setSelectedReceivingContactId] = useState('rc-01');

  const [preferredWindows, setPreferredWindows] = useState<string[]>([
    '8:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '2:00 PM - 4:00 PM',
  ]);
  const [selectedPreferredWindow, setSelectedPreferredWindow] = useState('8:00 AM - 10:00 AM');

  // Tomorrow's date as default
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });

  const [orderNotes, setOrderNotes] = useState(
    'Please call 15 minutes before arrival. Deliver to rear receiving entrance.'
  );

  // Payment options from GET /payment-options
  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>([
    {
      id: 'pay-opt-01',
      title: '7 Day · Direct Debit',
      description:
        'Order on account. The invoice balance is automatically collected by Direct Debit on the 7-day due date.',
      savedAccount: 'Saved account · **** 4821',
      summary: {
        paymentTerm: '7 days from invoice',
        method: 'Direct Debit · **** 4821',
        collection: 'Automatic on due date',
      },
    },
    {
      id: 'pay-opt-02',
      title: 'On Order',
      description:
        'Pay when the PO is submitted. Use one payment method or split the order total across multiple payments.',
      savedAccount: 'Immediate payment',
      summary: {
        paymentTerm: 'Pay on submission',
        method: 'Credit Card / Split Payment',
        collection: 'Immediate',
      },
    },
  ]);
  const [selectedPaymentOptionId, setSelectedPaymentOptionId] = useState('pay-opt-01');

  // Order submission state
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<CreateOrderResponse | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchCart();

    // 1. Fetch backend generated PO Number
    async function loadPoNumber() {
      setLoadingPoNumber(true);
      try {
        const res = await getB2BPoNumber();
        if (res?.poReference) {
          setPoReference(res.poReference);
        }
      } catch (err) {
        console.warn('Failed to fetch PO Number:', err);
      } finally {
        setLoadingPoNumber(false);
      }
    }

    // 2. Fetch stores & locations for Cost Centre & Delivery
    async function loadLocationsAndStores() {
      try {
        const [storesRes, locationsRes] = await Promise.allSettled([
          getB2BLocationStores(),
          getB2BLocations(),
        ]);

        const rawStores =
          storesRes.status === 'fulfilled'
            ? Array.isArray(storesRes.value?.data)
              ? storesRes.value.data
              : Array.isArray(storesRes.value)
                ? storesRes.value
                : []
            : [];

        const rawLocations: StoreLocation[] =
          locationsRes.status === 'fulfilled'
            ? Array.isArray(locationsRes.value?.data)
              ? locationsRes.value.data
              : Array.isArray(locationsRes.value)
                ? locationsRes.value
                : []
            : [];

        // Populate Cost Centres from stores / locations
        const extractedCostCentres: CostCentreOption[] = [];
        if (rawStores.length > 0) {
          rawStores.forEach((st: any) => {
            extractedCostCentres.push({
              id: st.id || st._id || String(st.name),
              name: st.name || st.storeName || 'Store Location',
            });
          });
        } else if (rawLocations.length > 0) {
          rawLocations.forEach((loc) => {
            if (Array.isArray(loc.costCentres) && loc.costCentres.length > 0) {
              loc.costCentres.forEach((cc) => extractedCostCentres.push(cc));
            } else {
              extractedCostCentres.push({
                id: loc.id,
                name: loc.name || loc.deliverTo?.storeName || 'Cost Centre',
              });
            }
          });
        }

        if (extractedCostCentres.length > 0) {
          setCostCentres(extractedCostCentres);
          setSelectedCostCentreId(extractedCostCentres[0].id);
        }

        if (rawLocations.length > 0) {
          setLocations(rawLocations);
          setSelectedLocationId(rawLocations[0].id);

          const firstLoc = rawLocations[0];
          if (Array.isArray(firstLoc.receivingContacts) && firstLoc.receivingContacts.length > 0) {
            setReceivingContacts(firstLoc.receivingContacts);
            setSelectedReceivingContactId(firstLoc.receivingContacts[0].id);
          }
          if (Array.isArray(firstLoc.preferredWindows) && firstLoc.preferredWindows.length > 0) {
            setPreferredWindows(firstLoc.preferredWindows);
            setSelectedPreferredWindow(firstLoc.preferredWindows[0]);
          }
        }
      } catch (err) {
        console.warn('Failed to load locations/stores:', err);
      }
    }

    // 3. Fetch payment options
    async function loadPaymentOptions() {
      try {
        const res = await getB2BPaymentOptions();
        const data = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        if (data.length > 0) {
          setPaymentOptions(data);
          setSelectedPaymentOptionId(data[0].id);
        }
      } catch (err) {
        console.warn('Failed to load payment options:', err);
      }
    }

    loadPoNumber();
    loadLocationsAndStores();
    loadPaymentOptions();
  }, [fetchCart]);

  const itemCount = mounted ? items.reduce((count, item) => count + (item.quantity || 0), 0) : 0;
  const appliedCostSubtotal = mounted ? getCartTotal() : 0;
  const gst = appliedCostSubtotal * 0.1;
  const total = appliedCostSubtotal + gst;

  const standardPriceValue = mounted
    ? items.reduce((sum, item) => {
        const base = Number(item.product?.startingCost ?? item.product?.price ?? item.unitPrice ?? 0);
        return sum + base * (item.quantity || 0);
      }, 0)
    : 0;
  const slabSavings = standardPriceValue > appliedCostSubtotal ? standardPriceValue - appliedCostSubtotal : 0;
  const uniqueProductsCount = mounted ? items.length : 0;

  const activePaymentOption =
    paymentOptions.find((p) => p.id === selectedPaymentOptionId) || paymentOptions[0];
  const paymentOptionLabel = activePaymentOption?.title || '7 Day · Direct Debit';

  // 4. POST /api/v1/b2b/create-order
  const handleCreatePo = async () => {
    if (submittingOrder) return;
    setSubmittingOrder(true);
    setOrderError(null);

    const payload: CreateOrderPayload = {
      poReference: poReference.trim() || 'STORE-8848',
      costCentreId: selectedCostCentreId || 'cc-01',
      locationId: selectedLocationId || 'loc-001',
      deliveryDate: deliveryDate || '2026-08-08',
      receivingContactId: selectedReceivingContactId || 'rc-01',
      preferredWindow: selectedPreferredWindow || '8:00 AM - 10:00 AM',
      paymentOptionId: selectedPaymentOptionId || 'pay-opt-01',
      notes: orderNotes.trim(),
    };

    try {
      const res = await createB2BOrder(payload);
      setOrderSuccess(res);
      await clearCart();
      setTimeout(() => {
        setShowModal(false);
        router.push(res?.orderId ? `/purchase-orders/${res.orderId}` : '/purchase-orders');
      }, 1500);
    } catch (err: any) {
      console.error('Failed to create purchase order:', err);
      setOrderError(err.message || 'Failed to submit Purchase Order. Please try again.');
    } finally {
      setSubmittingOrder(false);
    }
  };

  return (
    <>
      <div className="page active" id="cart">
        <div className="page-head">
          <div className="title-wrap">
            <h1>Cart &amp; Create Purchase Order</h1>
            <p>
              Review quantities, applied cost prices, slab savings and delivery details before
              submitting your PO.
            </p>
          </div>
          <div className="head-actions">
            {mounted && items.length > 0 && (
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete all items from your cart?')) {
                    clearCart();
                  }
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginRight: '6px' }}
                >
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                </svg>
                Clear Cart
              </button>
            )}
            <Link href="/products" className="btn">
              &minus; Continue Ordering
            </Link>
            <button
              className="btn btn-primary"
              onClick={() => {
                setOrderError(null);
                setOrderSuccess(null);
                setShowModal(true);
              }}
              disabled={items.length === 0}
            >
              Create Purchase Order
            </button>
          </div>
        </div>

        <div className="detail-grid">
          <div>
            <div className="card">
              <div className="card-head">
                <div>
                  <h2>Cart Products</h2>
                  <p>Applied cost price is locked when the PO is submitted</p>
                </div>
                <span className="status alloc" id="cartTierStatus">
                  Slab Pricing Applied
                </span>
              </div>
              <div className="table-wrap">
                <table className="table" style={{ minWidth: '1000px' }}>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Standard Cost</th>
                      <th>Applied Slab</th>
                      <th>Applied Cost Price</th>
                      <th>Saving / Unit</th>
                      <th>Line Total</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody id="cartTableBody">
                    {mounted && items.length === 0 && (
                      <tr>
                        <td
                          colSpan={8}
                          style={{ textAlign: 'center', padding: '30px', color: 'var(--muted)' }}
                        >
                          Your cart is empty.
                        </td>
                      </tr>
                    )}
                    {mounted &&
                      items.map((item) => {
                        const unitLabel =
                          item.unitType ||
                          item.unit_type_name ||
                          item.product?.unitType ||
                          item.product?.unit_type_name ||
                          item.product?.unit ||
                          'Unit';
                        const allTiers = item.product?.priceTiers || item.product?.tiers || [];
                        const tiers =
                          unitLabel && allTiers.some((t) => Boolean(t.unitType))
                            ? allTiers.filter(
                                (t) => !t.unitType || t.unitType.toLowerCase() === unitLabel.toLowerCase()
                              )
                            : allTiers;
                        const basePrice =
                          tiers.length > 0
                            ? Number(tiers[0].price)
                            : Number(item.product?.startingCost ?? item.product?.price ?? item.unitPrice ?? 0);
                        const appliedCost =
                          item.appliedPriceTier?.price ?? getTierPrice(item.quantity, tiers, basePrice);
                        const appliedTier =
                          item.appliedPriceTier?.label ||
                          tiers.find((t) => Number(t.price) === appliedCost)?.label ||
                          'Base';
                        const savingPerUnit = basePrice > appliedCost ? basePrice - appliedCost : 0;
                        const lineTotal = item.total || appliedCost * item.quantity;
                        const productName = item.name || item.product?.name || item.productId;
                        const productMeta = [item.sku || item.product?.sku, unitLabel]
                          .filter(Boolean)
                          .join(' · ');

                        const cartItemId = item.cartItemId || item.id || '';

                        return (
                          <tr key={cartItemId || `${item.productId}_${unitLabel}`}>
                            <td>
                              <div className="prod-name" style={{ fontWeight: 600 }}>
                                {productName}
                              </div>
                              <div className="subtext">{productMeta || 'Standard Item'}</div>
                            </td>
                            <td>
                              <div className="qty-box">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      cartItemId,
                                      item.productId,
                                      item.quantity - 1,
                                      unitLabel,
                                      item.product
                                    )
                                  }
                                >
                                  &minus;
                                </button>
                                <input type="text" readOnly value={item.quantity} />
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      cartItemId,
                                      item.productId,
                                      item.quantity + 1,
                                      unitLabel,
                                      item.product
                                    )
                                  }
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td>${basePrice.toFixed(2)}</td>
                            <td>
                              {appliedCost < basePrice ? (
                                <span
                                  className="status alloc"
                                  style={{ fontSize: '9px', padding: '3px 6px' }}
                                >
                                  {appliedTier}
                                </span>
                              ) : (
                                <span
                                  className="status default"
                                  style={{ fontSize: '9px', padding: '3px 6px' }}
                                >
                                  Standard
                                </span>
                              )}
                            </td>
                            <td>
                              <strong>${appliedCost.toFixed(2)}</strong>
                              <div className="subtext" style={{ marginTop: '2px' }}>
                                Applied cost / {unitLabel}
                              </div>
                            </td>
                            <td
                              style={{
                                color: savingPerUnit > 0 ? 'var(--green)' : 'inherit',
                                fontWeight: savingPerUnit > 0 ? 700 : 400,
                              }}
                            >
                              {savingPerUnit > 0 ? `$${savingPerUnit.toFixed(2)}` : '-'}
                            </td>
                            <td>
                              <strong>${lineTotal.toFixed(2)}</strong>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <button
                                type="button"
                                className="ci-delete-btn"
                                title="Remove item from cart"
                                aria-label="Remove item from cart"
                                onClick={() => removeItem(cartItemId, item.productId, unitLabel)}
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  width="16"
                                  height="16"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card" style={{ marginTop: '14px' }}>
              <div className="card-head">
                <div>
                  <h2>Delivery &amp; PO Details</h2>
                  <p>These details travel with the PO</p>
                </div>
              </div>
              <div className="card-body">
                <div className="form-grid">
                  <div className="form-field">
                    <label>
                      Your PO / Internal Reference{' '}
                      {loadingPoNumber && <small style={{ color: 'var(--muted)' }}>(generating...)</small>}
                    </label>
                    <input
                      value={poReference}
                      onChange={(e) => setPoReference(e.target.value)}
                      placeholder="e.g. STORE-8848"
                    />
                  </div>
                  <div className="form-field">
                    <label>Cost Centre</label>
                    <select
                      value={selectedCostCentreId}
                      onChange={(e) => setSelectedCostCentreId(e.target.value)}
                    >
                      {costCentres.map((cc) => (
                        <option key={cc.id} value={cc.id}>
                          {cc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Deliver To</label>
                    <select
                      value={selectedLocationId}
                      onChange={(e) => setSelectedLocationId(e.target.value)}
                    >
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name || loc.deliverTo?.storeName || loc.address || 'Delivery Location'}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Requested Delivery Date</label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label>Receiving Contact</label>
                    <select
                      value={selectedReceivingContactId}
                      onChange={(e) => setSelectedReceivingContactId(e.target.value)}
                    >
                      {receivingContacts.map((rc) => (
                        <option key={rc.id} value={rc.id}>
                          {rc.name} {rc.phone ? `· ${rc.phone}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Preferred Window</label>
                    <select
                      value={selectedPreferredWindow}
                      onChange={(e) => setSelectedPreferredWindow(e.target.value)}
                    >
                      {preferredWindows.map((pw) => (
                        <option key={pw} value={pw}>
                          {pw}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-field full">
                    <label>Order Notes</label>
                    <textarea
                      placeholder="Delivery instructions, substitutions, quality requirements..."
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{ marginTop: '14px' }} id="paymentCard">
              <div className="card-head">
                <div>
                  <h2>Payment Option</h2>
                  <p>Select how this purchase order will be paid</p>
                </div>
                <span className="status alloc" id="paymentTermBadge">
                  {paymentOptionLabel}
                </span>
              </div>
              <div className="card-body">
                <div className="payment-options">
                  {paymentOptions.map((opt) => {
                    const isSelected = opt.id === selectedPaymentOptionId;
                    return (
                      <div
                        key={opt.id}
                        className={`payment-option ${isSelected ? 'active' : ''}`}
                        onClick={() => setSelectedPaymentOptionId(opt.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="payment-radio"></div>
                        <div>
                          <strong>{opt.title}</strong>
                          <span>{opt.description}</span>
                          {opt.savedAccount && (
                            <span className="pay-badge">{opt.savedAccount}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {activePaymentOption?.summary && (
                  <div className="payment-panel">
                    <div className="payment-summary-line">
                      <span>Payment term</span>
                      <b>{activePaymentOption.summary.paymentTerm || 'Standard'}</b>
                    </div>
                    <div className="payment-summary-line">
                      <span>Method</span>
                      <b>{activePaymentOption.summary.method || activePaymentOption.title}</b>
                    </div>
                    <div className="payment-summary-line">
                      <span>Collection</span>
                      <b>{activePaymentOption.summary.collection || 'Automatic on due date'}</b>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside>
            <div className="card sticky">
              <div className="card-head">
                <div>
                  <h2>PO Summary</h2>
                  <p>Melbourne Fresh Foods</p>
                </div>
              </div>
              <div className="po-totals">
                <div className="sum-row">
                  <span>Products</span>
                  <b>{uniqueProductsCount}</b>
                </div>
                <div className="sum-row">
                  <span>Total Units / Packs</span>
                  <b>{itemCount}</b>
                </div>
                <div className="sum-row">
                  <span>Standard-price value</span>
                  <b>${standardPriceValue.toFixed(2)}</b>
                </div>
                <div className="sum-row">
                  <span>Slab savings</span>
                  <b className="saving">&minus;${slabSavings.toFixed(2)}</b>
                </div>
                <div className="sum-row">
                  <span>Applied-cost subtotal</span>
                  <b>${appliedCostSubtotal.toFixed(2)}</b>
                </div>
                <div className="sum-row">
                  <span>GST</span>
                  <b>${gst.toFixed(2)}</b>
                </div>
                <div className="sum-row total">
                  <span>PO Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="payment-summary-line" style={{ marginTop: '8px' }}>
                  <span>Payment</span>
                  <b>{paymentOptionLabel}</b>
                </div>
                <div className="callout green" style={{ marginTop: '10px' }}>
                  <strong>Pricing snapshot:</strong> each line will save the exact applied slab and
                  cost price used at the moment the PO is submitted.
                </div>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '10px' }}
                  onClick={() => {
                    setOrderError(null);
                    setOrderSuccess(null);
                    setShowModal(true);
                  }}
                  disabled={items.length === 0}
                >
                  Create &amp; Submit PO
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div
        className={`modal-backdrop ${showModal ? 'show' : ''}`}
        style={showModal ? { display: 'flex' } : { display: 'none' }}
        onClick={(e) => {
          if (e.target === e.currentTarget && !submittingOrder) {
            setShowModal(false);
          }
        }}
      >
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-head">
            <div>
              <h3>Confirm Purchase Order</h3>
              <div className="subtext">Final server-side pricing check</div>
            </div>
            <button
              type="button"
              className="close"
              aria-label="Close modal"
              onClick={() => {
                if (!submittingOrder) setShowModal(false);
              }}
            >
              &times;
            </button>
          </div>
          <div className="modal-body">
            {orderSuccess ? (
              <div className="callout green" style={{ marginBottom: '14px' }}>
                <strong>Order Submitted Successfully!</strong>
                <div style={{ marginTop: '6px' }}>
                  PO Number: <strong>{orderSuccess.orderId || poReference}</strong>
                  {orderSuccess.estimatedDelivery && (
                    <span> &middot; Estimated Delivery: {orderSuccess.estimatedDelivery}</span>
                  )}
                </div>
                <div style={{ marginTop: '6px', fontSize: '11px', opacity: 0.85 }}>
                  Redirecting to Purchase Orders...
                </div>
              </div>
            ) : (
              <>
                <div className="callout green">
                  <strong>All prices verified.</strong> The applied slab and cost price shown in your
                  cart match the latest pricing for this account.
                </div>

                {orderError && (
                  <div
                    style={{
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      color: '#b91c1c',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      marginTop: '12px',
                    }}
                  >
                    <strong>Submission Failed:</strong> {orderError}
                  </div>
                )}

                <div
                  className="card"
                  style={{
                    marginTop: '12px',
                    boxShadow: 'none',
                    background: '#f8fafc',
                    border: '1px solid var(--line)',
                  }}
                >
                  <div style={{ padding: '12px 14px' }}>
                    <div className="sum-row">
                      <span>PO Reference</span>
                      <b>{poReference || 'STORE-8848'}</b>
                    </div>
                    <div className="sum-row">
                      <span>Products</span>
                      <b>{uniqueProductsCount}</b>
                    </div>
                    <div className="sum-row">
                      <span>Applied-cost subtotal</span>
                      <b>${appliedCostSubtotal.toFixed(2)}</b>
                    </div>
                    <div className="sum-row">
                      <span>Slab savings</span>
                      <b className="saving">&minus;${slabSavings.toFixed(2)}</b>
                    </div>
                    <div className="sum-row">
                      <span>Payment</span>
                      <b>{paymentOptionLabel}</b>
                    </div>
                    <div className="sum-row total">
                      <span>PO Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setShowModal(false)}
                    disabled={submittingOrder}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleCreatePo}
                    disabled={submittingOrder || items.length === 0}
                  >
                    {submittingOrder ? 'Submitting PO...' : 'Create & Submit PO'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
