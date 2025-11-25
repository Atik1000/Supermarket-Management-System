# System Architecture - Supermarket Management System

## 🏛️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├─────────────┬──────────────────┬──────────────────┬─────────────┤
│  Web App    │  Admin Dashboard │  POS Terminal    │   Mobile    │
│ (Next.js)   │    (Next.js)     │   (Next.js)      │  (Future)   │
│  Port 3000  │    Port 3001     │   Port 3002      │             │
└─────────────┴──────────────────┴──────────────────┴─────────────┘
                              ↓
                    ┌─────────────────┐
                    │   Nginx/Proxy   │
                    └─────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│                  Django REST Framework API                       │
│                      (Port 8000)                                 │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Modules:                                                 │  │
│  │  • Accounts      • Products      • Inventory             │  │
│  │  • POS           • E-commerce    • Customers             │  │
│  │  • Payments      • Delivery      • Reports               │  │
│  │  • Notifications • Settings                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌────────────────┐  ┌────────────────┐  ┌─────────────────┐  │
│  │ Authentication │  │  Permissions   │  │   Middleware    │  │
│  │   (JWT/OAuth)  │  │  (Role-Based)  │  │  (Rate Limit)   │  │
│  └────────────────┘  └────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                       SERVICE LAYER                              │
├──────────────┬──────────────┬─────────────────┬────────────────┤
│   Business   │   Payment    │    Courier      │   Notification │
│   Services   │   Gateways   │   Integration   │    Services    │
├──────────────┼──────────────┼─────────────────┼────────────────┤
│ • Inventory  │ • bKash      │ • Pathao        │ • Email (SMTP) │
│ • Checkout   │ • Nagad      │ • RedX          │ • SMS (Twilio) │
│ • Loyalty    │ • SSLCommerz │ • eCourier      │ • Push (FCM)   │
│ • Reports    │ • Stripe     │ • Steadfast     │ • WebSocket    │
└──────────────┴──────────────┴─────────────────┴────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                       BACKGROUND TASKS                           │
├─────────────────────────────────────────────────────────────────┤
│                     Celery Workers                               │
│  ┌────────────────┬────────────────┬─────────────────────────┐ │
│  │  Email Queue   │  Report Queue  │  Notification Queue     │ │
│  └────────────────┴────────────────┴─────────────────────────┘ │
│                     Celery Beat (Scheduler)                      │
│  ┌────────────────┬────────────────┬─────────────────────────┐ │
│  │ Daily Reports  │ Stock Alerts   │ Loyalty Expiry Check    │ │
│  └────────────────┴────────────────┴─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                 │
├─────────────┬───────────────┬────────────────┬─────────────────┤
│ PostgreSQL  │     Redis     │      S3        │   File System   │
│  (Primary)  │  (Cache/Queue)│   (Media)      │   (Local Dev)   │
└─────────────┴───────────────┴────────────────┴─────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    MONITORING & LOGGING                          │
├─────────────┬───────────────┬────────────────┬─────────────────┤
│   Sentry    │   Logs        │  UptimeRobot   │   Analytics     │
│ (Errors)    │ (ELK/Files)   │  (Monitoring)  │   (Google)      │
└─────────────┴───────────────┴────────────────┴─────────────────┘
```

---

## 📦 Module Architecture

### Frontend Monorepo Structure

```
frontend/
├── apps/
│   ├── web/                    # Customer E-commerce
│   │   ├── app/
│   │   │   ├── (auth)/         # Login, Register
│   │   │   ├── products/       # Product Listing, Detail
│   │   │   ├── cart/           # Shopping Cart
│   │   │   ├── checkout/       # Checkout Process
│   │   │   ├── orders/         # Order History
│   │   │   ├── account/        # Customer Account
│   │   │   └── track/          # Order Tracking
│   │   ├── components/
│   │   └── lib/
│   │
│   ├── admin/                  # Admin Dashboard
│   │   ├── app/
│   │   │   ├── dashboard/      # Main Dashboard
│   │   │   ├── products/       # Product Management
│   │   │   ├── inventory/      # Stock Management
│   │   │   ├── orders/         # Order Management
│   │   │   ├── customers/      # Customer Management
│   │   │   ├── delivery/       # Delivery Management
│   │   │   ├── reports/        # Analytics & Reports
│   │   │   └── settings/       # System Settings
│   │   └── components/
│   │
│   └── pos/                    # POS Terminal
│       ├── app/
│       │   ├── pos/            # Main POS Interface
│       │   ├── sessions/       # Session Management
│       │   └── history/        # Transaction History
│       └── components/
│
└── packages/                   # Shared Code
    ├── ui/                     # shadcn/ui Components
    │   ├── components/
    │   │   ├── button.tsx
    │   │   ├── input.tsx
    │   │   ├── form.tsx
    │   │   ├── data-table.tsx
    │   │   └── ...
    │   └── lib/
    │
    ├── lib/                    # Shared Utilities
    │   ├── api-client.ts       # Axios Instance
    │   ├── auth-context.tsx    # Auth State
    │   ├── use-cart.ts         # Cart Hook
    │   ├── utils.ts            # Helper Functions
    │   └── validators.ts       # Zod Schemas
    │
    ├── types/                  # TypeScript Types
    │   ├── user.ts
    │   ├── product.ts
    │   ├── order.ts
    │   └── index.ts
    │
    └── config/                 # Shared Configs
        ├── tailwind.config.js
        ├── eslint.config.js
        └── tsconfig.json
