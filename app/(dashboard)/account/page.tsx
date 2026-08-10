'use client';

import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="page active" id="account">
      <div className="page-head">
        <div className="title-wrap">
          <h1>Account &amp; Users</h1>
          <p>Business profile, credit terms, delivery locations and user permissions.</p>
        </div>
        <div className="head-actions">
          <button className="btn">Edit Business</button>
          <button className="btn btn-primary">+ Add User</button>
        </div>
      </div>
      
      <div className="detail-grid">
        <div>
          <div className="card">
            <div className="card-head">
              <div>
                <h2>Business Account</h2>
                <p>B2B-10428</p>
              </div>
              <span className="status complete">Active</span>
            </div>
            <div className="info-list">
              <div className="info-item">
                <label>Business Name</label>
                <b>Melbourne Fresh Foods Pty Ltd</b>
              </div>
              <div className="info-item">
                <label>ABN</label>
                <b>72 608 441 920</b>
              </div>
              <div className="info-item">
                <label>Primary Contact</label>
                <b>Alex Wong</b>
              </div>
              <div className="info-item">
                <label>Accounts Email</label>
                <b>accounts@melbournefresh.example</b>
              </div>
              <div className="info-item">
                <label>Payment Terms</label>
                <b>Per PO &middot; 7 Day DD or On Order</b>
              </div>
              <div className="info-item">
                <label>Credit Limit</label>
                <b>$15,000</b>
              </div>
            </div>
          </div>
          
          <div className="section-head">
            <h2>Users &amp; Permissions</h2>
            <small>Every order and receipt records the acting user</small>
          </div>
          
          <div className="card table-wrap">
            <table className="table" style={{minWidth: '780px'}}>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Location</th>
                  <th>Ordering</th>
                  <th>Invoices</th>
                  <th>Receiving</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="primary-cell">Alex Wong<span className="subtext">alex.wong@example.com</span></td>
                  <td>Buyer</td>
                  <td>All</td>
                  <td>Full</td>
                  <td>View</td>
                  <td>View</td>
                  <td><span className="status complete">Active</span></td>
                  <td><button className="link-btn">Edit</button></td>
                </tr>
                <tr>
                  <td className="primary-cell">Jordan Mills<span className="subtext">jordan.mills@example.com</span></td>
                  <td>Receiver</td>
                  <td>Brunswick</td>
                  <td>View</td>
                  <td>None</td>
                  <td>Full</td>
                  <td><span className="status complete">Active</span></td>
                  <td><button className="link-btn">Edit</button></td>
                </tr>
                <tr>
                  <td className="primary-cell">Samantha Lee<span className="subtext">sam.lee@example.com</span></td>
                  <td>Accounts</td>
                  <td>All</td>
                  <td>View</td>
                  <td>Full</td>
                  <td>View</td>
                  <td><span className="status complete">Active</span></td>
                  <td><button className="link-btn">Edit</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <aside>
          <div className="card">
            <div className="card-head">
              <h2>Credit &amp; Terms</h2>
            </div>
            <div className="card-body">
              <div style={{fontSize: '9.5px', color: 'var(--muted)'}}>Credit used</div>
              <div style={{fontSize: '22px', fontWeight: 760, marginTop: '3px'}}>$5,440 / $15,000</div>
              <div className="credit-meter"><span></span></div>
              <div className="info-list" style={{gridTemplateColumns: '1fr', marginTop: '10px'}}>
                <div className="info-item">
                  <label>Available Credit</label>
                  <b>$9,560</b>
                </div>
                <div className="info-item">
                  <label>Payment Terms</label>
                  <b>7 Day DD / On Order</b>
                </div>
                <div className="info-item">
                  <label>Pricing Group</label>
                  <b>Wholesale &middot; Contract A</b>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card" style={{marginTop: '14px'}}>
            <div className="card-head">
              <h2>Delivery Locations</h2>
            </div>
            <div className="info-list" style={{gridTemplateColumns: '1fr'}}>
              <div className="info-item">
                <label>Primary</label>
                <b>Brunswick Store &middot; 248 Sydney Rd</b>
              </div>
              <div className="info-item">
                <label>Secondary</label>
                <b>Richmond Store &middot; 310 Swan St</b>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
