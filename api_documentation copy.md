# eFresh B2B Customer Portal - Comprehensive API Documentation

Base URL: `https://api.efresh.example/v1`
Authentication: Bearer Token (JWT) in Authorization Header.

---

## 1. Authentication Module

### `POST /auth/login`
Authenticates a user and returns a JWT token.
**Request Body (application/json):**
```json
{
  "email": "admin@efresh.example",
  "password": "password123"
}
```
**Response (200 OK):**
```json
{
  "token": "eyJhbG...",
  "user": {
    "id": "USR-1029",
    "name": "Alex Wong",
    "role": "Buyer",
    "user_group":"user_group",
    "accountId": "ACC-5521",
    "accountName": "Melbourne Fresh Foods"
  }
}
```

### `POST /auth/logout`
Invalidates the current active session token.
**Response (200 OK):**
```json
{ "success": true, "message": "Logged out successfully" }
```

### `GET /auth/me`
Returns the currently authenticated user's details and permissions.
**Response (200 OK):**
```json
{
  "id": "USR-1029",
  "name": "Alex Wong",
  "email": "admin@efresh.example",
  "role": "Buyer",
  "user_group":"user_group",
  "accountId": "ACC-5521",
  "accountName": "Melbourne Fresh Foods"
}
```

---

## 2. Dashboard Module

### `GET /dashboard/summary`
Retrieves top-level KPIs for the current account.
**Response (200 OK):**
```json
{
  "metrics": {
    "activeOrders": 6,
    "inTransitDeliveries": 2,
    "overdueInvoices": 2,
    "openClaims": 2,
    "cartItemCount": 0
  }
}
```

### `GET /dashboard/accounts-snapshot`
Retrieves the current balance and aging summary for the account.
**Response (200 OK):**
```json
{
  "totalOutstanding": 5440.00,
  "aging": {
    "current": 2020.00,
    "days_1_30": 2160.00,
    "days_31_60": 900.00,
    "days_60_plus": 360.00
  },
  "warnings": {
    "overdueCount": 2,
    "oldestOverdueDays": 20,
    "message": "2 overdue invoices. Oldest invoice is 20 days overdue."
  }
}
```

### `GET /dashboard/recent-activity`
Retrieves the most recent activities (Orders, Deliveries).
**Response (200 OK):**
```json
{
  "recentOrders": [
    {
      "poId": "PO-10482",
      "date": "2026-08-07T00:00:00Z",
      "items": 14,
      "total": 1482.60,
      "status": "Confirmed",
      "delivery": "Today"
    },
    {
      "poId": "PO-10476",
      "date": "2026-08-05T00:00:00Z",
      "items": 9,
      "total": 786.10,
      "status": "In Transit",
      "delivery": "Today"
    },
    {
      "poId": "PO-10463",
      "date": "2026-08-01T00:00:00Z",
      "items": 22,
      "total": 2134.30,
      "status": "Completed",
      "delivery": "4 Aug"
    }
  ],
  "upcomingDeliveries": [
    {
      "deliveryId": "DEL-62018",
      "poId": "PO-10476",
      "eta": "Today 2:00-4:00 PM",
      "products": "9 · 31 cartons",
      "location": "Brunswick Store",
      "status": "In Transit",
      "receiving": "Awaiting"
    },
    {
      "deliveryId": "DEL-62026",
      "poId": "PO-10482",
      "eta": "8 Aug 8:00-10:00 AM",
      "products": "14 · 48 cartons",
      "location": "Brunswick Store",
      "status": "Packing",
      "receiving": null
    }
  ]
}
```

---

## 3. Products & Catalog Module

