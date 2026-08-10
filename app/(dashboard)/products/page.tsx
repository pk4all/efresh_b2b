'use client';

import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="page active" id="products">
      <div className="page-head">
        <div className="title-wrap">
          <h1>Order Products</h1>
          <p>Browse your approved B2B catalogue. Slab pricing applies automatically based on quantity.</p>
        </div>
        <div className="head-actions">
          <button className="btn">My Favourites</button>
          <Link href="/cart" className="btn btn-primary">View Cart <span>0</span></Link>
        </div>
      </div>
      
      <div className="toolbar">
        <input className="field-inline search-inline" placeholder="Search products or product code" />
        <select className="field-inline">
          <option>All Categories</option>
          <option>Fruit</option>
          <option>Vegetables</option>
          <option>Herbs</option>
        </select>
        <select className="field-inline">
          <option>All Products</option>
          <option>Previously Ordered</option>
          <option>Favourites</option>
          <option>Specials</option>
        </select>
        <select className="field-inline">
          <option>Brunswick Store</option>
          <option>Richmond Store</option>
        </select>
      </div>
      
      <div className="order-grid">
        <div className="card catalog-card">
          <div className="card-head">
            <div>
              <h2>Product Catalogue</h2>
              <p><span>20</span> products available for this account</p>
            </div>
            <span className="status alloc">Contract Pricing Active</span>
          </div>
          <div id="catalogRows">
            
        <div className="product-row">
            <div className="prod-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{width: "20px"}}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg></div>
            <div>
                <div className="prod-name">Avocado Hass</div>
                <div className="prod-meta">AVH20 &middot; Fruit &middot; Tray 20</div>
            </div>
            <div className="tier-strip"><div className="tier-chip">1–4 &middot; <strong>$28.50</strong></div><div className="tier-chip">5–9 &middot; <strong>$27.20</strong></div><div className="tier-chip">10+ &middot; <strong>$25.80</strong></div></div>
            <div className="qty-box">
                <button type="button">-</button>
                <input readOnly value="0" />
                <button type="button">+</button>
            </div>
            <div className="prod-price">
                <strong>$28.50</strong>
                <small>starting cost</small>
            </div>
        </div>
        <div className="product-row">
            <div className="prod-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{width: "20px"}}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg></div>
            <div>
                <div className="prod-name">Banana Cavendish</div>
                <div className="prod-meta">BAN13 &middot; Fruit &middot; 13kg carton</div>
            </div>
            <div className="tier-strip"><div className="tier-chip">1–2 &middot; <strong>$34.00</strong></div><div className="tier-chip">3–5 &middot; <strong>$32.50</strong></div><div className="tier-chip">6+ &middot; <strong>$30.80</strong></div></div>
            <div className="qty-box">
                <button type="button">-</button>
                <input readOnly value="0" />
                <button type="button">+</button>
            </div>
            <div className="prod-price">
                <strong>$34.00</strong>
                <small>starting cost</small>
            </div>
        </div>
        <div className="product-row">
            <div className="prod-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{width: "20px"}}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg></div>
            <div>
                <div className="prod-name">Strawberries 250g</div>
                <div className="prod-meta">STR12 &middot; Fruit &middot; 12 punnet tray</div>
            </div>
            <div className="tier-strip"><div className="tier-chip">1–3 &middot; <strong>$26.40</strong></div><div className="tier-chip">4–7 &middot; <strong>$24.80</strong></div><div className="tier-chip">8+ &middot; <strong>$23.50</strong></div></div>
            <div className="qty-box">
                <button type="button">-</button>
                <input readOnly value="0" />
                <button type="button">+</button>
            </div>
            <div className="prod-price">
                <strong>$26.40</strong>
                <small>starting cost</small>
            </div>
        </div>
        <div className="product-row">
            <div className="prod-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{width: "20px"}}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg></div>
            <div>
                <div className="prod-name">Blueberries 125g</div>
                <div className="prod-meta">BLU12 &middot; Fruit &middot; 12 punnet tray</div>
            </div>
            <div className="tier-strip"><div className="tier-chip">1–3 &middot; <strong>$35.50</strong></div><div className="tier-chip">4–7 &middot; <strong>$33.80</strong></div><div className="tier-chip">8+ &middot; <strong>$31.90</strong></div></div>
            <div className="qty-box">
                <button type="button">-</button>
                <input readOnly value="0" />
                <button type="button">+</button>
            </div>
            <div className="prod-price">
                <strong>$35.50</strong>
                <small>starting cost</small>
            </div>
        </div>
        <div className="product-row">
            <div className="prod-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{width: "20px"}}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg></div>
            <div>
                <div className="prod-name">Royal Gala Apples</div>
                <div className="prod-meta">GAL12 &middot; Fruit &middot; 12kg carton</div>
            </div>
            <div className="tier-strip"><div className="tier-chip">1–2 &middot; <strong>$39.80</strong></div><div className="tier-chip">3–5 &middot; <strong>$37.90</strong></div><div className="tier-chip">6+ &middot; <strong>$35.60</strong></div></div>
            <div className="qty-box">
                <button type="button">-</button>
                <input readOnly value="0" />
                <button type="button">+</button>
            </div>
            <div className="prod-price">
                <strong>$39.80</strong>
                <small>starting cost</small>
            </div>
        </div>
        <div className="product-row">
            <div className="prod-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{width: "20px"}}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg></div>
            <div>
                <div className="prod-name">Green Apples</div>
                <div className="prod-meta">GRN12 &middot; Fruit &middot; 12kg carton</div>
            </div>
            <div className="tier-strip"><div className="tier-chip">1–2 &middot; <strong>$41.00</strong></div><div className="tier-chip">3–5 &middot; <strong>$39.20</strong></div><div className="tier-chip">6+ &middot; <strong>$36.90</strong></div></div>
            <div className="qty-box">
                <button type="button">-</button>
                <input readOnly value="0" />
                <button type="button">+</button>
            </div>
            <div className="prod-price">
                <strong>$41.00</strong>
                <small>starting cost</small>
            </div>
        </div>
        <div className="product-row">
            <div className="prod-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{width: "20px"}}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg></div>
            <div>
                <div className="prod-name">Navel Oranges</div>
                <div className="prod-meta">ORG15 &middot; Fruit &middot; 15kg carton</div>
            </div>
            <div className="tier-strip"><div className="tier-chip">1–2 &middot; <strong>$32.00</strong></div><div className="tier-chip">3–5 &middot; <strong>$30.50</strong></div><div className="tier-chip">6+ &middot; <strong>$28.80</strong></div></div>
            <div className="qty-box">
                <button type="button">-</button>
                <input readOnly value="0" />
                <button type="button">+</button>
            </div>
            <div className="prod-price">
                <strong>$32.00</strong>
                <small>starting cost</small>
            </div>
        </div>
        <div className="product-row">
            <div className="prod-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{width: "20px"}}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg></div>
            <div>
                <div className="prod-name">Lemons</div>
                <div className="prod-meta">LEM15 &middot; Fruit &middot; 15kg carton</div>
            </div>
            <div className="tier-strip"><div className="tier-chip">1–2 &middot; <strong>$44.00</strong></div><div className="tier-chip">3–5 &middot; <strong>$42.00</strong></div><div className="tier-chip">6+ &middot; <strong>$39.50</strong></div></div>
            <div className="qty-box">
                <button type="button">-</button>
                <input readOnly value="0" />
                <button type="button">+</button>
            </div>
            <div className="prod-price">
                <strong>$44.00</strong>
                <small>starting cost</small>
            </div>
        </div>
        <div className="product-row">
            <div className="prod-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{width: "20px"}}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg></div>
            <div>
                <div className="prod-name">Watermelon</div>
                <div className="prod-meta">WAT01 &middot; Fruit &middot; Each</div>
            </div>
            <div className="tier-strip"><div className="tier-chip">1–4 &middot; <strong>$7.80</strong></div><div className="tier-chip">5–9 &middot; <strong>$7.20</strong></div><div className="tier-chip">10+ &middot; <strong>$6.70</strong></div></div>
            <div className="qty-box">
                <button type="button">-</button>
                <input readOnly value="0" />
                <button type="button">+</button>
            </div>
            <div className="prod-price">
                <strong>$7.80</strong>
                <small>starting cost</small>
            </div>
        </div>
        <div className="product-row">
            <div className="prod-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{width: "20px"}}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg></div>
            <div>
                <div className="prod-name">Rockmelon</div>
                <div className="prod-meta">ROC01 &middot; Fruit &middot; Each</div>
            </div>
            <div className="tier-strip"><div className="tier-chip">1–4 &middot; <strong>$5.60</strong></div><div className="tier-chip">5–9 &middot; <strong>$5.10</strong></div><div className="tier-chip">10+ &middot; <strong>$4.70</strong></div></div>
            <div className="qty-box">
                <button type="button">-</button>
                <input readOnly value="0" />
                <button type="button">+</button>
            </div>
            <div className="prod-price">
                <strong>$5.60</strong>
                <small>starting cost</small>
            </div>
        </div>
        <div className="product-row">
            <div className="prod-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{width: "20px"}}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg></div>
            <div>
                <div className="prod-name">Tomatoes Truss</div>
                <div className="prod-meta">TOM05 &middot; Vegetables &middot; 5kg carton</div>
            </div>
            <div className="tier-strip"><div className="tier-chip">1–2 &middot; <strong>$29.00</strong></div><div className="tier-chip">3–5 &middot; <strong>$27.50</strong></div><div className="tier-chip">6+ &middot; <strong>$25.90</strong></div></div>
            <div className="qty-box">
                <button type="button">-</button>
                <input readOnly value="0" />
                <button type="button">+</button>
            </div>
            <div className="prod-price">
                <strong>$29.00</strong>
                <small>starting cost</small>
            </div>
        </div>
        <div className="product-row">
            <div className="prod-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{width: "20px"}}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg></div>
            <div>
                <div className="prod-name">Carrots</div>
                <div className="prod-meta">CAR10 &middot; Vegetables &middot; 10kg bag</div>
            </div>
            <div className="tier-strip"><div className="tier-chip">1–2 &middot; <strong>$18.80</strong></div><div className="tier-chip">3–5 &middot; <strong>$17.60</strong></div><div className="tier-chip">6+ &middot; <strong>$16.40</strong></div></div>
            <div className="qty-box">
                <button type="button">-</button>
                <input readOnly value="0" />
                <button type="button">+</button>
            </div>
            <div className="prod-price">
                <strong>$18.80</strong>
                <small>starting cost</small>
            </div>
        </div>
        <div className="product-row">
            <div className="prod-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{width: "20px"}}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg></div>
            <div>
                <div className="prod-name">Broccoli</div>
                <div className="prod-meta">BRO08 &middot; Vegetables &middot; 8kg carton</div>
            </div>
            <div className="tier-strip"><div className="tier-chip">1–2 &middot; <strong>$31.00</strong></div><div className="tier-chip">3–5 &middot; <strong>$29.20</strong></div><div className="tier-chip">6+ &middot; <strong>$27.50</strong></div></div>
            <div className="qty-box">
                <button type="button">-</button>
                <input readOnly value="0" />
                <button type="button">+</button>
            </div>
            <div className="prod-price">
                <strong>$31.00</strong>
                <small>starting cost</small>
            </div>
        </div>
        <div className="product-row">
            <div className="prod-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{width: "20px"}}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg></div>
            <div>
                <div className="prod-name">Cauliflower</div>
                <div className="prod-meta">CAU08 &middot; Vegetables &middot; Carton 8</div>
            </div>
            <div className="tier-strip"><div className="tier-chip">1–2 &middot; <strong>$28.80</strong></div><div className="tier-chip">3–5 &middot; <strong>$27.20</strong></div><div className="tier-chip">6+ &middot; <strong>$25.60</strong></div></div>
            <div className="qty-box">
                <button type="button">-</button>
                <input readOnly value="0" />
                <button type="button">+</button>
            </div>
            <div className="prod-price">
                <strong>$28.80</strong>
                <small>starting cost</small>
            </div>
        </div>
        <div className="product-row">
            <div className="prod-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{width: "20px"}}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg></div>
            <div>
                <div className="prod-name">Baby Spinach</div>
                <div className="prod-meta">SPI01 &middot; Vegetables &middot; 1kg bag</div>
            </div>
            <div className="tier-strip"><div className="tier-chip">1–4 &middot; <strong>$12.80</strong></div><div className="tier-chip">5–9 &middot; <strong>$11.90</strong></div><div className="tier-chip">10+ &middot; <strong>$11.10</strong></div></div>
            <div className="qty-box">
                <button type="button">-</button>
                <input readOnly value="0" />
                <button type="button">+</button>
            </div>
            <div className="prod-price">
                <strong>$12.80</strong>
                <small>starting cost</small>
            </div>
        </div>
        <div className="product-row">
            <div className="prod-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{width: "20px"}}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg></div>
            <div>
                <div className="prod-name">Cos Lettuce</div>
                <div className="prod-meta">COS12 &middot; Vegetables &middot; Carton 12</div>
            </div>
            <div className="tier-strip"><div className="tier-chip">1–2 &middot; <strong>$27.20</strong></div><div className="tier-chip">3–5 &middot; <strong>$25.90</strong></div><div className="tier-chip">6+ &middot; <strong>$24.40</strong></div></div>
            <div className="qty-box">
                <button type="button">-</button>
                <input readOnly value="0" />
                <button type="button">+</button>
            </div>
            <div className="prod-price">
                <strong>$27.20</strong>
                <small>starting cost</small>
            </div>
        </div>
        <div className="product-row">
            <div className="prod-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{width: "20px"}}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg></div>
            <div>
                <div className="prod-name">Red Capsicum</div>
                <div className="prod-meta">CAP05 &middot; Vegetables &middot; 5kg carton</div>
            </div>
            <div className="tier-strip"><div className="tier-chip">1–2 &middot; <strong>$33.00</strong></div><div className="tier-chip">3–5 &middot; <strong>$31.40</strong></div><div className="tier-chip">6+ &middot; <strong>$29.90</strong></div></div>
            <div className="qty-box">
                <button type="button">-</button>
                <input readOnly value="0" />
                <button type="button">+</button>
            </div>
            <div className="prod-price">
                <strong>$33.00</strong>
                <small>starting cost</small>
            </div>
        </div>
        <div className="product-row">
            <div className="prod-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{width: "20px"}}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg></div>
            <div>
                <div className="prod-name">Lebanese Cucumber</div>
                <div className="prod-meta">CUC05 &middot; Vegetables &middot; 5kg carton</div>
            </div>
            <div className="tier-strip"><div className="tier-chip">1–2 &middot; <strong>$24.50</strong></div><div className="tier-chip">3–5 &middot; <strong>$23.20</strong></div><div className="tier-chip">6+ &middot; <strong>$21.90</strong></div></div>
            <div className="qty-box">
                <button type="button">-</button>
                <input readOnly value="0" />
                <button type="button">+</button>
            </div>
            <div className="prod-price">
                <strong>$24.50</strong>
                <small>starting cost</small>
            </div>
        </div>
        <div className="product-row">
            <div className="prod-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{width: "20px"}}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg></div>
            <div>
                <div className="prod-name">Brown Onion</div>
                <div className="prod-meta">ONI10 &middot; Vegetables &middot; 10kg bag</div>
            </div>
            <div className="tier-strip"><div className="tier-chip">1–2 &middot; <strong>$19.90</strong></div><div className="tier-chip">3–5 &middot; <strong>$18.70</strong></div><div className="tier-chip">6+ &middot; <strong>$17.50</strong></div></div>
            <div className="qty-box">
                <button type="button">-</button>
                <input readOnly value="0" />
                <button type="button">+</button>
            </div>
            <div className="prod-price">
                <strong>$19.90</strong>
                <small>starting cost</small>
            </div>
        </div>
        <div className="product-row">
            <div className="prod-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{width: "20px"}}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg></div>
            <div>
                <div className="prod-name">Potato Brushed</div>
                <div className="prod-meta">POT20 &middot; Vegetables &middot; 20kg bag</div>
            </div>
            <div className="tier-strip"><div className="tier-chip">1–2 &middot; <strong>$29.60</strong></div><div className="tier-chip">3–5 &middot; <strong>$27.90</strong></div><div className="tier-chip">6+ &middot; <strong>$26.20</strong></div></div>
            <div className="qty-box">
                <button type="button">-</button>
                <input readOnly value="0" />
                <button type="button">+</button>
            </div>
            <div className="prod-price">
                <strong>$29.60</strong>
                <small>starting cost</small>
            </div>
        </div>
          </div>
        </div>
        
        <aside className="card sticky">
          <div className="card-head">
            <div>
              <h2>Current Cart</h2>
              <p>Live slab pricing</p>
            </div>
            <span className="status alloc">0 items</span>
          </div>
          <div className="cart-empty">
            Your cart is empty.<br/>Add products to see applied slab pricing here.
          </div>
          <div className="cart-summary">
            <div className="sum-row"><span>Subtotal</span><b>$0.00</b></div>
            <div className="sum-row"><span>GST</span><b>$0.00</b></div>
            <div className="sum-row total"><span>Order Total</span><span>$0.00</span></div>
            <Link href="/cart" className="btn btn-primary" style={{width: '100%', marginTop: '7px'}}>Review Cart &amp; Create PO</Link>
            <div className="cart-note"><strong>Applied Cost Price</strong> is the price your business will pay after the qualifying slab is calculated.</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
