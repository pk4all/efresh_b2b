'use client';

import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="page active" id="claim-detail">
      
  <div className="page-head"><Link href="/claims" className="back-btn"  data-bound="1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m15 18-6-6 6-6"></path></svg></Link><div className="title-wrap"><h1>CLM-3102</h1><p>Created automatically from GRN-22041</p></div></div>
  <div className="card list-card"><div className="list-top"><div><div className="list-title">Strawberries 250g</div><div className="list-sub">12 punnet tray</div></div><span className="status s-red">Reported</span></div><div className="meta-grid"><div className="meta-item"><label>Damaged</label><b>1 × $24.30</b></div><div className="meta-item"><label>Spoiled</label><b>1 × $24.30</b></div></div><div className="detail-row"><span>Total Claim</span><b>$48.60</b></div></div>
  <div className="card detail-section"><div className="section-title">Evidence</div><div className="detail-body"><div className="detail-row"><span>Photos</span><b>2 attached</b></div><div className="detail-row"><span>Receiver Note</span><b>Visible crushing and spoilage</b></div><div className="detail-row"><span>Supplier Response Due</span><b>8 Aug · 5:00 PM</b></div></div></div>
  <div className="alert warn"><div><strong>Credit pending</strong><span>The invoice balance will only reduce after the supplier approves and issues a credit note.</span></div></div>

    </div>
  );
}