### `GET /products`
Retrieves a paginated list of products available to the customer's specific pricing tier.
**Query Parameters:**
- `search` (string) - Search by name or SKU
- `category` (string) - Filter by category
- `page` (number) - Default 1
- `limit` (number) - Default 20
- `sort` (string) - `price_asc`, `price_desc`, `name_asc`, `popular`

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "PRD-1029",
      "sku": "AVH20",
      "name": "Avocado Hass",
      "category": "Fruit",
      "unit_type_name": "Tray 20",
      "unit_type_id": "ut-001",
      "unit_type_uom": "tray",
      "startingCost": 28.50,
      "priceTiers": [
        { "minQty": 1, "maxQty": 4, "price": 28.50 },
        { "minQty": 5, "maxQty": 9, "price": 27.20 },
        { "minQty": 10, "maxQty": null, "price": 25.80 }
      ],
      "stockStatus": "In Stock",
      "imageUrl": "https://api.efresh.example/images/avocado.jpg"
    }
  ],
  "pagination": { "total": 150, "page": 1, "limit": 20, "totalPages": 8 }
}
```

### `GET /products/categories`
Retrieves all available product categories.
**Response (200 OK):**
```json
[
  { "id": "cat_seafood", "name": "Seafood", "count": 45 },
  { "id": "cat_meat", "name": "Meat & Poultry", "count": 82 }
]
```



---

## 4. Cart & Checkout Module

### `GET /cart`
Retrieves the user's active shopping cart.
**Response (200 OK):**
```json
{
  "id": "CRT-8821",
  "items": [
    {
      "cartItemId": "ci_19283",
      "productId": "PRD-1029",
      "sku": "AVH20",
      "name": "Avocado Hass",
      "unit_type_name": "Tray 20",
      "unit_type_id": "ut-001",
      "unitPrice": 25.80,
      "quantity": 10,
      "total": 258.00,
      "appliedPriceTier": { "minQty": 10, "maxQty": null, "price": 25.80 }
    }
  ],
  "subtotal": 258.00,
  "tax": 25.80,
  "total": 283.80
}
```

### `POST /cart/items`
Adds a product to the cart.
**Request Body:**
```json
{
  "productId": "PRD-1029",
  "quantity": 10
}
```
**Response (200 OK):**
```json
{
  "id": "CRT-8821",
  "items": [
    {
      "cartItemId": "ci_19283",
      "productId": "PRD-1029",
      "sku": "AVH20",
      "name": "Avocado Hass",
      "unit_type_name": "Tray 20",
      "unit_type_id": "ut-001",
      "unitPrice": 25.80,
      "quantity": 10,
      "total": 258.00,
      "appliedPriceTier": { "minQty": 10, "maxQty": null, "price": 25.80 }
    }
  ],
  "subtotal": 258.00,
  "tax": 25.80,
  "total": 283.80
}
```

### `PUT /cart/items/{cartItemId}`
Updates the quantity of a specific cart item.
**Request Body:**
```json
{ "quantity": 12 }
```
**Response (200 OK):** Returns the updated cart object.

### `DELETE /cart/items/{cartItemId}`
Removes an item from the cart.
**Response (200 OK):** Returns the updated cart object.

### `GET /locations`
Retrieves the user's active delivery locations.
**Response (200 OK):**
```json
[
  {
    "id": "loc-001",
    "name": "Brunswick Store",
    "address": "248 Sydney Rd",
    "deliverTo":{
      "id":"loc-001",
      "storeName":"Melbourne Fresh Foods ",
      "storeAddress":"123 Market St, Melbourne VIC"
    },
    "costCentres": [
      { "id": "cc-01", "name": "Brunswick Retail" }
    ],
    "receivingContacts": [
      { "id": "rc-01", "name": "Jordan Mills", "phone": "0412 555 221" }
    ],
    "preferredWindows": [
      "8:00 AM - 10:00 AM",
      "10:00 AM - 12:00 PM"
    ]
  }
]
```
### `GET /locations/stors`
Retrieves all delivery locations (stores) available to the current user for ordering and filtering.
**Response (200 OK):**
```json
[
  { "id": "LOC-001", "name": "Brunswick Store" },
  { "id": "LOC-002", "name": "Richmond Store" }
]
```

### `GET /po-number`
Generates a new, unique Purchase Order / Internal Reference number from the backend (e.g. for pre-filling checkout forms).
**Response (200 OK):**
```json
{
  "poReference": "STORE-8848"
}
```

### `GET /payment-options`
Retrieves available payment methods and terms for the account.
**Response (200 OK):**
```json
[
  {
    "id": "pay-opt-01",
    "title": "7 Day · Direct Debit",
    "description": "Order on account. The invoice balance is automatically collected by Direct Debit on the 7-day due date.",
    "savedAccount": "Saved account · **** 4821",
    "summary": {
      "paymentTerm": "7 days from invoice",
      "method": "Direct Debit · **** 4821",
      "collection": "Automatic on due date"
    }
  },
  {
    "id": "pay-opt-02",
    "title": "On Order",
    "description": "Pay when the PO is submitted. Use one payment method or split the order total across multiple payments.",
    "savedAccount": "Immediate payment",
    "summary": {
      "paymentTerm": "Immediate",
      "method": "Credit Card / Split",
      "collection": "Manual on checkout"
    }
  }
]
```

### `POST /create-order`
Submits the active cart as a finalized Purchase Order.
**Request Body:**
```json
{
  "poReference": "STORE-8848",
  "costCentreId": "cc-01",
  "locationId": "loc-001",
  "deliveryDate": "2026-08-08",
  "receivingContactId": "rc-01",
  "preferredWindow": "8:00 AM - 10:00 AM",
  "paymentOptionId": "pay-opt-01",
  "notes": "Please call 15 minutes before arrival. Deliver to rear receiving entrance."
}
```
**Response (201 Created):**
```json
{
  "orderId": "PO-90215",
  "status": "Submitted",
  "estimatedDelivery": "2023-11-05"
}
```

---

## 5. Purchase Orders Module

### `GET /purchase-orders/summary`
Retrieves the high-level statistics for the purchase orders page.
**Response (200 OK):**
```json
{
  "openPos": {
    "count": 6,
    "totalValue": 8420.00
  },
  "awaitingConfirmation": {
    "count": 1,
    "latestPoRef": "PO-10488"
  },
  "inDelivery": {
    "count": 2,
    "arrivingToday": 1
  },
  "completedThisMonth": {
    "count": 18,
    "totalValuePurchased": 21760.00
  }
  }
}
```

### `GET /purchase-orders/statuses`
Retrieves a list of available statuses for filtering purchase orders.
**Response (200 OK):**
```json
[
  { "id": "all", "label": "All Statuses" },
  { "id": "submitted", "label": "Submitted" },
  { "id": "confirmed", "label": "Confirmed" },
  { "id": "in_transit", "label": "In Transit" },
  { "id": "completed", "label": "Completed" }
]
```

### `GET /purchase-orders`
Retrieves order history.
**Query Parameters:**
- `status` (string) - `Pending`, `Confirmed`, `In_Transit`, `Delivered`, `Completed`, `Cancelled`
- `dateFrom` (ISO-8601)
- `dateTo` (ISO-8601)

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "PO-10488",
      "customerPoRef": "STORE-8847",
      "createdBy": {
        "name": "Alex Wong",
        "role": "Buyer"
      },
      "createdAt": "2026-08-07T00:00:00Z",
      "itemCount": 8,
      "total": 1105.80,
      "slabSaving": 64.20,
      "payment": {
        "term": "On Order",
        "method": "Split - 2 payments"
      },
      "status": "Submitted",
      "deliveryDate": "2026-08-08T00:00:00Z"
    },
    {
      "id": "PO-10482",
      "customerPoRef": "STORE-8841",
      "createdBy": {
        "name": "Alex Wong",
        "role": "Buyer"
      },
      "createdAt": "2026-08-07T00:00:00Z",
      "itemCount": 14,
      "total": 1482.60,
      "slabSaving": 92.80,
      "payment": {
        "term": "7 Day",
        "method": "Direct Debit"
      },
      "status": "Confirmed",
      "deliveryDate": "2026-08-07T00:00:00Z"
    }
  ],
  "pagination": { "total": 45, "page": 1, "limit": 20 }
}
```

