'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleCreatePo = () => {
    router.push('/purchase-orders/PO-10482');
  };

  return (
    <>
      <div className="page active" id="cart">
        <div className="page-head">
          <div className="title-wrap">
            <h1>Cart &amp; Create Purchase Order</h1>
            <p>Review quantities, applied cost prices, slab savings and delivery details before submitting your PO.</p>
          </div>
          <div className="head-actions">
            <Link href="/products" className="btn">&minus; Continue Ordering</Link>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>Create Purchase Order</button>
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
                <span className="status alloc" id="cartTierStatus">Slab Pricing Applied</span>
              </div>
              <div className="table-wrap">
                <table className="table" style={{minWidth: '1000px'}}>
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
                    <tr>
                      <td>
                        <div className="prod-name">Avocado Hass</div>
                        <div className="subtext">AVH20 &middot; Tray 20</div>
                      </td>
                      <td>
                        <div className="qty-box">
                          <button type="button">&minus;</button>
                          <input type="text" readOnly value="25" />
                          <button type="button">+</button>
                        </div>
                      </td>
                      <td>$28.50</td>
                      <td><span className="status alloc" style={{fontSize: '9px', padding: '3px 6px'}}>10+ Tray 20</span></td>
                      <td>
                        <strong>$25.80</strong>
                        <div className="subtext" style={{marginTop: '2px'}}>Applied cost / Tray 20</div>
                      </td>
                      <td style={{color: 'var(--green)', fontWeight: 700}}>$2.70</td>
                      <td><strong>$645.00</strong></td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="card" style={{marginTop: '14px'}}>
              <div className="card-head">
                <div>
                  <h2>Delivery &amp; PO Details</h2>
                  <p>These details travel with the PO</p>
                </div>
              </div>
              <div className="card-body">
                <div className="form-grid">
                  <div className="form-field">
                    <label>Your PO / Internal Reference</label>
                    <input defaultValue="STORE-8848" />
                  </div>
                  <div className="form-field">
                    <label>Cost Centre</label>
                    <select defaultValue="Brunswick Retail">
                      <option>Brunswick Retail</option>
                      <option>Richmond Retail</option>
                      <option>Central Warehouse</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Deliver To</label>
                    <select defaultValue="Brunswick Store · 248 Sydney Rd">
                      <option>Brunswick Store &middot; 248 Sydney Rd</option>
                      <option>Richmond Store &middot; 310 Swan St</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Requested Delivery Date</label>
                    <input type="date" defaultValue="2026-08-08" />
                  </div>
                  <div className="form-field">
                    <label>Receiving Contact</label>
                    <select defaultValue="Jordan Mills · 0412 555 221">
                      <option>Jordan Mills &middot; 0412 555 221</option>
                      <option>Samantha Lee &middot; 0412 555 483</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Preferred Window</label>
                    <select defaultValue="8:00 AM - 10:00 AM">
                      <option>8:00 AM - 10:00 AM</option>
                      <option>10:00 AM - 12:00 PM</option>
                      <option>2:00 PM - 4:00 PM</option>
                    </select>
                  </div>
                  <div className="form-field full">
                    <label>Order Notes</label>
                    <textarea placeholder="Delivery instructions, substitutions, quality requirements..." defaultValue="Please call 15 minutes before arrival. Deliver to rear receiving entrance."></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{marginTop: '14px'}} id="paymentCard">
              <div className="card-head">
                <div>
                  <h2>Payment Option</h2>
                  <p>Select how this purchase order will be paid</p>
                </div>
                <span className="status alloc" id="paymentTermBadge">7 Day &middot; Direct Debit</span>
              </div>
              <div className="card-body">
                <div className="payment-options">
                  <div className="payment-option active" data-payment-term="7day">
                    <div className="payment-radio"></div>
                    <div>
                      <strong>7 Day &middot; Direct Debit</strong>
                      <span>Order on account. The invoice balance is automatically collected by Direct Debit on the 7-day due date.</span>
                      <span className="pay-badge">Saved account &middot; **** 4821</span>
                    </div>
                  </div>
                  <div className="payment-option" data-payment-term="onorder">
                    <div className="payment-radio"></div>
                    <div>
                      <strong>On Order</strong>
                      <span>Pay when the PO is submitted. Use one payment method or split the order total across multiple payments.</span>
                      <span className="pay-badge">Immediate payment</span>
                    </div>
                  </div>
                </div>
                <div className="payment-panel" id="sevenDayPanel">
                  <div className="payment-summary-line"><span>Payment term</span><b>7 days from invoice</b></div>
                  <div className="payment-summary-line"><span>Method</span><b>Direct Debit &middot; **** 4821</b></div>
                  <div className="payment-summary-line"><span>Collection</span><b>Automatic on due date</b></div>
                </div>
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
                <div className="sum-row"><span>Products</span><b>1</b></div>
                <div className="sum-row"><span>Total Units / Packs</span><b>25</b></div>
                <div className="sum-row"><span>Standard-price value</span><b>$712.50</b></div>
                <div className="sum-row"><span>Slab savings</span><b className="saving">&minus;$67.50</b></div>
                <div className="sum-row"><span>Applied-cost subtotal</span><b>$645.00</b></div>
                <div className="sum-row"><span>GST</span><b>$64.50</b></div>
                <div className="sum-row total"><span>PO Total</span><span>$709.50</span></div>
                <div className="payment-summary-line" style={{marginTop: '8px'}}><span>Payment</span><b>7 Day &middot; Direct Debit</b></div>
                <div className="callout green" style={{marginTop: '10px'}}><strong>Pricing snapshot:</strong> each line will save the exact applied slab and cost price used at the moment the PO is submitted.</div>
                <button className="btn btn-primary" style={{width: '100%', marginTop: '10px'}} onClick={() => setShowModal(true)}>Create &amp; Submit PO</button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className={`modal-backdrop ${showModal ? 'show' : ''}`} style={showModal ? {display: 'flex'} : {display: 'none'}}>
        <div className="modal">
          <div className="modal-head">
            <div>
              <h3>Confirm Purchase Order</h3>
              <div className="subtext">Final server-side pricing check</div>
            </div>
            <button className="close" onClick={() => setShowModal(false)}>&times;</button>
          </div>
          <div className="modal-body">
            <div className="callout green"><strong>All prices verified.</strong> The applied slab and cost price shown in your cart match the latest pricing for this account.</div>
            <div className="card" style={{marginTop: '12px', boxShadow: 'none'}}>
              <div className="po-totals">
                <div className="sum-row"><span>Products</span><b>1</b></div>
                <div className="sum-row"><span>Applied-cost subtotal</span><b>$645.00</b></div>
                <div className="sum-row"><span>Slab savings</span><b className="saving">&minus;$67.50</b></div>
                <div className="sum-row"><span>Payment</span><b>7 Day &middot; Direct Debit</b></div>
                <div className="sum-row total"><span>PO Total</span><span>$709.50</span></div>
              </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '14px'}}>
              <button className="btn" onClick={() => setShowModal(false)}>Back</button>
              <button className="btn btn-primary" onClick={handleCreatePo}>Create &amp; Submit PO</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
