# Frontend - Supermarket Management System

This is a Next.js 14+ monorepo managed with Turborepo, containing three applications.

## Applications

### 1. **Admin Dashboard** (`apps/admin`)
- **Port**: 3001
- **Purpose**: Complete administrative interface for managing the supermarket
- **Features**: Product management, inventory control, user management, reports, settings

### 2. **E-commerce Website** (`apps/web`)
- **Port**: 3000
- **Purpose**: Customer-facing online shopping platform
- **Features**: Product browsing, cart, checkout, order tracking, user account

### 3. **POS System** (`apps/pos`)
- **Port**: 3002
- **Purpose**: Point of Sale terminal for in-store transactions
- **Features**: Quick product search, barcode scanning, payment processing, receipt printing

## Shared Packages

- **`@repo/ui`**: Shared React components
- **`@repo/api-client`**: Centralized API client with JWT authentication
- **`@repo/eslint-config`**: Shared ESLint configuration
- **`@repo/typescript-config`**: Shared TypeScript configuration

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **API Client**: Axios with interceptors
- **Monorepo**: Turborepo
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9.0.0+

### Installation

\`\`\`bash
# Install dependencies
pnpm install
\`\`\`

### Development

\`\`\`bash
# Run all apps in development mode
pnpm dev

# Run specific app
pnpm dev --filter=admin
pnpm dev --filter=web
pnpm dev --filter=pos

# Build all apps
pnpm build

# Lint all apps
pnpm lint

# Type checking
pnpm check-types
\`\`\`

### Environment Variables

Create \`.env.local\` files in each app directory:

\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=Your App Name
\`\`\`

## Application URLs

- **Admin Dashboard**: http://localhost:3001
- **E-commerce Web**: http://localhost:3000
- **POS System**: http://localhost:3002

## API Integration

The \`@repo/api-client\` package provides:

- Axios instance with automatic JWT token handling
- Token refresh on 401 errors
- Request/response interceptors
- Type-safe API methods

### Usage Example

\`\`\`typescript
import { apiClient } from '@repo/api-client';

// Login
const { access, refresh, user } = await apiClient.login(email, password);

// Get current user
const user = await apiClient.getCurrentUser();

// Logout
apiClient.logout();
\`\`\`