### `GET /purchase-orders/{id}`
Retrieves full details of a specific Purchase Order.
**Response (200 OK):**
```json
{
  "id": "PO-10488",
  "customerPoRef": "STORE-8841",
  "createdAt": "2026-08-07T09:12:00Z",
  "status": "Confirmed",
  "createdBy": {
    "name": "Alex Wong",
    "role": "Buyer"
  },
  "supplier": "eFresh Wholesale",
  "costCentre": "Brunswick Retail",
  "delivery": {
    "deliverTo": "Brunswick Store · 248 Sydney Rd",
    "requestedDate": "2026-08-07",
    "window": "2:00 PM - 4:00 PM",
    "eta": "Today 2:00-4:00 PM",
    "receivingContact": "Jordan Mills · 0412 555 221",
    "deliveryId": "DEL-62018",
    "notes": "Call 15 mins before arrival"
  },
  "invoiceStatus": "Pending",
  "payment": {
    "method": "7 Day · Direct Debit",
    "status": "Scheduled for due date"
  },
  "timeline": {
    "submitted": "2026-08-07T09:12:00Z",
    "confirmed": "2026-08-07T09:24:00Z",
    "packed": "2026-08-07T12:05:00Z",
    "inTransit": null,
    "delivered": null,
    "received": null
  },
  "items": [
    {
      "productId": "PRD-1029",
      "sku": "AVH20",
      "name": "Avocado Hass",
      "unit_type_name": "Tray 20",
      "qty": 10,
      "standardCost": 28.50,
      "appliedSlab": "10+ trays",
      "appliedCostPrice": 25.80,
      "saving": 27.00,
      "lineTotal": 258.00
    }
  ],
  "commercialSummary": {
    "standardPriceValue": 1441.27,
    "slabSavings": 92.80,
    "appliedCostSubtotal": 1348.47,
    "gst": 134.13,
    "poTotal": 1482.60
  }
}
```

