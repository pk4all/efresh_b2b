'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  getB2BPurchaseOrderById,
  getB2BPurchaseOrderTimeline,
  downloadB2BPurchaseOrderPdf,
  PurchaseOrderDetail,
  PurchaseOrderItem,
  addB2BCartItem,
} from '@/lib/api';

export default function PurchaseOrderDetailPage() {
  const router = useRouter();
  const routeParams = useParams();
  
  const id = typeof routeParams?.id === 'string'
    ? routeParams.id
    : Array.isArray(routeParams?.id)
    ? routeParams.id[0]
    : '';

  const [order, setOrder] = useState<PurchaseOrderDetail | null>(null);
  const [timelineList, setTimelineList] = useState<
    Array<{ step: string; status: string; description: string }> | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [duplicating, setDuplicating] = useState<boolean>(false);
  const [downloadingPdf, setDownloadingPdf] = useState<boolean>(false);

  const fetchOrder = useCallback(async (orderId: string) => {
    if (!orderId) return;
    try {
      setLoading(true);
      setError(null);

      const [orderRes, timelineRes]: [any, any] = await Promise.allSettled([
        getB2BPurchaseOrderById(orderId),
        getB2BPurchaseOrderTimeline(orderId),
      ]);

      if (orderRes.status === 'fulfilled') {
        const data = orderRes.value?.data || orderRes.value;
        if (data && (data.id || data.orderId || data.items || data.poReference || data.status)) {
          setOrder(data);
        } else {
          setError('Purchase order not found.');
        }
      } else {
        setError(orderRes.reason?.message || 'Failed to fetch purchase order details.');
      }

      if (timelineRes.status === 'fulfilled') {
        const tData = timelineRes.value?.data || timelineRes.value;
        if (Array.isArray(tData) && tData.length > 0) {
          setTimelineList(tData);
        }
      }
    } catch (err: any) {
      console.error('Failed to load purchase order details:', err);
      setError(err.message || 'Failed to fetch purchase order details.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchOrder(id);
    }
  }, [id, fetchOrder]);

  const handleDuplicateOrder = async () => {
    if (!order?.items || order.items.length === 0) return;
    try {
      setDuplicating(true);
      for (const item of order.items) {
        if (item.productId || item.product_id) {
          try {
            await addB2BCartItem({
              productId: item.productId || item.product_id || '',
              quantity: item.qty || item.quantity || 1,
              unitType: item.unit_type_name || item.unitType || 'Unit',
            });
          } catch (e) {
            console.warn('Could not add item to cart:', item, e);
          }
        }
      }
      router.push('/cart');
    } catch (err) {
      console.error('Failed to duplicate order:', err);
    } finally {
      setDuplicating(false);
    }
  };

  const handleDownloadPdf = async () => {
    const poId = order?.id || id;
    if (!poId) return;
    try {
      setDownloadingPdf(true);
      const blob = await downloadB2BPurchaseOrderPdf(poId);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${poId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err: any) {
      console.warn('PDF endpoint download failed, falling back to browser print:', err);
      window.print();
    } finally {
      setDownloadingPdf(false);
    }
  };

  const formatDate = (dateStr?: string, includeTime = false) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      if (includeTime) {
        return d.toLocaleDateString('en-AU', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      }
      return d.toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const formatShortDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (status?: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('submit') || s.includes('pend')) {
      return <span className="status s-amber">{status || 'Submitted'}</span>;
    }
    if (s.includes('confirm') || s.includes('alloc')) {
      return <span className="status s-blue">{status || 'Confirmed'}</span>;
    }
    if (s.includes('transit') || s.includes('delivery')) {
      return <span className="status s-violet">{status || 'In Transit'}</span>;
    }
    if (s.includes('complet') || s.includes('deliver') || s.includes('receiv')) {
      return <span className="status s-green">{status || 'Completed'}</span>;
    }
    if (s.includes('cancel')) {
      return <span className="status s-red">{status || 'Cancelled'}</span>;
    }
    return <span className="status s-grey">{status || 'Draft'}</span>;
  };

  // Calculations & fallback handling
  const poTotal =
    order?.commercialSummary?.poTotal ??
    order?.total ??
    (order?.items
      ? order.items.reduce(
          (sum, i) =>
            sum +
            (i.lineTotal ||
              i.total ||
              (i.appliedCostPrice || i.cost_price || 0) * (i.qty || i.quantity || 1)),
          0
        )
      : 0);

  const slabSavings =
    order?.commercialSummary?.slabSavings ??
    order?.savings ??
    order?.slabSaving ??
    (order?.items ? order.items.reduce((sum, i) => sum + (i.saving || 0), 0) : 0);

  const standardPriceValue =
    order?.commercialSummary?.standardPriceValue ?? poTotal + slabSavings;

  const appliedCostSubtotal =
    order?.commercialSummary?.appliedCostSubtotal ??
    order?.subtotal ??
    poTotal / 1.1;

  const gst =
    order?.commercialSummary?.gst ?? order?.gst ?? poTotal - appliedCostSubtotal;

  // Timeline steps computation
  const currentStatusLower = (order?.status || '').toLowerCase();

  const getTimelineSteps = () => {
    if (Array.isArray(timelineList) && timelineList.length > 0) {
      return timelineList;
    }

    if (Array.isArray(order?.timeline)) {
      return order.timeline;
    }

    const tObj = (typeof order?.timeline === 'object' && order?.timeline) || {};

    const steps = [
      {
        step: 'Submitted',
        status: tObj.submitted ? 'Completed' : currentStatusLower ? 'Completed' : 'Pending',
        description: tObj.submitted
          ? formatShortDate(tObj.submitted)
          : formatDate(order?.createdAt),
      },
      {
        step: 'Confirmed',
        status:
          tObj.confirmed ||
          currentStatusLower.includes('confirm') ||
          currentStatusLower.includes('pack') ||
          currentStatusLower.includes('transit') ||
          currentStatusLower.includes('complet')
            ? 'Completed'
            : currentStatusLower.includes('submit')
            ? 'Active'
            : 'Pending',
        description: tObj.confirmed
          ? formatShortDate(tObj.confirmed)
          : currentStatusLower.includes('confirm')
          ? 'Confirmed'
          : 'Pending',
      },
      {
        step: 'Packed',
        status:
          tObj.packed ||
          currentStatusLower.includes('pack') ||
          currentStatusLower.includes('transit') ||
          currentStatusLower.includes('complet')
            ? 'Completed'
            : 'Pending',
        description: tObj.packed ? formatShortDate(tObj.packed) : 'Pending',
      },
      {
        step: 'In Transit',
        status:
          tObj.inTransit || currentStatusLower.includes('transit')
            ? 'Active'
            : currentStatusLower.includes('complet')
            ? 'Completed'
            : 'Pending',
        description: tObj.inTransit
          ? formatShortDate(tObj.inTransit)
          : order?.delivery?.eta || 'ETA 2–4 PM',
      },
      {
        step: 'Delivered',
        status:
          tObj.delivered ||
          currentStatusLower.includes('deliver') ||
          currentStatusLower.includes('complet')
            ? 'Completed'
            : 'Pending',
        description: tObj.delivered ? formatShortDate(tObj.delivered) : 'Pending',
      },
      {
        step: 'Received',
        status:
          tObj.received || currentStatusLower.includes('receiv')
            ? 'Completed'
            : 'Pending',
        description: tObj.received ? formatShortDate(tObj.received) : 'Pending',
      },
    ];

    return steps;
  };

  if (loading) {
    return (
      <div className="page active" id="po-detail">
        <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--muted)' }}>
          <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>
            Loading purchase order details...
          </div>
          <div>Retrieving {id || 'order'}</div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="page active" id="po-detail">
        <div className="page-head">
          <div className="title-wrap">
            <h1>{id || 'Purchase Order'}</h1>
            <p>Purchase Order Details</p>
          </div>
          <div className="head-actions">
            <Link href="/purchase-orders" className="btn">
              &larr; Purchase Orders
            </Link>
          </div>
        </div>
        <div
          className="card"
          style={{
            padding: '24px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            marginTop: '16px',
          }}
        >
          <h3>Failed to load purchase order</h3>
          <p style={{ marginTop: '8px' }}>{error || 'Unable to find order details.'}</p>
          <div style={{ marginTop: '16px' }}>
            <button className="btn" onClick={() => id && fetchOrder(id)}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const timelineSteps = getTimelineSteps();

  return (
    <div className="page active" id="po-detail">
      <div className="page-head">
        <div className="title-wrap">
          <h1>{order.id || id}</h1>
          <p>
            Customer PO {order.customerPoRef || order.poReference || '—'} &middot; Created{' '}
            {formatDate(order.createdAt, true)}
            {order.createdBy?.name ? ` by ${order.createdBy.name}` : ''}
          </p>
        </div>
        <div className="head-actions">
          <Link href="/purchase-orders" className="btn">
            &larr; Purchase Orders
          </Link>
          <button
            className="btn"
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            title="Download Purchase Order PDF"
          >
            {downloadingPdf ? 'Downloading PDF...' : 'Download PDF'}
          </button>
          <button
            className="btn btn-primary"
            onClick={handleDuplicateOrder}
            disabled={duplicating || !order.items || order.items.length === 0}
          >
            {duplicating ? 'Adding to Cart...' : 'Duplicate Order'}
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics">
        <div className="metric blue">
          <div>
            <div className="metric-label">PO Total</div>
            <div className="metric-value">
              $
              {Number(poTotal).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="metric-sub">Including GST</div>
          </div>
          <div className="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
        </div>

        <div className="metric green">
          <div>
            <div className="metric-label">Slab Savings</div>
            <div className="metric-value">
              $
              {Number(slabSavings).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="metric-sub">Against standard B2B price</div>
          </div>
          <div className="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
          </div>
        </div>

        <div className="metric violet">
          <div>
            <div className="metric-label">Delivery</div>
            <div className="metric-value">
              {order.delivery?.requestedDate
                ? formatDate(order.delivery.requestedDate)
                : order.delivery?.eta || 'Scheduled'}
            </div>
            <div className="metric-sub">
              {order.delivery?.window || order.delivery?.eta || 'Delivery Window'}
            </div>
          </div>
          <div className="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z" />
              <circle cx="7" cy="19" r="2" />
              <circle cx="18" cy="19" r="2" />
            </svg>
          </div>
        </div>

        <div className="metric amber">
          <div>
            <div className="metric-label">Invoice</div>
            <div className="metric-value">
              {order.invoiceStatus || order.payment?.status || 'Pending'}
            </div>
            <div className="metric-sub">
              {order.payment?.method || 'Issued after receipt'}
            </div>
          </div>
          <div className="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <line x1="7" y1="8" x2="17" y2="8" />
              <line x1="7" y1="12" x2="17" y2="12" />
              <line x1="7" y1="16" x2="13" y2="16" />
            </svg>
          </div>
        </div>
      </div>

      {/* Timeline Progression Card */}
      <div className="card" style={{ marginBottom: '14px' }}>
        <div className="card-head">
          <div>
            <h2>PO Status</h2>
            <p>Supplier and delivery progression</p>
          </div>
          {getStatusBadge(order.status)}
        </div>
        <div className="timeline">
          {timelineSteps.map((s, idx) => {
            const isDone =
              s.status === 'Completed' ||
              s.status === 'done' ||
              s.status === 'Done';
            const isCurrent =
              s.status === 'Active' ||
              s.status === 'current' ||
              s.status === 'In Progress';
            return (
              <div
                key={idx}
                className={`tstep ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}
              >
                <b>{s.step}</b>
                {s.description || '—'}
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Products Table and Aside */}
      <div className="detail-grid">
        <div>
          {/* Products Snapshot Card */}
          <div className="card">
            <div className="card-head">
              <div>
                <h2>Products &amp; Pricing Snapshot</h2>
                <p>Applied cost prices are preserved from the submitted cart</p>
              </div>
            </div>
            <div className="table-wrap">
              <table className="table" style={{ minWidth: '850px' }}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Standard Cost</th>
                    <th>Applied Slab</th>
                    <th>Applied Cost Price</th>
                    <th>Saving</th>
                    <th>Line Total</th>
                  </tr>
                </thead>
                <tbody>
                  {!order.items || order.items.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)' }}
                      >
                        No product items recorded for this purchase order.
                      </td>
                    </tr>
                  ) : (
                    order.items.map((item: PurchaseOrderItem, i: number) => {
                      const qty = item.qty ?? item.quantity ?? 1;
                      const appliedPrice =
                        item.appliedCostPrice ?? item.cost_price ?? item.price ?? 0;
                      const standardPrice =
                        item.standardCost ??
                        (appliedPrice + (item.saving ? item.saving / qty : 0));
                      const lineTotal =
                        item.lineTotal ?? item.total ?? appliedPrice * qty;
                      const saving =
                        item.saving ?? Math.max(0, (standardPrice - appliedPrice) * qty);

                      return (
                        <tr key={item.productId || i}>
                          <td className="primary-cell">
                            {item.name || item.product_name || 'Item'}
                            <span className="subtext">
                              {item.unit_type_name || item.unitType || ''}
                              {item.sku ? ` · ${item.sku}` : ''}
                            </span>
                          </td>
                          <td>{qty}</td>
                          <td>${Number(standardPrice).toFixed(2)}</td>
                          <td>
                            <span className="status alloc">
                              {item.appliedSlab || item.appliedPriceTier || 'Standard'}
                            </span>
                          </td>
                          <td>
                            <strong style={{ color: 'var(--blue)' }}>
                              ${Number(appliedPrice).toFixed(2)}
                            </strong>
                          </td>
                          <td className="saving">
                            {saving > 0 ? `$${Number(saving).toFixed(2)}` : '—'}
                          </td>
                          <td>
                            <strong>${Number(lineTotal).toFixed(2)}</strong>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Delivery Information Card */}
          <div className="card" style={{ marginTop: '14px' }}>
            <div className="card-head">
              <h2>Delivery Information</h2>
            </div>
            <div className="info-list">
              <div className="info-item">
                <label>Deliver To</label>
                <b>
                  {order.delivery?.deliverTo ||
                    order.delivery?.storeName ||
                    order.delivery?.storeAddress ||
                    'Main Store Delivery'}
                </b>
              </div>
              <div className="info-item">
                <label>Requested Date</label>
                <b>{formatDate(order.delivery?.requestedDate) || '—'}</b>
              </div>
              <div className="info-item">
                <label>Receiving Contact</label>
                <b>{order.delivery?.receivingContact || 'Receiving Team'}</b>
              </div>
              <div className="info-item">
                <label>Window / ETA</label>
                <b>
                  {order.delivery?.window || order.delivery?.eta || 'Normal Business Hours'}
                </b>
              </div>
              <div className="info-item">
                <label>Delivery ID</label>
                <b>{order.delivery?.deliveryId || 'DEL-PENDING'}</b>
              </div>
              <div className="info-item">
                <label>Notes</label>
                <b>{order.delivery?.notes || 'None'}</b>
              </div>
            </div>
          </div>
        </div>

        {/* Aside Summary & Order Details */}
        <aside>
          <div className="card">
            <div className="card-head">
              <h2>Commercial Summary</h2>
            </div>
            <div className="po-totals">
              <div className="sum-row">
                <span>Standard price value</span>
                <b>${Number(standardPriceValue).toFixed(2)}</b>
              </div>
              <div className="sum-row">
                <span>Slab savings</span>
                <b className="saving">&minus;${Number(slabSavings).toFixed(2)}</b>
              </div>
              <div className="sum-row">
                <span>Applied-cost subtotal</span>
                <b>${Number(appliedCostSubtotal).toFixed(2)}</b>
              </div>
              <div className="sum-row">
                <span>GST</span>
                <b>${Number(gst).toFixed(2)}</b>
              </div>
              <div className="sum-row total">
                <span>PO Total</span>
                <span>${Number(poTotal).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginTop: '14px' }}>
            <div className="card-head">
              <h2>Order Details</h2>
            </div>
            <div className="info-list" style={{ gridTemplateColumns: '1fr' }}>
              <div className="info-item">
                <label>Your Reference</label>
                <b>{order.customerPoRef || order.poReference || '—'}</b>
              </div>
              <div className="info-item">
                <label>Cost Centre</label>
                <b>{order.costCentre || 'Main Store'}</b>
              </div>
              <div className="info-item">
                <label>Created By</label>
                <b>
                  {order.createdBy?.name || 'Authorized Buyer'}
                  {order.createdBy?.role ? ` · ${order.createdBy.role}` : ''}
                </b>
              </div>
              <div className="info-item">
                <label>Supplier</label>
                <b>{order.supplier || 'eFresh Wholesale'}</b>
              </div>
              <div className="info-item">
                <label>Payment</label>
                <b>{order.payment?.method || order.payment?.term || 'Account Terms'}</b>
              </div>
              <div className="info-item">
                <label>Payment Status</label>
                <b>{order.payment?.status || order.invoiceStatus || 'Scheduled'}</b>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
