'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    document.cookie = "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push('/login');
  };

  return (
    <div className="app-wrapper">
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>

        <div className="brand">
          <div className="brand-mark"><svg viewBox="0 0 24 24" fill="none"><path d="M4 13c4-8 12-9 16-7-1 7-5 12-12 13-2-1-3-3-4-6Z" /><path d="M8 16c2-4 5-7 10-9" /></svg></div>
          <div className="brand-name">eFresh<small>B2B CUSTOMER PORTAL</small></div>
        </div>
        <div className="account-mini"><div className="a-label">Customer Account</div><strong>Melbourne Fresh Foods</strong><span>B2B-10428 · 14 day terms</span></div>
        <nav className="nav">
          <div className="nav-label">Overview</div>
          <Link href="/" className={"nav-item" + (pathname === "/" ? " active" : "")}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>Dashboard</Link>
          <div className="nav-label">Ordering</div>
          <Link href="/products" className={"nav-item" + (pathname === "/products" ? " active" : "")}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 6h18M5 6l1 14h12l1-14M9 10v6M15 10v6" /></svg>Order Products</Link>
          <Link href="/cart" className={"nav-item" + (pathname === "/cart" ? " active" : "")}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 4h2l2 12h10l2-8H6" /><circle cx="9" cy="20" r="1" /><circle cx="17" cy="20" r="1" /></svg>Cart & Create PO <span className="nav-count" id="sideCartCount">0</span></Link>
          <Link href="/purchase-orders" className={"nav-item" + (pathname === "/purchase-orders" ? " active" : "")}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 3h9l3 3v15H6z" /><path d="M9 11h6M9 15h6M9 7h3" /></svg>Purchase Orders <span className="nav-count">6</span></Link>

          <div className="nav-label">Deliveries</div>
          <Link href="/deliveries" className={"nav-item" + (pathname === "/deliveries" ? " active" : "")}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z" /><circle cx="7" cy="19" r="2" /><circle cx="18" cy="19" r="2" /></svg>Track Deliveries <span className="nav-count">2</span></Link>
          <Link href="/receiving" className={"nav-item" + (pathname === "/receiving" ? " active" : "")}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 5h16v14H4zM8 9h8M8 13h5" /><path d="m16 16 2 2 4-5" /></svg>Receive Goods <span className="nav-count warn">1</span></Link>
          <div className="nav-label">Accounts</div>
          <Link href="/invoices" className={"nav-item" + (pathname === "/invoices" ? " active" : "")}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 3h14v18l-3-2-3 2-3-2-3 2-2-1z" /><path d="M8 8h8M8 12h8" /></svg>Invoices <span className="nav-count warn">2 overdue</span></Link>
          <Link href="/claims" className={"nav-item" + (pathname === "/claims" ? " active" : "")}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3v18M17 7H9.5a2.5 2.5 0 0 0 0 5H14a2.5 2.5 0 0 1 0 5H7" /></svg>Claims & Credits <span className="nav-count">2</span></Link>
          <div className="nav-label">Account</div>
          <Link href="/account" className={"nav-item" + (pathname === "/account" ? " active" : "")}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="8" r="4" /><path d="M4 21c1-5 4-7 8-7s7 2 8 7" /></svg>Account & Users</Link>
        </nav>
        <div className="sidebar-foot"><div className="side-avatar">AW</div><div><strong>Alex Wong</strong><small>Buyer · Brunswick Store</small></div></div>

      </div>
      <div
        className={`sidebar-backdrop ${sidebarOpen ? 'show' : ''}`}
        onClick={toggleSidebar}
      ></div>
      <div className="main-content">
        <header className="topbar">
          <div className="top-left">
            <button className="mobile-menu-btn" onClick={toggleSidebar}>☰</button>
            <div className="breadcrumb">Customer Portal / <strong id="crumb">Dashboard</strong></div>
          </div>
          <div className="top-actions">
            <div className="search-top"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg><input placeholder="Search products, PO, invoice, delivery..." /></div>
            <button className="icon-button" onClick={handleLogout} title="Logout" style={{ marginRight: '8px' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            </button>
            <button className="icon-button"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></svg><span className="notify-dot"></span></button>
            <div className="profile"><div className="avatar">AW</div><div><div className="profile-name">Alex Wong</div><div className="profile-role">Buyer · Melbourne Fresh Foods</div></div></div>
          </div>
        </header>
        <div className="content">{children}</div>
      </div>
    </div>
  );
}
