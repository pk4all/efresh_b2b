'use client';

import React, { use } from 'react';
import Link from 'next/link';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  // Using the mocked PO-10482 as design target
  return (
    <div className="page active" id="po-detail">
      <div className="page-head">
        <div className="title-wrap">
          <h1>{id}</h1>
          <p>Customer PO STORE-8841 &middot; Created 7 Aug 2026 by Alex Wong</p>
        </div>
        <div className="head-actions">
          <Link href="/purchase-orders" className="btn">&larr; Purchase Orders</Link>
          <button className="btn">Download PDF</button>
          <button className="btn btn-primary">Duplicate Order</button>
        </div>
      </div>
      
      <div className="metrics">
        <div className="metric blue">
          <div><div className="metric-label">PO Total</div><div className="metric-value">$1,482.60</div><div className="metric-sub">Including GST</div></div>
          <div className="metric-icon">$</div>
        </div>
        <div className="metric green">
          <div><div className="metric-label">Slab Savings</div><div className="metric-value">$92.80</div><div className="metric-sub">Against standard B2B price</div></div>
          <div className="metric-icon">&darr;</div>
        </div>
        <div className="metric violet">
          <div><div className="metric-label">Delivery</div><div className="metric-value">Today</div><div className="metric-sub">2:00&ndash;4:00 PM</div></div>
          <div className="metric-icon">&#128666;</div>
        </div>
        <div className="metric amber">
          <div><div className="metric-label">Invoice</div><div className="metric-value">Pending</div><div className="metric-sub">Issued after receipt</div></div>
          <div className="metric-icon">&#9723;</div>
        </div>
      </div>

      <div className="card" style={{marginBottom: '14px'}}>
        <div className="card-head">
          <div><h2>PO Status</h2><p>Supplier and delivery progression</p></div>
          <span className="status alloc">Confirmed</span>
        </div>
        <div className="timeline">
          <div className="tstep done"><b>Submitted</b>7 Aug 9:12</div>
          <div className="tstep done"><b>Confirmed</b>7 Aug 9:24</div>
          <div className="tstep done"><b>Packed</b>7 Aug 12:05</div>
          <div className="tstep current"><b>In Transit</b>ETA 2&ndash;4 PM</div>
          <div className="tstep"><b>Delivered</b>Pending</div>
          <div className="tstep"><b>Received</b>Pending</div>
        </div>
      </div>

      <div className="detail-grid">
        <div>
          <div className="card">
            <div className="card-head">
              <div><h2>Products &amp; Pricing Snapshot</h2><p>Applied cost prices are preserved from the submitted cart</p></div>
            </div>
            <div className="table-wrap">
              <table className="table" style={{minWidth: '900px'}}>
                <thead>
                  <tr><th>Product</th><th>Qty</th><th>Standard Cost</th><th>Applied Slab</th><th>Applied Cost Price</th><th>Saving</th><th>Line Total</th></tr>
                </thead>
                <tbody>
                  <tr><td className="primary-cell">Avocado Hass<span className="subtext">Tray 20 &middot; AVH20</span></td><td>10</td><td>$28.50</td><td><span className="status alloc">10+ trays</span></td><td><strong style={{color: 'var(--blue)'}}>$25.80</strong></td><td className="saving">$27.00</td><td><strong>$258.00</strong></td></tr>
                  <tr><td className="primary-cell">Banana Cavendish<span className="subtext">13kg carton &middot; BAN13</span></td><td>6</td><td>$34.00</td><td><span className="status alloc">6+ cartons</span></td><td><strong style={{color: 'var(--blue)'}}>$30.80</strong></td><td className="saving">$19.20</td><td><strong>$184.80</strong></td></tr>
                  <tr><td className="primary-cell">Strawberries 250g<span className="subtext">12 punnet tray &middot; STR12</span></td><td>8</td><td>$26.40</td><td><span className="status alloc">8+ trays</span></td><td><strong style={{color: 'var(--blue)'}}>$23.50</strong></td><td className="saving">$23.20</td><td><strong>$188.00</strong></td></tr>
                  <tr><td className="primary-cell">Royal Gala Apples<span className="subtext">12kg carton &middot; GAL12</span></td><td>6</td><td>$39.80</td><td><span className="status alloc">6+ cartons</span></td><td><strong style={{color: 'var(--blue)'}}>$35.60</strong></td><td className="saving">$25.20</td><td><strong>$213.60</strong></td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="card" style={{marginTop: '14px'}}>
            <div className="card-head"><h2>Delivery Information</h2></div>
            <div className="info-list">
              <div className="info-item"><label>Deliver To</label><b>Brunswick Store &middot; 248 Sydney Rd</b></div>
              <div className="info-item"><label>Requested Date</label><b>7 Aug 2026</b></div>
              <div className="info-item"><label>Receiving Contact</label><b>Jordan Mills &middot; 0412 555 221</b></div>
              <div className="info-item"><label>Window</label><b>2:00 PM &ndash; 4:00 PM</b></div>
              <div className="info-item"><label>Delivery ID</label><b>DEL-62018</b></div>
              <div className="info-item"><label>Notes</label><b>Call 15 mins before arrival</b></div>
            </div>
          </div>
        </div>
        <aside>
          <div className="card">
            <div className="card-head"><h2>Commercial Summary</h2></div>
            <div className="po-totals">
              <div className="sum-row"><span>Standard price value</span><b>$1,441.27</b></div>
              <div className="sum-row"><span>Slab savings</span><b className="saving">&minus;$92.80</b></div>
              <div className="sum-row"><span>Applied-cost subtotal</span><b>$1,348.47</b></div>
              <div className="sum-row"><span>GST</span><b>$134.85</b></div>
              <div className="sum-row total"><span>PO Total</span><span>$1,483.32</span></div>
            </div>
          </div>
          <div className="card" style={{marginTop: '14px'}}>
            <div className="card-head"><h2>Order Details</h2></div>
            <div className="info-list" style={{gridTemplateColumns: '1fr'}}>
              <div className="info-item"><label>Your Reference</label><b>STORE-8841</b></div>
              <div className="info-item"><label>Cost Centre</label><b>Brunswick Retail</b></div>
              <div className="info-item"><label>Created By</label><b>Alex Wong &middot; Buyer</b></div>
              <div className="info-item"><label>Supplier</label><b>eFresh Wholesale</b></div>
              <div className="info-item"><label>Payment</label><b>7 Day &middot; Direct Debit</b></div>
              <div className="info-item"><label>Payment Status</label><b>Scheduled for due date</b></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
