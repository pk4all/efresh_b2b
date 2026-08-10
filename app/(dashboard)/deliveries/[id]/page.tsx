'use client';

import React, { use } from 'react';
import Link from 'next/link';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="page active" id="delivery-detail">
      <div className="page-head">
        <div className="title-wrap">
          <h1>{id}</h1>
          <p>PO-10476 &middot; Brunswick Store &middot; Expected today</p>
        </div>
        <div className="head-actions">
          <Link href="/deliveries" className="btn">&larr; Deliveries</Link>
          <button className="btn btn-primary" id="deliveryReceiveBtn">Receive Delivery</button>
        </div>
      </div>
      
      <div className="card" style={{marginBottom: '14px'}}>
        <div className="card-head">
          <div>
            <h2>Delivery Progress</h2>
            <p>Last update 1:38 PM</p>
          </div>
          <span className="status delivery">In Transit</span>
        </div>
        <div className="timeline">
          <div className="tstep done"><b>PO Confirmed</b>5 Aug</div>
          <div className="tstep done"><b>Packed</b>7 Aug 11:24</div>
          <div className="tstep done"><b>Dispatched</b>7 Aug 1:12</div>
          <div className="tstep current"><b>In Transit</b>Now</div>
          <div className="tstep"><b>Delivered</b>ETA 2-4 PM</div>
          <div className="tstep"><b>Received</b>Pending</div>
        </div>
      </div>
      
      <div className="detail-grid">
        <div className="card">
          <div className="card-head">
            <div>
              <h2>Delivery Contents</h2>
              <p>What the supplier says is being dispatched</p>
            </div>
          </div>
          <div className="table-wrap">
            <table className="table" style={{minWidth: '760px'}}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>PO Qty</th>
                  <th>Dispatched</th>
                  <th>Supply Unit</th>
                  <th>Applied Cost Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="primary-cell">Avocado Hass<span className="subtext">AVH20</span></td>
                  <td>5</td>
                  <td>5</td>
                  <td>Tray 20</td>
                  <td>$27.20</td>
                  <td><span className="status complete">Full</span></td>
                </tr>
                <tr>
                  <td className="primary-cell">Strawberries 250g</td>
                  <td>12</td>
                  <td>12</td>
                  <td>12 punnet tray</td>
                  <td>$23.50</td>
                  <td><span className="status complete">Full</span></td>
                </tr>
                <tr>
                  <td className="primary-cell">Baby Spinach</td>
                  <td>8</td>
                  <td>8</td>
                  <td>1kg bag</td>
                  <td>$11.90</td>
                  <td><span className="status complete">Full</span></td>
                </tr>
                <tr>
                  <td className="primary-cell">Cos Lettuce</td>
                  <td>6</td>
                  <td>6</td>
                  <td>Carton 12</td>
                  <td>$24.40</td>
                  <td><span className="status complete">Full</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <aside>
          <div className="card">
            <div className="card-head">
              <h2>Delivery Information</h2>
            </div>
            <div className="info-list" style={{gridTemplateColumns: '1fr'}}>
              <div className="info-item">
                <label>ETA</label>
                <b>Today &middot; 2:00-4:00 PM</b>
              </div>
              <div className="info-item">
                <label>Driver</label>
                <b>Marcus &middot; Van 12</b>
              </div>
              <div className="info-item">
                <label>Run</label>
                <b>R-408 &middot; Stop 7 of 11</b>
              </div>
              <div className="info-item">
                <label>Deliver To</label>
                <b>248 Sydney Rd, Brunswick</b>
              </div>
              <div className="info-item">
                <label>Receiving Contact</label>
                <b>Jordan Mills &middot; 0412 555 221</b>
              </div>
            </div>
          </div>
          <div className="callout" style={{marginTop: '14px'}}>
            Once the driver marks this delivery as delivered, the <strong>Receive Goods</strong> action remains available for your receiver to verify every line.
          </div>
        </aside>
      </div>
    </div>
  );
}
