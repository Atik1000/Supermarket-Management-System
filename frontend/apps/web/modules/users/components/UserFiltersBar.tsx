import { UserFilters } from '../types';
import { UserRole } from '@/modules/auth/types';
import { Input } from '@/components/ui/Input';

interface UserFiltersProps {
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
}

export const UserFiltersBar = ({ filters, onFiltersChange }: UserFiltersProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="text"
          label="Search"
          placeholder="Search by email, username, or name..."
          value={filters.search}
          onChange={(e) =>
            onFiltersChange({ ...filters, search: e.target.value })
          }
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Role
          </label>
          <select
            value={filters.role}
            onChange={(e) =>
              onFiltersChange({ ...filters, role: e.target.value as UserRole | 'all' })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="cashier">Cashier</option>
            <option value="delivery">Delivery</option>
            <option value="customer">Customer</option>
          </select>
        </div>
      </div>
    </div>
  );
};
