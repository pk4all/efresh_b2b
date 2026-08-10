'use client';

import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="page active" id="purchase-orders">
      <div className="page-head">
        <div className="title-wrap">
          <h1>Purchase Orders</h1>
          <p>All B2B orders created through the portal, including pricing snapshots and delivery status.</p>
        </div>
        <div className="head-actions">
          <Link href="/products" className="btn btn-primary">+ New Order</Link>
        </div>
      </div>
      
      <div className="metrics">
        <div className="metric blue">
          <div><div className="metric-label">Open POs</div><div className="metric-value">6</div><div className="metric-sub">$8,420 total value</div></div>
          <div className="metric-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3h9l3 3v15H6z"/><path d="M9 10h6M9 14h6"/></svg></div>
        </div>
        <div className="metric amber">
          <div><div className="metric-label">Awaiting Confirmation</div><div className="metric-value">1</div><div className="metric-sub">PO-10488</div></div>
          <div className="metric-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg></div>
        </div>
        <div className="metric violet">
          <div><div className="metric-label">In Delivery</div><div className="metric-value">2</div><div className="metric-sub">1 arriving today</div></div>
          <div className="metric-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z"/><circle cx="7" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></svg></div>
        </div>
        <div className="metric green">
          <div><div className="metric-label">Completed This Month</div><div className="metric-value">18</div><div className="metric-sub">$21,760 purchased</div></div>
          <div className="metric-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 12 5 5L20 7"/></svg></div>
        </div>
      </div>

      <div className="toolbar">
        <input className="field-inline search-inline" placeholder="Search PO or your reference" />
        <select className="field-inline" defaultValue="All Statuses">
          <option>All Statuses</option>
          <option>Submitted</option>
          <option>Confirmed</option>
          <option>In Transit</option>
          <option>Completed</option>
        </select>
        <select className="field-inline" defaultValue="All Locations">
          <option>All Locations</option>
          <option>Brunswick Store</option>
          <option>Richmond Store</option>
        </select>
      </div>

      <div className="card table-wrap">
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
            <tr>
              <td><span className="id-chip">PO-10488</span></td>
              <td>STORE-8847</td>
              <td>Alex Wong<span className="subtext">Buyer</span></td>
              <td>7 Aug</td>
              <td>8</td>
              <td><strong>$1,105.80</strong><span className="subtext">$64.20 slab saving</span></td>
              <td>On Order<span className="subtext">Split &middot; 2 payments</span></td>
              <td><span className="status pending">Submitted</span></td>
              <td>8 Aug</td>
              <td><Link href="/purchase-orders/PO-10488" className="btn btn-sm btn-primary">Open PO</Link></td>
            </tr>
            <tr>
              <td><span className="id-chip">PO-10482</span></td>
              <td>STORE-8841</td>
              <td>Alex Wong<span className="subtext">Buyer</span></td>
              <td>7 Aug</td>
              <td>14</td>
              <td><strong>$1,482.60</strong><span className="subtext">$92.80 slab saving</span></td>
              <td>7 Day<span className="subtext">Direct Debit</span></td>
              <td><span className="status alloc">Confirmed</span></td>
              <td>Today</td>
              <td><Link href="/purchase-orders/PO-10482" className="btn btn-sm">Open PO</Link></td>
            </tr>
            <tr>
              <td><span className="id-chip">PO-10476</span></td>
              <td>STORE-8834</td>
              <td>Alex Wong</td>
              <td>5 Aug</td>
              <td>9</td>
              <td><strong>$786.10</strong><span className="subtext">$41.50 slab saving</span></td>
              <td>On Order<span className="subtext">Visa &middot;&middot;&middot;&middot; 4242</span></td>
              <td><span className="status delivery">In Transit</span></td>
              <td>Today</td>
              <td><Link href="/purchase-orders/PO-10476" className="btn btn-sm">Open PO</Link></td>
            </tr>
            <tr>
              <td><span className="id-chip">PO-10463</span></td>
              <td>STORE-8819</td>
              <td>Samantha Lee</td>
              <td>1 Aug</td>
              <td>22</td>
              <td><strong>$2,134.30</strong><span className="subtext">$176.20 slab saving</span></td>
              <td>7 Day<span className="subtext">Direct Debit</span></td>
              <td><span className="status complete">Completed</span></td>
              <td>4 Aug</td>
              <td><Link href="/purchase-orders/PO-10463" className="btn btn-sm">Open PO</Link></td>
            </tr>
            <tr>
              <td><span className="id-chip">PO-10421</span></td>
              <td>STORE-8784</td>
              <td>Alex Wong</td>
              <td>24 Jul</td>
              <td>11</td>
              <td><strong>$918.45</strong><span className="subtext">$52.10 slab saving</span></td>
              <td>On Order<span className="subtext">Account Credit</span></td>
              <td><span className="status complete">Completed</span></td>
              <td>26 Jul</td>
              <td><Link href="/purchase-orders/PO-10421" className="btn btn-sm">Open PO</Link></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
