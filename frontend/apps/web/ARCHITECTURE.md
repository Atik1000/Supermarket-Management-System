# Frontend Architecture

## 📁 Project Structure

```
frontend/apps/web/
├── app/                    # Next.js App Router pages
│   ├── login/
│   ├── register/
│   ├── profile/
│   ├── admin/
│   │   └── users/
│   └── ...
├── modules/                # Feature-based modules
│   ├── auth/              # Authentication module
│   │   ├── components/    # Auth-specific components
│   │   ├── hooks/         # Auth-specific hooks
│   │   └── types/         # Auth types & interfaces
│   └── users/             # User management module
│       ├── components/    # User management components
│       ├── hooks/         # User management hooks
│       └── types/         # User types & interfaces
├── components/            # Shared/reusable components
│   └── ui/               # UI component library
│       ├── Input.tsx
│       ├── Button.tsx
│       ├── Modal.tsx
│       ├── Alert.tsx
│       ├── Badge.tsx
│       └── Loading.tsx
└── lib/                   # Core utilities
    ├── api-client.ts
    └── store/
        └── auth-store.ts
```

## 🏗️ Module Structure

Each feature module follows this consistent structure:

```
modules/[feature-name]/
├── components/          # Feature-specific components
│   ├── ComponentA.tsx
│   └── ComponentB.tsx
├── hooks/              # Feature-specific custom hooks
│   ├── useFeature.ts
│   └── useFeatureData.ts
├── types/              # TypeScript types/interfaces
│   └── index.ts
└── index.ts            # Barrel export file
```

### Benefits:
- **Separation of Concerns**: Each module is self-contained
- **Reusability**: Shared components in `/components/ui`
- **Type Safety**: Centralized types per module
- **Maintainability**: Easy to locate and update code
- **Scalability**: Add new modules without affecting existing ones

## 📦 Modules

### Auth Module (`modules/auth/`)

Handles all authentication-related functionality.

**Components:**
- `LoginForm` - Login form with validation
- `RegisterForm` - Registration form with validation
- `ProtectedRoute` - Route protection wrapper with role-based access

**Hooks:**
- `useAuth()` - Authentication state and actions
  ```typescript
  const { 
    user, 
    isAuthenticated, 
    login, 
    register, 
    logout,
    hasRole,
    isAdmin 
  } = useAuth();
  ```

**Types:**
- `User` - User entity
- `UserProfile` - User profile data
- `UserRole` - Role type
- `LoginCredentials` - Login payload
- `RegisterData` - Registration payload
- `AuthTokens` - JWT tokens

### Users Module (`modules/users/`)

Manages user CRUD operations and admin functionality.

**Components:**
- `UserTable` - Data table with user list
- `UserFiltersBar` - Search and role filter
- `UserFormModal` - Create/edit user modal

**Hooks:**
- `useUsers()` - User management operations
  ```typescript
  const { 
    users, 
    loading, 
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus 
  } = useUsers();
  ```

**Types:**
- `UserFormData` - User form fields
- `UserFilters` - Filter state
- `UseUsersResult` - Hook return type

## 🎨 UI Components (`components/ui/`)

Reusable, styled UI components used across the application.

### Input
```tsx
<Input
  type="email"
  label="Email"
  placeholder="john@example.com"
  error={errors.email?.message}
  showPasswordToggle  // For password fields
/>
```

### Button
```tsx
<Button
  variant="primary"  // primary | secondary | danger | ghost
  size="md"          // sm | md | lg
  isLoading={loading}
  onClick={handleClick}
>
  Submit
</Button>
```

### Modal
```tsx
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Modal Title"
  size="md"  // sm | md | lg | xl
>
  {children}
</Modal>
```

### Alert
```tsx
<ErrorAlert message="Something went wrong" />
<SuccessAlert message="Operation successful" />
```

