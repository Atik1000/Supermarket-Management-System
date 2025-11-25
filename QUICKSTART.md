# Quick Start Guide - Supermarket Management System

## 🚀 Get Started in 5 Minutes

This guide will help you set up the development environment quickly.

---

## Prerequisites Check

Before starting, ensure you have:

```bash
# Check Python version (need 3.12+)
python --version

# Check Node.js version (need 20+)
node --version

# Check Docker
docker --version
docker-compose --version

# Install pnpm if not installed
npm install -g pnpm
```

---

## Option 1: Quick Start with Docker (Recommended)

### Step 1: Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd supermarket-management-system

# Copy environment file
cp .env.example .env

# Edit .env file with your settings (optional for development)
```

### Step 2: Start Everything

```bash
# Build and start all services
docker-compose up -d

# Wait for services to be ready (30-60 seconds)

# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Load sample data (optional)
docker-compose exec backend python manage.py loaddata fixtures/sample_data.json
```

### Step 3: Access Applications

- **Backend API:** http://localhost:8000
- **API Docs (Swagger):** http://localhost:8000/api/docs/
- **E-commerce Site:** http://localhost:3000
- **Admin Dashboard:** http://localhost:3001
- **POS Terminal:** http://localhost:3002

### Default Login Credentials

**Admin:**
- Email: `admin@supermarket.com`
- Password: `admin123`

**Cashier:**
- Email: `cashier@supermarket.com`
- Password: `cashier123`

---

## Option 2: Manual Setup (Development)

### Step 1: Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements/development.txt

# Copy environment file
cp .env.example .env

# Create database (PostgreSQL must be running)
createdb supermarket_db

# Update .env with database credentials
# DATABASE_URL=postgresql://user:password@localhost:5432/supermarket_db

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Load fixtures (optional)
python manage.py loaddata fixtures/sample_data.json

# Start development server
python manage.py runserver
```

### Step 2: Start Celery (New Terminal)

```bash
# Navigate to backend
cd backend
source venv/bin/activate

# Start Celery worker
celery -A config worker -l info

# In another terminal, start Celery beat (for scheduled tasks)
celery -A config beat -l info
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env.local

# Update .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Start all apps in development
pnpm turbo dev

# Or start individual apps:
# pnpm --filter web dev       # E-commerce on :3000
# pnpm --filter admin dev     # Admin on :3001
# pnpm --filter pos dev       # POS on :3002
```

---

## 🧪 Verify Installation

### Test Backend

```bash
# Check API health
curl http://localhost:8000/api/health/

# Login and get token
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@supermarket.com","password":"admin123"}'

# Run tests
cd backend
pytest
```

### Test Frontend

```bash
# Run tests
cd frontend
pnpm test

# Build all apps
pnpm turbo build

# Check for errors
pnpm turbo lint
```

---

## 📂 Project Structure Overview

```
supermarket-management-system/
├── backend/                   # Django Backend
│   ├── config/               # Settings & URLs
│   │   ├── settings/
│   │   │   ├── base.py
│   │   │   ├── development.py
│   │   │   └── production.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── apps/                 # Django Apps
│   │   ├── accounts/         # ✅ Start here
│   │   ├── products/
│   │   ├── inventory/
│   │   ├── pos/
│   │   ├── ecommerce/
│   │   ├── customers/
│   │   ├── payments/
│   │   ├── delivery/
│   │   ├── reports/
│   │   ├── notifications/
│   │   └── settings/
│   ├── core/                 # Shared utilities
│   ├── requirements/
│   └── manage.py
│
├── frontend/                 # Next.js Monorepo
│   ├── apps/
│   │   ├── web/             # Customer site
│   │   ├── admin/           # Admin dashboard
│   │   └── pos/             # POS terminal
│   ├── packages/
│   │   ├── ui/              # Shared components
│   │   ├── lib/             # Utilities
│   │   ├── types/           # TypeScript types
│   │   └── config/          # Configs
│   └── turbo.json
│
├── docker/                   # Docker configs
├── docs/                     # Documentation
├── .github/                  # CI/CD workflows
└── docker-compose.yml
```

