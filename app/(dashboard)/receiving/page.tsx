'use client';

import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="page active" id="receiving">
      <div className="page-head">
        <div className="title-wrap">
          <h1>Receive Goods</h1>
          <p>Purchase orders and deliveries that are due to be received. Open an order to check each product and report any issue.</p>
        </div>
        <div className="head-actions">
          <button className="btn">Scan Delivery / PO</button>
          <button className="btn">Receiving History</button>
        </div>
      </div>

      <div className="metrics">
        <div className="metric amber">
          <div><div className="metric-label">Ready to Receive</div><div className="metric-value">3</div><div className="metric-sub">Delivered / awaiting check</div></div>
          <div className="metric-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
        </div>
        <div className="metric violet">
          <div><div className="metric-label">Arriving Today</div><div className="metric-value">2</div><div className="metric-sub">Can be received on arrival</div></div>
          <div className="metric-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z"/><circle cx="7" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></svg></div>
        </div>
        <div className="metric blue">
          <div><div className="metric-label">Partially Received</div><div className="metric-value">1</div><div className="metric-sub">Continue remaining products</div></div>
          <div className="metric-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
        </div>
        <div className="metric green">
          <div><div className="metric-label">Received Today</div><div className="metric-value">4</div><div className="metric-sub">1 receipt had a claim</div></div>
          <div className="metric-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 12 5 5L20 7"/></svg></div>
        </div>
      </div>

      <div className="toolbar">
        <input className="field-inline search-inline" placeholder="Search PO, delivery or location" />
        <select className="field-inline" defaultValue="All Due to Receive">
          <option>All Due to Receive</option>
          <option>Ready to Receive</option>
          <option>Partially Received</option>
          <option>Arriving Today</option>
        </select>
        <select className="field-inline" defaultValue="All Locations">
          <option>All Locations</option>
          <option>Brunswick Store</option>
          <option>Richmond Store</option>
          <option>North Melbourne Warehouse</option>
        </select>
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <h2>POs Due for Receiving</h2>
            <p>Newest / most urgent deliveries appear first</p>
          </div>
          <span className="status pending">5 orders</span>
        </div>
        <div className="table-wrap">
          <table className="table" style={{minWidth: '1120px'}}>
            <thead>
              <tr>
                <th>PO / Delivery</th>
                <th>Supplier</th>
                <th>Location</th>
                <th>Due / Delivered</th>
                <th>Products</th>
                <th>Expected Qty</th>
                <th>Delivery Status</th>
                <th>Receiving Status</th>
                <th>Priority</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="primary-cell">PO-10476<span className="subtext">DEL-62018</span></td>
                <td><strong>eFresh Wholesale</strong></td>
                <td>Brunswick Store</td>
                <td><strong>Delivered today &middot; 3:06 PM</strong></td>
                <td>4 products</td>
                <td>31 cartons / packs</td>
                <td><span className="status alloc">Delivered</span></td>
                <td><span className="status alloc">Ready to Receive</span></td>
                <td><span className="status pending">High</span></td>
                <td><Link href="/receiving/DEL-62018" className="btn btn-sm btn-primary">Receive Goods</Link></td>
              </tr>
              <tr>
                <td className="primary-cell">PO-10482<span className="subtext">DEL-62026</span></td>
                <td><strong>eFresh Wholesale</strong></td>
                <td>Brunswick Store</td>
                <td><strong>Today &middot; ETA 5:00-6:00 PM</strong></td>
                <td>5 products</td>
                <td>48 cartons / packs</td>
                <td><span className="status delivery">Out for Delivery</span></td>
                <td><span className="status delivery">Arriving Today</span></td>
                <td><span className="status complete">Normal</span></td>
                <td><button className="btn btn-sm">Open / Prepare</button></td>
              </tr>
              <tr>
                <td className="primary-cell">PO-10471<span className="subtext">DEL-62012</span></td>
                <td><strong>eFresh Wholesale</strong></td>
                <td>Richmond Store</td>
                <td><strong>Delivered today &middot; 12:18 PM</strong></td>
                <td>6 products</td>
                <td>42 cartons / packs</td>
                <td><span className="status alloc">Delivered</span></td>
                <td><span className="status alloc">Ready to Receive</span></td>
                <td><span className="status pending">High</span></td>
                <td><Link href="/receiving/DEL-62012" className="btn btn-sm btn-primary">Receive Goods</Link></td>
              </tr>
              <tr>
                <td className="primary-cell">PO-10468<span className="subtext">DEL-62009</span></td>
                <td><strong>eFresh Wholesale</strong></td>
                <td>North Melbourne Warehouse</td>
                <td><strong>Delivered today &middot; 10:44 AM</strong></td>
                <td>5 products</td>
                <td>37 cartons / packs</td>
                <td><span className="status packing">Delivered</span></td>
                <td><span className="status packing">Partially Received</span></td>
                <td><span className="status packing">Continue</span></td>
                <td><button className="btn btn-sm">Continue Receiving</button></td>
              </tr>
              <tr>
                <td className="primary-cell">PO-10491<span className="subtext">DEL-62031</span></td>
                <td><strong>eFresh Wholesale</strong></td>
                <td>Richmond Store</td>
                <td><strong>Today &middot; ETA 6:00-7:00 PM</strong></td>
                <td>4 products</td>
                <td>26 cartons / packs</td>
                <td><span className="status delivery">In Transit</span></td>
                <td><span className="status delivery">Arriving Today</span></td>
                <td><span className="status complete">Normal</span></td>
                <td><button className="btn btn-sm">Open / Prepare</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="callout" style={{marginTop: '14px'}}>
        <strong>Receiving workflow:</strong> select a PO &rarr; review delivery details &rarr; mark each product <strong>Received</strong> or <strong>Receive &amp; Report</strong> &rarr; complete the GRN.
      </div>
    </div>
  );
}
