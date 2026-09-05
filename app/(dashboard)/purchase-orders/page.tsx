'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  getB2BPurchaseOrdersSummary,
  getB2BPurchaseOrdersStatuses,
  getB2BPurchaseOrders,
  getB2BLocationStores,
  PurchaseOrdersSummary,
  PurchaseOrderStatusOption,
  PurchaseOrderListItem,
} from '@/lib/api';

export default function PurchaseOrdersPage() {
  const [summary, setSummary] = useState<PurchaseOrdersSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState<boolean>(true);

  const [statuses, setStatuses] = useState<PurchaseOrderStatusOption[]>([]);
  const [locations, setLocations] = useState<{ id: string; name: string }[]>([]);
  
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [orders, setOrders] = useState<PurchaseOrderListItem[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  // Fetch summary metrics
  const fetchSummary = useCallback(async () => {
    try {
      setLoadingSummary(true);
      const res: any = await getB2BPurchaseOrdersSummary();
      const data = res?.data || res;
      if (data) {
        setSummary({
          openPos: data.openPos,
          awaitingConfirmation: data.awaitingConfirmation,
          inDelivery: data.inDelivery,
          completedThisMonth: data.completedThisMonth,
        });
      }
    } catch (err: any) {
      console.warn('Failed to load purchase orders summary:', err);
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  // Fetch filter dropdown options (statuses & location stores)
  const fetchFilterOptions = useCallback(async () => {
    try {
      const [statusRes, locRes]: [any, any] = await Promise.allSettled([
        getB2BPurchaseOrdersStatuses(),
        getB2BLocationStores(),
      ]);

      if (statusRes.status === 'fulfilled') {
        const rawStatuses = statusRes.value?.data || statusRes.value || [];
        if (Array.isArray(rawStatuses) && rawStatuses.length > 0) {
          setStatuses(rawStatuses);
        } else {
          setStatuses([
            { id: 'all', label: 'All Statuses' },
            { id: 'submitted', label: 'Submitted' },
            { id: 'confirmed', label: 'Confirmed' },
            { id: 'in_transit', label: 'In Transit' },
            { id: 'completed', label: 'Completed' },
          ]);
        }
      }

      if (locRes.status === 'fulfilled') {
        const rawLocs = locRes.value?.data || locRes.value || [];
        if (Array.isArray(rawLocs)) {
          const parsed = rawLocs.map((loc: any) => ({
            id: loc.id || loc._id || loc.name,
            name: loc.name || loc.deliverTo?.storeName || loc.address || 'Store Location',
          }));
          setLocations(parsed);
        }
      }
    } catch (err) {
      console.warn('Failed to load filter options:', err);
    }
  }, []);

  // Fetch orders with current filters
  const fetchOrders = useCallback(async () => {
    try {
      setLoadingOrders(true);
      setOrdersError(null);

      const params: any = {};
      if (selectedStatus && selectedStatus !== 'all') {
        params.status = selectedStatus;
      }
      if (selectedLocation && selectedLocation !== 'all') {
        params.locationId = selectedLocation;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const res: any = await getB2BPurchaseOrders(params);
      let list: PurchaseOrderListItem[] = [];
      if (Array.isArray(res)) {
        list = res;
      } else if (Array.isArray(res?.data)) {
        list = res.data;
      } else if (Array.isArray(res?.orders)) {
        list = res.orders;
      }

      // If search query is applied, ensure case-insensitive client matching if not handled by API
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        list = list.filter(
          (o) =>
            o.id?.toLowerCase().includes(q) ||
            o.customerPoRef?.toLowerCase().includes(q) ||
            o.createdBy?.name?.toLowerCase().includes(q) ||
            o.status?.toLowerCase().includes(q)
        );
      }

      setOrders(list);
    } catch (err: any) {
      console.error('Failed to load purchase orders:', err);
      setOrdersError(err.message || 'Failed to fetch purchase orders.');
    } finally {
      setLoadingOrders(false);
    }
  }, [selectedStatus, selectedLocation, searchQuery]);

  useEffect(() => {
    fetchSummary();
    fetchFilterOptions();
  }, [fetchSummary, fetchFilterOptions]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchOrders]);

  // Helper for status badge CSS
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

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="page active" id="purchase-orders">
      <div className="page-head">
        <div className="title-wrap">
          <h1>Purchase Orders</h1>
          <p>
            All B2B orders created through the portal, including pricing snapshots and delivery status.
          </p>
        </div>
        <div className="head-actions">
          <Link href="/products" className="btn btn-primary">
            + New Order
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics">
        <div className="metric blue">
          <div>
            <div className="metric-label">Open POs</div>
            <div className="metric-value">
              {loadingSummary ? '—' : summary?.openPos?.count ?? 0}
            </div>
            <div className="metric-sub">
              {loadingSummary
                ? 'Loading...'
                : `$${(summary?.openPos?.totalValue ?? 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })} total value`}
            </div>
          </div>
          <div className="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 3h9l3 3v15H6z" />
              <path d="M9 10h6M9 14h6" />
            </svg>
          </div>
        </div>

        <div className="metric amber">
          <div>
            <div className="metric-label">Awaiting Confirmation</div>
            <div className="metric-value">
              {loadingSummary ? '—' : summary?.awaitingConfirmation?.count ?? 0}
            </div>
            <div className="metric-sub">
              {loadingSummary
                ? 'Loading...'
                : summary?.awaitingConfirmation?.latestPoRef || 'None pending'}
            </div>
          </div>
          <div className="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 22h14" />
              <path d="M5 2h14" />
              <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
              <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
            </svg>
          </div>
        </div>

        <div className="metric violet">
          <div>
            <div className="metric-label">In Delivery</div>
            <div className="metric-value">
              {loadingSummary ? '—' : summary?.inDelivery?.count ?? 0}
            </div>
            <div className="metric-sub">
              {loadingSummary
                ? 'Loading...'
                : `${summary?.inDelivery?.arrivingToday ?? 0} arriving today`}
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

        <div className="metric green">
          <div>
            <div className="metric-label">Completed This Month</div>
            <div className="metric-value">
              {loadingSummary ? '—' : summary?.completedThisMonth?.count ?? 0}
            </div>
            <div className="metric-sub">
              {loadingSummary
                ? 'Loading...'
                : `$${(summary?.completedThisMonth?.totalValuePurchased ?? 0).toLocaleString(
                    undefined,
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                  )} purchased`}
            </div>
          </div>
          <div className="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m5 12 5 5L20 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Toolbar with live search, statuses select box, and locations select box */}
      <div className="toolbar">
        <input
          className="field-inline search-inline"
          placeholder="Search PO or your reference"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Statuses Select Box */}
        <select
          className="field-inline"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          {statuses
            .filter((st) => st.id !== 'all')
            .map((st) => (
              <option key={st.id} value={st.id}>
                {st.label}
              </option>
            ))}
        </select>

        {/* Locations Select Box */}
        <select
          className="field-inline"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="all">All Locations</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="card table-wrap">
        {ordersError && (
          <div
            style={{
              padding: '12px 16px',
              color: '#b91c1c',
              background: '#fef2f2',
              borderBottom: '1px solid #fecaca',
              fontSize: '12px',
            }}
          >
            <strong>Error:</strong> {ordersError}
          </div>
        )}

        <table className="table">
          <thead>
            <tr>
              <th>PO</th>
              <th>Your Reference</th>
              <th>Created By</th>
              <th>Date</th>
              <th>Products</th>
              <th>Applied Cost Value</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Delivery</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loadingOrders ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: '36px', color: 'var(--muted)' }}>
                  Loading purchase orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: '36px', color: 'var(--muted)' }}>
                  No purchase orders found matching the selected filters.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const totalVal =
                  typeof order.total === 'number'
                    ? order.total
                    : parseFloat(order.total || '0') || 0;
                const slabSavingVal =
                  typeof order.slabSaving === 'number'
                    ? order.slabSaving
                    : parseFloat(order.slabSaving || '0') || 0;

                return (
                  <tr key={order.id}>
                    <td>
                      <span className="id-chip">{order.id}</span>
                    </td>
                    <td>{order.customerPoRef || '—'}</td>
                    <td>
                      {order.createdBy?.name || '—'}
                      {order.createdBy?.role && (
                        <span className="subtext">{order.createdBy.role}</span>
                      )}
                    </td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>{order.itemCount ?? '—'}</td>
                    <td>
                      <strong>
                        $
                        {totalVal.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </strong>
                      {slabSavingVal > 0 && (
                        <span className="subtext">
                          ${slabSavingVal.toFixed(2)} slab saving
                        </span>
                      )}
                    </td>
                    <td>
                      {order.payment?.term || 'Account'}
                      {order.payment?.method && (
                        <span className="subtext">{order.payment.method}</span>
                      )}
                    </td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>{formatDate(order.deliveryDate)}</td>
                    <td>
                      <Link
                        href={`/purchase-orders/${order.id}`}
                        className={`btn btn-sm ${
                          (order.status || '').toLowerCase().includes('submit')
                            ? 'btn-primary'
                            : ''
                        }`}
                      >
                        Open PO
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