---

## 🎯 Development Workflow

### Starting a New Feature

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes
# ... code ...

# Run tests
cd backend && pytest
cd frontend && pnpm test

# Commit with conventional commit format
git commit -m "feat(module): add feature description"

# Push and create PR
git push origin feature/your-feature-name
```

### Database Migrations

```bash
# Create migration
python manage.py makemigrations

# Apply migration
python manage.py migrate

# Rollback migration
python manage.py migrate app_name previous_migration_name
```

### Adding New Dependencies

**Backend:**
```bash
# Add to requirements/base.txt
echo "package-name==version" >> requirements/base.txt

# Install
pip install -r requirements/development.txt
```

**Frontend:**
```bash
# Add to specific app
pnpm --filter web add package-name

# Add to shared package
pnpm --filter @repo/ui add package-name
```

---

## 🔍 Useful Commands

### Backend Commands

```bash
# Create new Django app
python manage.py startapp app_name

# Create superuser
python manage.py createsuperuser

# Open Django shell
python manage.py shell

# Collect static files
python manage.py collectstatic

# Run specific test
pytest apps/products/tests/test_models.py

# Check coverage
pytest --cov=apps/ --cov-report=html

# Format code
black .
isort .

# Lint code
flake8
```

### Frontend Commands

```bash
# Build all apps
pnpm turbo build

# Run dev mode
pnpm turbo dev

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Type check
pnpm type-check

# Lint
pnpm lint

# Format
pnpm format

# Add new app
mkdir -p apps/new-app
cd apps/new-app
pnpm create next-app@latest .
```

### Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend

# Rebuild services
docker-compose up -d --build

# Execute command in container
docker-compose exec backend python manage.py shell

# Access database
docker-compose exec postgres psql -U postgres -d supermarket_db
```

---

## 🐛 Troubleshooting

### Backend Issues

**Migration errors:**
```bash
# Reset migrations (development only!)
python manage.py migrate --fake app_name zero
rm -rf apps/app_name/migrations/
python manage.py makemigrations app_name
python manage.py migrate
```

**Port already in use:**
```bash
# Find process using port 8000
lsof -ti:8000

# Kill the process
kill -9 $(lsof -ti:8000)
```

### Frontend Issues

**Module not found:**
```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Build errors:**
```bash
# Clear Next.js cache
rm -rf .next
pnpm turbo build --force
```

### Database Issues

**Connection refused:**
```bash
# Check PostgreSQL status
# macOS:
brew services list

# Linux:
sudo systemctl status postgresql

# Start PostgreSQL
# macOS:
brew services start postgresql

# Linux:
sudo systemctl start postgresql
```

---

## 📚 Next Steps

1. **Read the Project Plan:** See `PROJECT_PLAN.md` for detailed phase breakdown
2. **Check API Documentation:** Visit http://localhost:8000/api/docs/
3. **Review Architecture:** See the main `README.md`
4. **Start Development:** Begin with Phase 1 in the project plan
5. **Join Community:** [Add your communication channels]

---

## 🆘 Getting Help

- **Documentation:** Check `/docs` folder
- **Issues:** Create GitHub issue
- **Discussions:** GitHub Discussions
- **Email:** support@supermarket.com

---

## ✅ Development Checklist

Before starting development, ensure:

- [ ] All prerequisites installed
- [ ] Docker containers running (or manual setup complete)
- [ ] Backend accessible at http://localhost:8000
- [ ] Frontend apps accessible
- [ ] Can login to admin panel
- [ ] API documentation loads
- [ ] Tests passing
- [ ] Git configured with your details

---

**You're all set! Happy coding! 🎉**

For detailed implementation guides, refer to the original requirements document with GitHub Copilot prompts.