### `GET /purchase-orders/{id}/timeline`
Retrieves the step-by-step status progression timeline for a specific purchase order.
**Response (200 OK):**
```json
[
  { "step": "Submitted", "status": "Completed", "description": "7 Aug 9:12" },
  { "step": "Confirmed", "status": "Completed", "description": "7 Aug 9:24" },
  { "step": "Packed", "status": "Completed", "description": "7 Aug 12:05" },
  { "step": "In Transit", "status": "Active", "description": "ETA 2-4 PM" },
  { "step": "Delivered", "status": "Pending", "description": "Pending" },
  { "step": "Received", "status": "Pending", "description": "Pending" }
]
```

### `GET /purchase-orders/{id}/pdf`
Returns a binary PDF document of the purchase order.
**Response (200 OK, Content-Type: application/pdf):** binary stream.

---

## 6. Deliveries Module

### `GET /deliveries/summary`
Retrieves the high-level statistics for the deliveries page.
**Response (200 OK):**
```json
{
  "arrivingToday": {
    "count": 1,
    "eta": "ETA 2:00-4:00 PM"
  },
  "scheduled": {
    "count": 3,
    "timeframe": "Next 7 days"
  },
  "needsReceiving": {
    "count": 1,
    "description": "Delivered but not checked"
  },
  "receivedThisWeek": {
    "count": 5,
    "withVariance": 2
  }
}
```

