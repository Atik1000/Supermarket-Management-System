# Supermarket Management System

A comprehensive full-stack supermarket management system built with Django (Backend) and Next.js (Frontend).

## 🎯 Overview

This system provides a complete solution for managing supermarket operations including:
- Product catalog management
- Inventory tracking
- Point of Sale (POS) system
- E-commerce platform
- Customer management & loyalty program
- Payment processing (bKash, Nagad, SSLCommerz, Stripe)
- Delivery management
- Analytics & reporting
- Multi-channel notifications

## 🏗️ Architecture

### Backend (Django 5.0+)
- **Framework:** Django REST Framework
- **Authentication:** JWT (SimpleJWT)
- **Database:** PostgreSQL
- **Cache/Queue:** Redis + Celery
- **Storage:** AWS S3 / Local
- **API Docs:** drf-spectacular (Swagger/ReDoc)

### Frontend (Next.js 14+)
- **Framework:** Next.js App Router
- **Language:** TypeScript (strict mode)
- **UI:** Tailwind CSS + shadcn/ui
- **State:** Zustand + TanStack Query
- **Forms:** React Hook Form + Zod
- **Monorepo:** Turborepo with pnpm

## 📦 System Modules

### 1. **Accounts** - User Management & Authentication
- Custom user model with roles (Super Admin, Admin, Manager, Cashier, Delivery, Customer)
- JWT authentication
- Role-based permissions
- User profiles

### 2. **Products** - Product Catalog
- Categories (hierarchical)
- Brands
- Products with variants
- Multiple images
- SKU & barcode management

### 3. **Inventory** - Stock Management
- Multi-warehouse support
- Stock movements tracking
- Purchase orders
- Supplier management
- Low stock alerts

### 4. **POS** - Point of Sale
- Session management
- Transaction processing
- Cash reconciliation
- Receipt generation
- Offline support

### 5. **E-commerce** - Online Store
- Shopping cart
- Checkout process
- Order management
- Order tracking
- Status workflow

### 6. **Customers** - Customer Management
- Customer profiles
- Loyalty points system
- Tier-based rewards
- Purchase history
- Multiple addresses

### 7. **Payments** - Payment Processing
- Multiple payment methods
- Gateway integrations:
  - bKash
  - Nagad
  - SSLCommerz
  - Stripe
- Refund management

### 8. **Delivery** - Logistics Management
- Delivery zones
- Courier integrations:
  - Pathao
  - RedX
  - eCourier
  - Steadfast
- Real-time tracking
- Own delivery fleet

### 9. **Reports** - Analytics & BI
- Sales reports
- Inventory reports
- Customer analytics
- Revenue trends
- Scheduled reports

### 10. **Notifications** - Communication
- Email notifications
- SMS alerts
- In-app notifications
- Push notifications
- Template management

### 11. **Settings** - System Configuration
- Business information
- Tax configuration
- Payment settings
- Delivery settings
- Email/SMS configuration

## 🚀 Technology Stack

### Backend
```
- Python 3.12+
- Django 5.0+
- Django REST Framework
- PostgreSQL 15+
- Redis 7+
- Celery
- JWT Authentication
- Gunicorn
- Docker
```

### Frontend
```
- Node.js 20+
- Next.js 14+
- TypeScript 5+
- Tailwind CSS
- shadcn/ui
- TanStack Query (React Query)
- Zustand
- React Hook Form + Zod
- Axios
- Turborepo
```

### DevOps
```
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- Nginx
- AWS S3
- Sentry (Monitoring)
- Pytest (Backend Testing)
- Vitest + Playwright (Frontend Testing)
```

## 📋 Prerequisites

- Python 3.12+
- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- pnpm 8+
- Docker & Docker Compose

## 🛠️ Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd supermarket-management-system

# Copy environment variables
cp .env.example .env

# Start all services
docker-compose up -d

