# Quick Test Guide - Phase 1

## ✅ All Tests Passed!

Your Phase 1 setup is working perfectly. Here's how to test the running applications:

## Option 1: Test with Docker (Recommended)

### Start All Services
```bash
make dev
```

This will start:
- PostgreSQL (port 5432)
- Redis (port 6379)
- Django Backend (port 8000)
- Celery Worker
- Celery Beat
- All 3 Frontend Apps (ports 3000, 3001, 3002)

### Create Admin User
```bash
make admin
```
Default credentials:
- Email: admin@supermarket.com
- Phone: +8801712345678
- Password: admin123

### View Logs
```bash
make logs
```

### Stop Services
```bash
make stop
```

## Option 2: Test Locally (Without Docker)

### 1. Start Backend
```bash
cd backend
source venv/bin/activate
python manage.py runserver
# Backend will be at: http://localhost:8000
```

### 2. Create Admin User (in another terminal)
```bash
cd backend
source venv/bin/activate
python manage.py create_admin
```

### 3. Start Frontend (in another terminal)
```bash
cd frontend
pnpm dev
```

This will start:
- Web (E-commerce): http://localhost:3000
- Admin Dashboard: http://localhost:3001
- POS System: http://localhost:3002

## 🧪 Test Each Component

### Test Backend API
```bash
# Check system
cd backend && source venv/bin/activate
python manage.py check

# Run migrations
python manage.py migrate

# Access Django admin
# Open: http://localhost:8000/admin
# Login with admin credentials
```

### Test Frontend Apps

1. **Web App (http://localhost:3000)**
   - Should show e-commerce homepage
   - Check if Tailwind CSS is working
   - Verify navigation and layout

2. **Admin Dashboard (http://localhost:3001)**
   - Should show admin dashboard
   - Check quick stats cards
   - Verify login button

3. **POS System (http://localhost:3002)**
   - Should show POS terminal interface
   - Dark theme with terminal ID
   - Login to start session button

### Test API Client
Open browser console on any frontend app and test:
```javascript
// This will be available after implementing auth endpoints
// For now, verify the page loads without errors
console.log('App loaded successfully!');
```

## 🔍 Verify Components

### Backend Components
- [x] Django 5.0 running
- [x] Custom User model working
- [x] Admin interface accessible
- [x] No migration errors
- [x] All 11 apps initialized

### Frontend Components
- [x] All 3 Next.js apps building
- [x] Tailwind CSS working
- [x] API client package configured
- [x] TypeScript compiling without errors
- [x] Pages rendering correctly

### Infrastructure
- [x] Docker Compose configured
- [x] PostgreSQL ready
- [x] Redis ready
- [x] Nginx config ready
- [x] Celery configured

## 📊 Test Results

```
✓ Backend: Django 5.0 with 11 apps configured
✓ Frontend: Next.js 16 with 3 apps (admin, web, pos)
✓ Infrastructure: Docker, Nginx, PostgreSQL, Redis configured
✓ Tools: pytest, pre-commit hooks, Makefile ready
```

## 🚀 Quick Commands

```bash
# Development
make dev              # Start everything
make dev-local        # Start locally
make stop             # Stop containers
make logs             # View logs

# Database
make migrate          # Run migrations
make makemigrations   # Create migrations
make admin            # Create admin user

# Testing
make test             # Run tests
make test-cov         # Tests with coverage

# Code Quality
make lint             # Run linters
make format           # Format code
make type-check       # Type checking

# Cleanup
make clean            # Clean temp files
make clean-all        # Clean everything
```

## 🎯 What to Test

### Backend Tests
1. Start server: `python manage.py runserver`
2. Visit: http://localhost:8000/admin
3. Login with admin credentials
4. Check User and UserProfile models in admin

### Frontend Tests
1. Start apps: `pnpm dev`
2. Visit all three apps (ports 3000, 3001, 3002)
3. Check if pages load
4. Verify Tailwind CSS styling
5. Check browser console for errors

### Docker Tests
1. Start with Docker: `make dev`
2. Check all services: `docker-compose ps`
3. View logs: `make logs`
4. Test database connection
5. Stop services: `make stop`

## ✅ Success Criteria

Your Phase 1 is working if:
- ✅ Backend server starts without errors
- ✅ Frontend apps build and run on all 3 ports
- ✅ Docker Compose starts all services
- ✅ Admin interface is accessible
- ✅ No TypeScript errors
- ✅ No migration errors

## 🎉 Results

All Phase 1 components are tested and working! You're ready to move to Phase 2:
- Accounts Module API (serializers, viewsets, endpoints)
- Products Module Backend
- Frontend Authentication Pages

## 📝 Notes

- If using SQLite (default), database is at `backend/db.sqlite3`
- For PostgreSQL, update `.env` with `USE_SQLITE=False`
- Frontend API calls will work once backend endpoints are created in Phase 2
- Pre-commit hooks will run automatically before commits

---

**Phase 1 Status**: ✅ Complete and Tested
**Ready for**: Phase 2 Development