### `GET /deliveries`
Retrieves delivery tracking records.
**Query Parameters:**
- `status` (string) - Filter by status
- `locationId` (string) - Filter by location
- `search` (string) - Search by delivery ID or PO reference

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "DEL-62018",
      "poId": "PO-10476",
      "locationName": "Brunswick Store",
      "scheduledEta": "Today 2:00-4:00 PM",
      "productSummary": "9 · 31 cartons",
      "driverRun": "Marcus\nRun R-408",
      "deliveryStatus": "In Transit",
      "receivingStatus": "Awaiting"
    },
    {
      "id": "DEL-62026",
      "poId": "PO-10482",
      "locationName": "Brunswick Store",
      "scheduledEta": "8 Aug 8:00-10:00",
      "productSummary": "14 · 48 cartons",
      "driverRun": null,
      "deliveryStatus": "Packing",
      "receivingStatus": null
    },
    {
      "id": "DEL-62005",
      "poId": "PO-10463",
      "locationName": "Brunswick Store",
      "scheduledEta": "4 Aug 10:42 AM",
      "productSummary": "22 · 64 cartons",
      "driverRun": "Luca\nRun R-401",
      "deliveryStatus": "Delivered",
      "receivingStatus": "Variance Claim"
    }
  ],
  "pagination": { "total": 12, "page": 1, "limit": 20 }
}
```

### `GET /deliveries/{id}`
Retrieves specific details about a delivery including exact dispatch quantities.
**Response (200 OK):**
```json
{
  "id": "DEL-62018",
  "poId": "PO-10476",
  "locationName": "Brunswick Store",
  "expectedSchedule": "Expected today",
  "status": "In Transit",
  "timeline": {
    "poConfirmed": "5 Aug",
    "packed": "7 Aug 11:24",
    "dispatched": "7 Aug 13:12",
    "inTransit": "Now",
    "delivered": "ETA 2-4 PM",
    "received": "Pending"
  },
  "items": [
    {
      "productName": "Avocado Hass",
      "sku": "AVH20",
      "poQty": 5,
      "dispatched": 5,
      "supplyUnit": "Tray 20",
      "appliedCostPrice": 27.20,
      "status": "Full"
    },
    {
      "productName": "Strawberries 250g",
      "sku": null,
      "poQty": 12,
      "dispatched": 12,
      "supplyUnit": "12 punnet tray",
      "appliedCostPrice": 23.50,
      "status": "Full"
    },
    {
      "productName": "Baby Spinach",
      "sku": null,
      "poQty": 8,
      "dispatched": 8,
      "supplyUnit": "1kg bag",
      "appliedCostPrice": 11.90,
      "status": "Full"
    },
    {
      "productName": "Cos Lettuce",
      "sku": null,
      "poQty": 6,
      "dispatched": 6,
      "supplyUnit": "Carton 12",
      "appliedCostPrice": 24.40,
      "status": "Full"
    }
  ],
  "deliveryInformation": {
    "eta": "Today · 2:00-4:00 PM",
    "driver": "Marcus · Van 12",
    "run": "R-408 · Stop 7 of 11",
    "deliverTo": "248 Sydney Rd, Brunswick",
    "receivingContact": "Jordan Mills · 0412 555 221"
  },
  "alert": "Once the driver marks this delivery as delivered, the Receive Goods action remains available for your receiver to verify every line."
}
```

---

## 7. Receiving (GRN) Module

### `GET /receiving/summary`
Retrieves the high-level statistics for the receiving page.
**Response (200 OK):**
```json
{
  "readyToReceive": {
    "count": 3,
    "description": "Delivered / awaiting check"
  },
  "arrivingToday": {
    "count": 2,
    "description": "Can be received on arrival"
  },
  "partiallyReceived": {
    "count": 1,
    "description": "Continue remaining products"
  },
  "receivedToday": {
    "count": 4,
    "claims": "1 receipt had a claim"
  }
}
```

### `GET /receiving/reasons`
Retrieves a list of standard reasons available when reporting a receiving variance (e.g., damaged, spoiled, missing).
**Response (200 OK):**
```json
[
  { "id": "RSN-001", "label": "Damaged in transit" },
  { "id": "RSN-002", "label": "Spoiled / Quality issue" },
  { "id": "RSN-003", "label": "Missing from delivery" },
  { "id": "RSN-004", "label": "Incorrect item supplied" },
  { "id": "RSN-005", "label": "Packaging damaged" }
]
```

### `GET /receiving`
Retrieves a paginated list of Purchase Orders that are currently awaiting receipt.
**Query Parameters:**
- `status` (string) - Filter by receiving status
- `locationId` (string) - Filter by location
- `search` (string) - Search by PO, delivery or location

**Response (200 OK):**
```json
{
  "data": [
    {
      "poId": "PO-10476",
      "deliveryId": "DEL-62018",
      "supplier": "eFresh Wholesale",
      "location": "Brunswick Store",
      "dueDelivered": "Delivered today · 3:06 PM",
      "productCount": 4,
      "expectedQty": "31 cartons / packs",
      "deliveryStatus": "Delivered",
      "receivingStatus": "Ready to Receive",
      "priority": "High"
    },
    {
      "poId": "PO-10482",
      "deliveryId": "DEL-62026",
      "supplier": "eFresh Wholesale",
      "location": "Brunswick Store",
      "dueDelivered": "Today · ETA 5:00-6:00 PM",
      "productCount": 5,
      "expectedQty": "48 cartons / packs",
      "deliveryStatus": "Out for Delivery",
      "receivingStatus": "Arriving Today",
      "priority": "Normal"
    },
    {
      "poId": "PO-10468",
      "deliveryId": "DEL-62009",
      "supplier": "eFresh Wholesale",
      "location": "North Melbourne Warehouse",
      "dueDelivered": "Delivered today · 10:44 AM",
      "productCount": 5,
      "expectedQty": "37 cartons / packs",
      "deliveryStatus": "Delivered",
      "receivingStatus": "Partially Received",
      "priority": "Continue"
    }
  ],
  "pagination": { "total": 5, "page": 1, "limit": 20 }
}
```

### `GET /receiving/{poId}`
Fetches the expected receiving manifest for a specific Purchase Order.
**Response (200 OK):**
```json
{
  "poId": "PO-10476",
  "deliveryId": "DEL-62018",
  "locationName": "Brunswick Store",
  "deliveredDue": "Delivered today · 3:06 PM",
  "expectedSummary": "expected 31 cartons / packs",
  "status": "Ready to Receive",
  "deliveredBy": "Marcus · Van 12",
  "receiver": "Jordan Mills · Receiver",
  "deliveryDocket": "DCK-88402",
  "receivingProgress": "0 of 4 products checked",
  "items": [
    {
      "productId": "PRD-1029",
      "productName": "Avocado Hass",
      "unit": "Tray 20",
      "orderedQty": 5,
      "dispatchedQty": 5,
      "status": "Pending"
    },
    {
      "productId": "PRD-1030",
      "productName": "Strawberries 250g",
      "unit": "12 punnet tray",
      "orderedQty": 12,
      "dispatchedQty": 12,
      "status": "Pending"
    },
    {
      "productId": "PRD-1031",
      "productName": "Baby Spinach",
      "unit": "1kg bag",
      "orderedQty": 8,
      "dispatchedQty": 8,
      "status": "Pending"
    },
    {
      "productId": "PRD-1032",
      "productName": "Cos Lettuce",
      "unit": "Carton 12",
      "orderedQty": 6,
      "dispatchedQty": 6,
      "status": "Pending"
    }
  ],
  "receiptSummary": {
    "productsChecked": "0 / 4",
    "expected": 31,
    "acceptedGood": 0,
    "damaged": 0,
    "spoiled": 0,
    "missing": 0,
    "variance": 0
  },
  "alert": "If any product is reported damaged, spoiled or missing, completing the receipt will automatically create the related claim."
}
```

### `POST /receiving/{poId}/items/{productId}/report`
Saves an item-level variance report for a specific product being received.
**Request Body:**
```json
{
  "damaged": 0,
  "spoiled": 0,
  "missing": 0,
  "acceptedGood": 5,
  "reason": "Select reason",
  "notes": "Describe the damage, spoilage, shortage or quality issue...",
  "evidenceFiles": ["base64_string_1"]
}
```
**Response (200 OK):**
```json
{
  "success": true
}
```

### `POST /receiving/{poId}/submit`
Submits the Goods Receipt Note (GRN) with actual received quantities.
**Request Body:**
```json
{
  "receiver": "Jordan Mills · Receiver",
  "notes": "Driver arrived late. One box of strawberries was crushed.",
  "evidenceFiles": ["base64_string_1", "base64_string_2"],
  "items": [
    {
      "productId": "PRD-1029",
      "acceptedGood": 5,
      "damaged": 0,
      "spoiled": 0,
      "missing": 0
    },
    {
      "productId": "PRD-1030",
      "acceptedGood": 10,
      "damaged": 1,
      "spoiled": 1,
      "missing": 0
    }
  ]
}
```
**Response (200 OK):**
```json
{
  "grnId": "GRN-22041",
  "poId": "PO-10476",
  "status": "Received",
  "claimsGenerated": ["CLM-3102"]
}
```

---

## 8. Invoices & Billing Module

### `GET /invoices/summary`
Retrieves the high-level statistics and account aging for the invoices page.
**Response (200 OK):**
```json
{
  "outstanding": {
    "total": 5440.00,
    "invoiceCount": 7
  },
  "dueWithin14Days": {
    "total": 4180.00,
    "invoiceCount": 4
  },
  "overdue": {
    "total": 1260.00,
    "invoiceCount": 2
  },
  "availableCredit": {
    "creditLimit": 15000.00,
    "available": 9560.00
  },
  "aging": {
    "current": 2020.00,
    "days1To30": 2160.00,
    "days31To60": 900.00,
    "days60Plus": 360.00
  },
  "nextDueDate": "10 Aug"
}
```

### `GET /invoices`
Retrieves a paginated list of invoices.
**Query Parameters:**
- `status` (string) - Filter by status
- `locationId` (string) - Filter by location
- `search` (string) - Search by invoice ID or PO reference

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "INV-98214",
      "poId": "PO-10463",
      "grnDelivery": ["GRN-22041", "DEL-62005"],
      "invoiceDate": "4 Aug",
      "dueDate": "18 Aug",
      "amount": 2134.30,
      "creditsPending": "$48.60 claim",
      "balance": 2134.30,
      "status": "Pending"
    },
    {
      "id": "INV-98172",
      "poId": "PO-10421",
      "grnDelivery": ["GRN-21988"],
      "invoiceDate": "27 Jul",
      "dueDate": "10 Aug",
      "amount": 918.45,
      "creditsPending": null,
      "balance": 918.45,
      "status": "Due Soon"
    },
    {
      "id": "INV-98088",
      "poId": "PO-10391",
      "grnDelivery": ["GRN-21944"],
      "invoiceDate": "18 Jul",
      "dueDate": "1 Aug",
      "amount": 720.00,
      "creditsPending": null,
      "balance": 720.00,
      "status": "Overdue 6d"
    }
  ],
  "pagination": { "total": 25, "page": 1, "limit": 20 }
}
```