# Backend will be available at http://localhost:8000
# Frontend (Web) at http://localhost:3000
# Admin Dashboard at http://localhost:3001
# POS Terminal at http://localhost:3002
```

### Manual Setup

#### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements/development.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver

# In another terminal, start Celery worker
celery -A config worker -l info

# Start Celery beat (for scheduled tasks)
celery -A config beat -l info
```

#### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
pnpm install

# Start all apps in development mode
pnpm turbo dev

# Or start individual apps:
pnpm --filter web dev       # E-commerce site
pnpm --filter admin dev     # Admin dashboard
pnpm --filter pos dev       # POS terminal
```

## 📁 Project Structure

```
supermarket-management-system/
├── backend/                  # Django Backend
│   ├── config/              # Project settings
│   ├── apps/                # Django apps (modules)
│   ├── core/                # Shared utilities
│   ├── requirements/        # Python dependencies
│   └── manage.py
│
├── frontend/                # Next.js Monorepo
│   ├── apps/
│   │   ├── web/            # Customer e-commerce
│   │   ├── admin/          # Admin dashboard
│   │   └── pos/            # POS terminal
│   ├── packages/
│   │   ├── ui/             # Shared components
│   │   ├── lib/            # API clients, utils
│   │   ├── types/          # TypeScript types
│   │   └── config/         # Shared configs
│   └── turbo.json
│
├── docker/                  # Docker configurations
├── docs/                    # Documentation
├── .github/                 # GitHub Actions workflows
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest --cov=apps/ --cov-report=html
```

### Frontend Tests
```bash
cd frontend

# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage
pnpm test:coverage
```

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI:** http://localhost:8000/api/docs/
- **ReDoc:** http://localhost:8000/api/schema/redoc/

## 🔐 Default Credentials

### Admin User
- **Email:** admin@supermarket.com
- **Password:** admin123

### POS Cashier
- **Email:** cashier@supermarket.com
- **Password:** cashier123

*Note: Change these credentials in production!*

## 🌍 Environment Variables

Key environment variables to configure (see `.env.example` for full list):

```bash
# Django
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=postgresql://user:pass@localhost:5432/supermarket

# Payment Gateways
BKASH_APP_KEY=your-key
NAGAD_MERCHANT_ID=your-id
SSLCOMMERZ_STORE_ID=your-store-id
STRIPE_SECRET_KEY=your-stripe-key

# Courier Services
PATHAO_CLIENT_ID=your-client-id
REDX_API_KEY=your-api-key

# Storage
AWS_ACCESS_KEY_ID=your-aws-key
AWS_STORAGE_BUCKET_NAME=your-bucket
```

## 📈 Development Roadmap

- [x] Phase 1: Project Setup & Configuration
- [ ] Phase 2: Accounts Module (Authentication & User Management)
- [ ] Phase 3: Products Module
- [ ] Phase 4: Inventory Module
- [ ] Phase 5: E-commerce Module
- [ ] Phase 6: POS Module
- [ ] Phase 7: Customers & Loyalty Module
- [ ] Phase 8: Payments Module
- [ ] Phase 9: Delivery Module
- [ ] Phase 10: Reports & Analytics Module
- [ ] Phase 11: Notifications Module
- [ ] Phase 12: System Configuration & Settings
- [ ] Phase 13: Security & Optimization
- [ ] Phase 14: Testing
- [ ] Phase 15: Deployment & DevOps
- [ ] Phase 16: Documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Code Style

### Backend (Python)
- Follow PEP 8
- Use `black` for formatting
- Use `isort` for import sorting
- Use `flake8` for linting
- Type hints required
- Docstrings for all classes/functions

### Frontend (TypeScript)
- ESLint with Next.js config
- Prettier for formatting
- Strict TypeScript mode
- Functional components with hooks
- Named exports for components

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Django REST Framework
- Next.js Team
- shadcn/ui
- All open-source contributors

## 📞 Support

For support, email support@supermarket.com or join our Discord channel.

---

**Built with ❤️ for supermarket management**
