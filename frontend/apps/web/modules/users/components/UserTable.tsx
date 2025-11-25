import { User } from '@/modules/auth/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: number) => void;
  onToggleStatus: (userId: number, isActive: boolean) => void;
  isSuperAdmin?: boolean;
}

export const UserTable = ({
  users,
  onEdit,
  onDelete,
  onToggleStatus,
  isSuperAdmin = false,
}: UserTableProps) => {
  const getRoleBadgeVariant = (role: string) => {
    const variants: Record<string, 'success' | 'error' | 'warning' | 'info' | 'default'> = {
      super_admin: 'error',
      admin: 'error',
      manager: 'info',
      cashier: 'success',
      delivery: 'warning',
      customer: 'default',
    };
    return variants[role] || 'default';
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No users found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Joined
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {user.full_name}
                  </div>
                  <div className="text-sm text-gray-500">@{user.username}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{user.email}</div>
                <div className="text-sm text-gray-500">{user.phone}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  {user.role.replace('_', ' ')}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={user.is_active ? 'success' : 'error'}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(user.date_joined).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(user)}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleStatus(user.id, user.is_active)}
                >
                  {user.is_active ? 'Deactivate' : 'Activate'}
                </Button>
                {isSuperAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(user.id)}
                    className="text-red-600 hover:text-red-900 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