### Badge
```tsx
<Badge
  variant="success"  // success | error | warning | info | default
  size="md"          // sm | md
>
  Active
</Badge>
```

### Loading
```tsx
<LoadingSpinner size="md" />
<LoadingPage message="Loading..." />
```

## 🔧 Usage Examples

### Creating a New Page with Auth

```tsx
'use client';

import { ProtectedRoute } from '@/modules/auth';
import { useAuth } from '@/modules/auth';

export default function MyPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute requiredRoles={['admin', 'manager']}>
      <div>
        <h1>Welcome {user?.first_name}</h1>
      </div>
    </ProtectedRoute>
  );
}
```

### Creating a New Feature Module

1. Create module directory structure:
```bash
mkdir -p modules/products/{components,hooks,types}
```

2. Define types (`modules/products/types/index.ts`):
```typescript
export interface Product {
  id: number;
  name: string;
  price: number;
}
```

3. Create hook (`modules/products/hooks/useProducts.ts`):
```typescript
export const useProducts = () => {
  // Implementation
};
```

4. Create components (`modules/products/components/ProductList.tsx`):
```typescript
export const ProductList = () => {
  // Implementation
};
```

5. Create barrel export (`modules/products/index.ts`):
```typescript
export * from './components/ProductList';
export * from './hooks/useProducts';
export * from './types';
```

### Using Shared Components

```tsx
import { Button, Input, Modal } from '@/components/ui';

export const MyForm = () => {
  return (
    <form>
      <Input label="Name" />
      <Button type="submit">Save</Button>
    </form>
  );
};
```

## 🎯 Best Practices

### 1. Component Organization
- Keep components small and focused
- Extract reusable logic into hooks
- Use composition over inheritance

### 2. Type Safety
- Define all types in the module's `types/` directory
- Use TypeScript interfaces for props
- Export types from barrel file

### 3. State Management
- Use Zustand for global state (auth, theme)
- Use local state for component-specific data
- Create custom hooks for complex state logic

### 4. Naming Conventions
- Components: PascalCase (`UserTable`)
- Hooks: camelCase with `use` prefix (`useUsers`)
- Files: Match component name (`UserTable.tsx`)
- Types: PascalCase (`UserFormData`)

### 5. Import Paths
- Use path aliases: `@/modules/auth`
- Import from barrel files: `@/modules/auth` instead of `@/modules/auth/hooks/useAuth`
- Keep imports organized and grouped

## 🚀 Migration Guide

### Old Structure → New Structure

**Before:**
```tsx
import { useAuthStore } from '@/lib/store/auth-store';
import ProtectedRoute from '@/components/auth/protected-route';
```

**After:**
```tsx
import { useAuth, ProtectedRoute } from '@/modules/auth';
```

**Before:**
```tsx
// Inline form with validation
<form>
  <input type="email" ... />
  {showPassword && <button>Toggle</button>}
</form>
```

**After:**
```tsx
import { Input, Button } from '@/components/ui';

<form>
  <Input type="email" label="Email" showPasswordToggle />
  <Button type="submit">Submit</Button>
</form>
```

## 📝 Code Quality

### TypeScript
- All components and hooks are fully typed
- No `any` types (except in error handling)
- Proper interface definitions

### Component Props
- Use `interface` for props
- Document complex props with JSDoc
- Provide sensible defaults

### Error Handling
- Graceful error states in UI
- Try-catch blocks in async operations
- User-friendly error messages

## 🧪 Testing Strategy

### Unit Tests
- Test hooks in isolation
- Test component rendering
- Test user interactions

### Integration Tests
- Test module workflows
- Test API integrations
- Test auth flows

### E2E Tests
- Test critical user journeys
- Test across modules
- Test with real backend

## 📚 Further Reading

- [Next.js App Router](https://nextjs.org/docs/app)
- [React Hooks](https://react.dev/reference/react)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [Component Design Patterns](https://www.patterns.dev/)