### `GET /invoices/{id}`
Retrieves detailed line items for a specific invoice.
**Response (200 OK):**
```json
{
  "id": "INV-98214",
  "issueDate": "2026-08-04",
  "dueDate": "2026-08-18",
  "poId": "PO-10463",
  "status": "Credit Review",
  "lines": [
    {
      "product": {
        "name": "Avocado Hass",
        "sku": "AVH20",
        "unit": "Tray 20"
      },
      "received": "5",
      "poAppliedCost": 27.20,
      "invoicePrice": 27.20,
      "lineValue": 136.00,
      "receiptIssue": null
    },
    {
      "product": {
        "name": "Strawberries 250g",
        "sku": "STR12",
        "unit": "12 punnet tray"
      },
      "received": "10 good + 2 issue",
      "poAppliedCost": 23.50,
      "invoicePrice": 23.50,
      "lineValue": 282.00,
      "receiptIssue": "1 damaged · 1 spoiled"
    },
    {
      "product": {
        "name": "Baby Spinach",
        "sku": "SPI01",
        "unit": "1kg bag"
      },
      "received": "8",
      "poAppliedCost": 11.90,
      "invoicePrice": 11.90,
      "lineValue": 95.20,
      "receiptIssue": null
    }
  ],
  "relatedDocuments": [
    { "type": "Purchase Order", "id": "PO-10463", "date": "2026-08-01T00:00:00Z", "status": "Completed" },
    { "type": "Delivery", "id": "DEL-62005", "date": "2026-08-04T00:00:00Z", "status": "Delivered" },
    { "type": "Goods Receipt", "id": "GRN-22041", "date": "2026-08-04T00:00:00Z", "status": "Variance" },
    { "type": "Claim", "id": "CLM-3102", "date": "2026-08-04T00:00:00Z", "status": "Under Review" }
  ],
  "summary": {
    "subtotal": 1940.27,
    "gst": 194.03,
    "invoiceTotal": 2134.30,
    "paid": 0.00,
    "creditPending": 48.60,
    "currentBalance": 2134.30
  },
  "alerts": [
    {
      "type": "Important",
      "message": "the $48.60 damaged/spoiled goods claim is visible here but does not reduce the payable balance until the supplier approves the credit."
    }
  ]
}
```

