.PHONY: help setup dev prod stop clean migrate test lint format

help:
	@echo "Supermarket Management System - Available Commands"
	@echo ""
	@echo "Setup:"
	@echo "  make setup        - Initial project setup"
	@echo "  make install      - Install dependencies"
	@echo ""
	@echo "Development:"
	@echo "  make dev          - Start development environment with Docker"
	@echo "  make dev-local    - Start local development (no Docker)"
	@echo "  make stop         - Stop all containers"
	@echo "  make logs         - View container logs"
	@echo ""
	@echo "Database:"
	@echo "  make migrate      - Run database migrations"
	@echo "  make makemigrations - Create new migrations"
	@echo "  make admin        - Create superuser"
	@echo ""
	@echo "Testing:"
	@echo "  make test         - Run tests"
	@echo "  make test-cov     - Run tests with coverage"
	@echo ""
	@echo "Code Quality:"
	@echo "  make lint         - Run linters"
	@echo "  make format       - Format code"
	@echo "  make type-check   - Run type checking"
	@echo ""
	@echo "Production:"
	@echo "  make prod         - Start production environment"
	@echo "  make build        - Build production images"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clean        - Clean temporary files"
	@echo "  make clean-all    - Clean everything including volumes"

setup:
	@echo "Setting up the project..."
	cd backend && python -m venv venv
	cd backend && source venv/bin/activate && pip install -r requirements/development.txt
	cd frontend && pnpm install
	@echo "Setup complete!"

install:
	@echo "Installing dependencies..."
	cd backend && pip install -r requirements/development.txt
	cd frontend && pnpm install

dev:
	@echo "Starting development environment with Docker..."
	docker-compose up -d
	@echo "Services started! Backend: http://localhost:8000 | Frontend: http://localhost:3000"

dev-local:
	@echo "Starting local development..."
	cd backend && python manage.py runserver &
	cd frontend && pnpm dev &

stop:
	@echo "Stopping containers..."
	docker-compose down

logs:
	docker-compose logs -f

migrate:
	docker-compose exec backend python manage.py migrate

makemigrations:
	docker-compose exec backend python manage.py makemigrations

admin:
	docker-compose exec backend python manage.py create_admin

test:
	cd backend && pytest

test-cov:
	cd backend && pytest --cov --cov-report=html

lint:
	@echo "Running linters..."
	cd backend && flake8 apps/
	cd backend && pylint apps/
	cd frontend && pnpm lint

format:
	@echo "Formatting code..."
	cd backend && black apps/
	cd backend && isort apps/
	cd frontend && pnpm format

type-check:
	cd backend && mypy apps/
	cd frontend && pnpm check-types

prod:
	@echo "Starting production environment..."
	docker-compose -f docker-compose.prod.yml up -d

build:
	@echo "Building production images..."
	docker-compose -f docker-compose.prod.yml build

clean:
	@echo "Cleaning temporary files..."
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type d -name ".mypy_cache" -exec rm -rf {} +
	cd frontend && rm -rf .next node_modules/.cache

clean-all: clean stop
	@echo "Cleaning everything..."
	docker-compose down -v
	rm -rf backend/venv
	rm -rf frontend/node_modules