```

### Backend Module Structure

```
backend/
├── config/                     # Project Configuration
│   ├── settings/
│   │   ├── base.py            # Shared Settings
│   │   ├── development.py     # Dev Settings
│   │   └── production.py      # Prod Settings
│   ├── urls.py                # URL Routing
│   └── wsgi.py                # WSGI Config
│
├── apps/                       # Django Applications
│   │
│   ├── accounts/              # User Management
│   │   ├── models.py          # User, UserProfile, Role
│   │   ├── serializers.py     # DRF Serializers
│   │   ├── views.py           # ViewSets
│   │   ├── permissions.py     # Custom Permissions
│   │   ├── urls.py            # URL Routes
│   │   ├── signals.py         # Django Signals
│   │   └── tests/             # Unit Tests
│   │
│   ├── products/              # Product Catalog
│   │   ├── models.py          # Product, Category, Brand
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── tests/
│   │
│   ├── inventory/             # Stock Management
│   │   ├── models.py          # Stock, PurchaseOrder
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── services.py        # Business Logic
│   │   ├── urls.py
│   │   └── tests/
│   │
│   ├── pos/                   # Point of Sale
│   │   ├── models.py          # POSSession, Transaction
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── services.py
│   │   ├── urls.py
│   │   └── tests/
│   │
│   ├── ecommerce/             # Online Orders
│   │   ├── models.py          # Cart, Order
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── services.py
│   │   ├── urls.py
│   │   └── tests/
│   │
│   ├── customers/             # Customer Management
│   │   ├── models.py          # Customer, Loyalty
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── services.py
│   │   ├── urls.py
│   │   └── tests/
│   │
│   ├── payments/              # Payment Processing
│   │   ├── models.py          # Payment, Refund
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── services/          # Gateway Integrations
│   │   │   ├── base.py
│   │   │   ├── bkash.py
│   │   │   ├── nagad.py
│   │   │   ├── sslcommerz.py
│   │   │   └── stripe.py
│   │   ├── urls.py
│   │   └── tests/
│   │
│   ├── delivery/              # Delivery Management
│   │   ├── models.py          # DeliveryZone, Assignment
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── services/          # Courier Integrations
│   │   │   ├── base.py
│   │   │   ├── pathao.py
│   │   │   ├── redx.py
│   │   │   └── ecourier.py
│   │   ├── urls.py
│   │   └── tests/
│   │
│   ├── reports/               # Analytics
│   │   ├── models.py          # DailySummary, Reports
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── services.py        # Analytics Logic
│   │   ├── tasks.py           # Celery Tasks
│   │   ├── urls.py
│   │   └── tests/
│   │
│   ├── notifications/         # Communication
│   │   ├── models.py          # Notification, Template
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── services.py        # Email, SMS, Push
│   │   ├── consumers.py       # WebSocket
│   │   ├── tasks.py           # Async Sending
│   │   ├── urls.py
│   │   └── tests/
│   │
│   └── settings/              # System Config
│       ├── models.py          # SystemSetting, TaxConfig
│       ├── serializers.py
│       ├── views.py
│       ├── urls.py
│       └── tests/
│
└── core/                       # Shared Utilities
    ├── models.py              # BaseModel
    ├── permissions.py         # Custom Permissions
    ├── pagination.py          # Custom Pagination
    ├── exceptions.py          # Custom Exceptions
    ├── middleware/            # Custom Middleware
    └── utils/                 # Helper Functions
```

---

## 🔄 Data Flow Diagrams

### Authentication Flow

```
User → Frontend → POST /api/auth/login/
                        ↓
                  Django REST API
                        ↓
                  Verify Credentials
                        ↓
                  Generate JWT Token
                        ↓
                  Return {access, refresh}
                        ↓
Frontend ← Store in Cookie/LocalStorage
    ↓
All Requests → Include Authorization Header
                        ↓
                  Django Middleware
                        ↓
                  Verify JWT
                        ↓
                  Attach User to Request
```

### Order Placement Flow

```
Customer → Add to Cart → Frontend State (Zustand)
                             ↓
                       POST /api/cart/add/
                             ↓
                        Django API
                             ↓
                    Create/Update CartItem
                             ↓
                        Save to DB
                             ↓
              Frontend ← Return Updated Cart
    ↓
Checkout → POST /api/orders/checkout/
                ↓
          CheckoutService
                ↓
    ┌───────────┼───────────┐
    ↓           ↓           ↓
Validate    Reserve      Create
  Cart       Stock        Order
    ↓           ↓           ↓
    └───────────┼───────────┘
                ↓
          Process Payment
                ↓
          Payment Gateway
                ↓
        Update Order Status
                ↓
      Send Confirmation Email
                ↓
    Frontend ← Order Confirmation