---

## 9. Claims & Credits Module

### `GET /claims/summary`
Retrieves the high-level statistics for the claims page.
**Response (200 OK):**
```json
{
  "openClaims": {
    "count": 2,
    "requestedAmount": 87.40
  },
  "underReview": {
    "count": 1,
    "amount": 48.60
  },
  "creditsApprovedThisMonth": 326.00,
  "averageResolutionDays": 1.4
}
```

### `GET /claims`
Retrieves a list of submitted claims and their current resolution status.
**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "CLM-3102",
      "grnId": "GRN-22041",
      "poId": "PO-10463",
      "invoiceId": "INV-98214",
      "raisedAt": "2026-08-04T00:00:00Z",
      "raisedBy": "Jordan Mills",
      "issueSummary": "1 damaged · 1 spoiled",
      "productSummary": "Strawberries 250g",
      "claimValue": 48.60,
      "supplierResponse": "Under Review",
      "credit": "Pending"
    },
    {
      "id": "CLM-3088",
      "grnId": "GRN-21976",
      "poId": "PO-10410",
      "invoiceId": "INV-98122",
      "raisedAt": "2026-07-28T00:00:00Z",
      "raisedBy": "Jordan Mills",
      "issueSummary": "2 missing",
      "productSummary": "Blueberries 125g",
      "claimValue": 38.80,
      "supplierResponse": "Accepted",
      "credit": "CR-8821"
    }
  ]
}
```

### `GET /claims/{id}`
Retrieves detailed information for a specific claim.
**Response (200 OK):**
```json
{
  "id": "CLM-3102",
  "grnId": "GRN-22041",
  "status": "Under Review",
  "items": [
    {
      "productName": "Strawberries 250g",
      "unit": "12 punnet tray",
      "issue": "Damaged",
      "qty": 1,
      "appliedCost": 24.30,
      "claimAmount": 24.30
    },
    {
      "productName": "Strawberries 250g",
      "unit": "12 punnet tray",
      "issue": "Spoiled",
      "qty": 1,
      "appliedCost": 24.30,
      "claimAmount": 24.30
    }
  ],
  "alerts": [
    {
      "type": "Info",
      "message": "Evidence attached: 2 photos + receiver note. Supplier has until 8 Aug 5:00 PM to respond."
    },
    {
      "type": "Warning",
      "message": "Invoice balance remains unchanged until the credit note is approved and issued."
    }
  ]
}
```

### `POST /claims`
Initiate a new claim for missing, damaged, or poor quality goods.
**Request Body (multipart/form-data for file uploads, or JSON if base64):**
```json
{
  "poId": "PO-10463",
  "grnId": "GRN-22041",
  "items": [
    {
      "productId": "PRD-1029",
      "reason": "Damaged",
      "quantity": 1,
      "description": "Punnet was crushed",
      "images": ["base64_string_1", "base64_string_2"]
    },
    {
      "productId": "PRD-1030",
      "reason": "Spoiled",
      "quantity": 1,
      "description": "Mold on berries",
      "images": ["base64_string_3"]
    }
  ]
}
```
**Response (201 Created):**
```json
{
  "id": "CLM-40193",
  "status": "Submitted"
}
```

---

## 10. Account & Users Module

### `GET /account`
Retrieves company account settings, terms, and delivery locations.
**Response (200 OK):**
```json
{
  "id": "B2B-10428",
  "businessName": "Melbourne Fresh Foods Pty Ltd",
  "abn": "72 608 441 920",
  "primaryContact": "Alex Wong",
  "accountsEmail": "accounts@melbournefresh.example",
  "paymentTerms": "Per PO - 7 Day DD or On Order",
  "creditLimit": 15000.00,
  "creditUsed": 5440.00,
  "availableCredit": 9560.00,
  "status": "Active",
  "pricingGroup": "Wholesale - Contract A",
  "locations": [
    {
      "id": "LOC-001",
      "type": "Primary",
      "name": "Brunswick Store - 248 Sydney Rd"
    },
    {
      "id": "LOC-002",
      "type": "Secondary",
      "name": "Richmond Store - 310 Swan St"
    }
  ]
}
```

### `GET /account/users`
Retrieves all users with access to this B2B portal account.
**Response (200 OK):**
```json
{
  
  "data": [
    {
      "id": "USR-1029",
      "name": "Alex Wong",
      "email": "alex.wong@example.com",
      "role": "Buyer",
      "permissions": {
        "location": "All",
        "ordering": "Full",
        "invoices": "View",
        "receiving": "View"
      },
      "status": "Active"
    },
    {
      "id": "USR-1030",
      "name": "Jordan Mills",
      "email": "jordan.mills@example.com",
      "role": "Receiver",
      "permissions": {
        "location": "Brunswick",
        "ordering": "View",
        "invoices": "None",
        "receiving": "Full"
      },
      "status": "Active"
    },
    {
      "id": "USR-1031",
      "name": "Samantha Lee",
      "email": "sam.lee@example.com",
      "role": "Accounts",
      "permissions": {
        "location": "All",
        "ordering": "View",
        "invoices": "Full",
        "receiving": "View"
      },
      "status": "Active"
    }
  ]
}
```

### `POST /account/users`
Invites a new user to the company account.
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@melbournefresh.example",
  "role": "Viewer"
}
```
**Response (201 Created):**
```json
{
  "id": "USR-1031",
  "status": "Invite Sent"
}
```
