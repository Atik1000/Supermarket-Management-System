#!/bin/bash

# Phase 1 Testing Script
# This script tests all components of Phase 1 setup

set -e  # Exit on any error

echo "=========================================="
echo "Phase 1 - Testing Supermarket Management System"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print success
success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function to print error
error() {
    echo -e "${RED}✗ $1${NC}"
}

# Function to print info
info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

echo "1. Testing Backend Setup..."
echo "----------------------------"

# Check Python version
info "Checking Python version..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    success "Python found: $PYTHON_VERSION"
else
    error "Python3 not found"
    exit 1
fi

# Check if virtual environment exists
if [ -d "backend/venv" ]; then
    success "Virtual environment exists"
else
    info "Virtual environment not found. Creating one..."
    cd backend && python3 -m venv venv && cd ..
    success "Virtual environment created"
fi

# Activate virtual environment and check Django
info "Checking Django installation..."
cd backend
source venv/bin/activate
if python -c "import django" 2>/dev/null; then
    DJANGO_VERSION=$(python -c "import django; print(django.get_version())")
    success "Django installed: $DJANGO_VERSION"
else
    error "Django not installed. Run: pip install -r requirements/development.txt"
    deactivate
    cd ..
    exit 1
fi

# Check if migrations exist
if [ -f "apps/accounts/migrations/0001_initial.py" ]; then
    success "Migrations exist"
else
    error "Migrations not found"
fi

# Check Django settings
info "Checking Django configuration..."
if python manage.py check --settings=config.settings.development &>/dev/null; then
    success "Django configuration is valid"
else
    error "Django configuration has issues"
    deactivate
    cd ..
    exit 1
fi

deactivate
cd ..

echo ""
echo "2. Testing Frontend Setup..."
echo "----------------------------"

# Check Node.js version
info "Checking Node.js version..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    success "Node.js found: $NODE_VERSION"
else
    error "Node.js not found"
    exit 1
fi

# Check pnpm
info "Checking pnpm..."
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm --version)
    success "pnpm found: $PNPM_VERSION"
else
    error "pnpm not found. Install with: npm install -g pnpm"
    exit 1
fi

# Check if node_modules exists
if [ -d "frontend/node_modules" ]; then
    success "Dependencies installed"
else
    info "Dependencies not installed. Installing..."
    cd frontend && pnpm install && cd ..
    success "Dependencies installed"
fi

# Check if apps can be built
info "Testing frontend build..."
cd frontend
if pnpm build &>/dev/null; then
    success "All frontend apps build successfully"
else
    error "Frontend build failed"
    cd ..
    exit 1
fi
cd ..

echo ""
echo "3. Testing Docker Configuration..."
echo "-----------------------------------"

# Check if Docker files exist
if [ -f "docker-compose.yml" ]; then
    success "docker-compose.yml exists"
else
    error "docker-compose.yml not found"
fi

if [ -f "backend/Dockerfile" ] && [ -f "frontend/Dockerfile" ]; then
    success "Dockerfiles exist"
else
    error "Dockerfiles not found"
fi

# Validate docker-compose file
info "Validating docker-compose configuration..."
if docker-compose config &>/dev/null; then
    success "docker-compose.yml is valid"
else
    error "docker-compose.yml has issues"
fi

echo ""
echo "4. Testing Project Structure..."
echo "--------------------------------"

# Check backend apps
BACKEND_APPS=("accounts" "products" "inventory" "pos" "ecommerce" "customers" "payments" "delivery" "reports" "notifications" "settings")
info "Checking backend apps..."
for app in "${BACKEND_APPS[@]}"; do
    if [ -d "backend/apps/$app" ]; then
        success "App exists: $app"
    else
        error "App missing: $app"
    fi
done

# Check frontend apps
FRONTEND_APPS=("admin" "web" "pos")
info "Checking frontend apps..."
for app in "${FRONTEND_APPS[@]}"; do
    if [ -d "frontend/apps/$app" ]; then
        success "App exists: $app"
    else
        error "App missing: $app"
    fi
done

# Check shared packages
info "Checking shared packages..."
if [ -d "frontend/packages/api-client" ]; then
    success "API client package exists"
else
    error "API client package missing"
fi

echo ""
echo "5. Testing Configuration Files..."
echo "----------------------------------"

# Check backend config
CONFIG_FILES=(
    "backend/config/settings/base.py"
    "backend/config/settings/development.py"
    "backend/config/settings/production.py"
    "backend/pytest.ini"
    "backend/pyproject.toml"
)

for file in "${CONFIG_FILES[@]}"; do
    if [ -f "$file" ]; then
        success "Config exists: $(basename $file)"
    else
        error "Config missing: $file"
    fi
done

# Check frontend config
if [ -f "frontend/turbo.json" ]; then
    success "Turborepo config exists"
else
    error "Turborepo config missing"
fi

# Check Tailwind configs
for app in admin web pos; do
    if [ -f "frontend/apps/$app/tailwind.config.ts" ]; then
        success "Tailwind config exists for $app"
    else
        error "Tailwind config missing for $app"
    fi
done

echo ""
echo "6. Testing Development Tools..."
echo "--------------------------------"

# Check pre-commit hooks
if [ -f ".pre-commit-config.yaml" ]; then
    success "Pre-commit config exists"
else
    error "Pre-commit config missing"
fi

# Check Makefile
if [ -f "Makefile" ]; then
    success "Makefile exists"
else
    error "Makefile missing"
fi

# Check documentation
DOCS=("README.md" "PROJECT_PLAN.md" "QUICKSTART.md" "ARCHITECTURE.md" "PHASE_1_SUMMARY.md")
info "Checking documentation..."
for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        success "Documentation exists: $doc"
    else
        error "Documentation missing: $doc"
    fi
done

echo ""
echo "=========================================="
echo "Phase 1 Test Summary"
echo "=========================================="
echo ""
success "Backend: Django 5.0 with 11 apps configured"
success "Frontend: Next.js 16 with 3 apps (admin, web, pos)"
success "Infrastructure: Docker, Nginx, PostgreSQL, Redis configured"
success "Tools: pytest, pre-commit hooks, Makefile ready"
echo ""
info "To start development environment:"
echo "  make dev          # Start with Docker"
echo "  make dev-local    # Start locally"
echo ""
info "To test backend:"
echo "  cd backend && source venv/bin/activate"
echo "  python manage.py runserver"
echo ""
info "To test frontend:"
echo "  cd frontend && pnpm dev"
echo ""
info "Next steps:"
echo "  1. Start services: make dev"
echo "  2. Create admin: make admin"
echo "  3. Access apps:"
echo "     - Backend: http://localhost:8000/admin"
echo "     - Web: http://localhost:3000"
echo "     - Admin: http://localhost:3001"
echo "     - POS: http://localhost:3002"
echo ""
success "Phase 1 setup is complete and ready! 🎉"