```

### Stock Management Flow

```
Admin → Create PO → POST /api/purchase-orders/
                          ↓
                    PurchaseOrderService
                          ↓
                    Create PO & Items
                          ↓
                    Status: Draft
                          ↓
Admin → Receive PO → POST /api/purchase-orders/{id}/receive/
                          ↓
                    PurchaseOrderService
                          ↓
                    For each item:
                    ├── Update received_qty
                    ├── Call StockService.adjust()
                    └── Create StockMovement
                          ↓
                    Update PO Status
                          ↓
                    Check Low Stock
                          ↓
                 Send Notification if Low
```

---

## 🗄️ Database Schema Overview

### Core Tables

```
users (accounts)
├── id (UUID)
├── email
├── phone
├── role
└── password_hash

user_profiles (accounts)
├── user_id (FK → users)
├── name
├── avatar
└── address

categories (products)
├── id (UUID)
├── name
├── slug
└── parent_id (FK → categories)

products (products)
├── id (UUID)
├── name
├── sku
├── category_id (FK → categories)
├── selling_price
└── stock

stock (inventory)
├── product_id (FK → products)
├── warehouse_id (FK → warehouses)
├── quantity
└── reserved_quantity

orders (ecommerce)
├── id (UUID)
├── order_number
├── user_id (FK → users)
├── status
└── total

order_items (ecommerce)
├── id (UUID)
├── order_id (FK → orders)
├── product_id (FK → products)
├── quantity
└── total

customers (customers)
├── id (UUID)
├── user_id (FK → users)
├── loyalty_points
└── total_spent

payments (payments)
├── id (UUID)
├── order_id (FK → orders)
├── amount
├── gateway
└── status
```

---

## 🔌 API Architecture

### REST API Design

```
Base URL: /api/v1/

Authentication:
  POST   /auth/register/
  POST   /auth/login/
  POST   /auth/logout/
  POST   /auth/refresh/

Products:
  GET    /products/
  GET    /products/{id}/
  POST   /products/
  PUT    /products/{id}/
  DELETE /products/{id}/

Orders:
  GET    /orders/
  POST   /orders/checkout/
  GET    /orders/{id}/
  PUT    /orders/{id}/cancel/

POS:
  POST   /pos/sessions/open/
  POST   /pos/transactions/
  GET    /pos/transactions/

Reports:
  GET    /reports/sales/daily/
  GET    /reports/inventory/low-stock/
```

### WebSocket Endpoints

```
ws://api.example.com/ws/

Connections:
  /ws/notifications/          # Real-time notifications
  /ws/pos/{session_id}/       # POS updates
  /ws/delivery/{order_id}/    # Delivery tracking
```

---

## 🔐 Security Architecture

### Authentication Layer

```
┌──────────────────────────────────────────┐
│         Client Request                    │
└─────────────┬────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│   Rate Limiting Middleware              │
│   (5 login attempts/min)                │
└─────────────┬───────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│   CORS Middleware                       │
│   (Check origin)                        │
└─────────────┬───────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│   JWT Authentication                    │
│   (Verify token signature)              │
└─────────────┬───────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│   Permission Check                      │
│   (Role-based access control)           │
└─────────────┬───────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│   View/Controller                       │
└─────────────────────────────────────────┘
```

---

## 📈 Scalability Considerations

### Horizontal Scaling

```
Load Balancer (Nginx)
        ↓
    ┌───┴───┐
    ↓       ↓
Django 1  Django 2  Django 3
    ↓       ↓       ↓
    └───┬───┘
        ↓
   PostgreSQL (Primary)
        ↓
   PostgreSQL (Replica) - Read-only
```

### Caching Strategy

```
Request → Check Redis Cache
             ↓ (miss)
          Query Database
             ↓
          Cache Result
             ↓
          Return Response
```

---

## 🚀 Deployment Architecture

### Production Environment

```
┌─────────────────────────────────────────────┐
│              Internet                        │
└────────────────┬────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│         Cloudflare CDN / WAF                │
└────────────────┬────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│         Load Balancer (Nginx)               │
└────────────────┬────────────────────────────┘
                 ↓
         ┌───────┴───────┐
         ↓               ↓
┌──────────────┐  ┌──────────────┐
│  App Server  │  │  App Server  │
│  (Gunicorn)  │  │  (Gunicorn)  │
└──────┬───────┘  └──────┬───────┘
       └──────────────────┘
                 ↓
    ┌────────────┼────────────┐
    ↓            ↓            ↓
┌────────┐  ┌────────┐  ┌────────┐
│ Postgres│  │ Redis  │  │   S3   │
│ (RDS)   │  │(Cache) │  │(Media) │
└─────────┘  └────────┘  └────────┘
```

---

**This architecture supports:**
- ✅ High availability
- ✅ Horizontal scaling
- ✅ Real-time updates
- ✅ Secure communication
- ✅ Fast performance
- ✅ Easy maintenance
