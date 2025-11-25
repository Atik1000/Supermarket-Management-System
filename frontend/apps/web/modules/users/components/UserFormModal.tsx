import { useState } from 'react';
import { UserFormData } from '../types';
import { UserRole } from '@/modules/auth/types';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ErrorAlert } from '@/components/ui/Alert';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => Promise<void>;
  initialData?: Partial<UserFormData>;
  mode: 'create' | 'edit';
  isSuperAdmin?: boolean;
}

export const UserFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
  isSuperAdmin = false,
}: UserFormModalProps) => {
  const [formData, setFormData] = useState<UserFormData>({
    email: initialData?.email || '',
    username: initialData?.username || '',
    phone: initialData?.phone || '',
    password: '',
    password_confirm: '',
    first_name: initialData?.first_name || '',
    last_name: initialData?.last_name || '',
    role: initialData?.role || 'customer',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'create') {
      if (formData.password !== formData.password_confirm) {
        setError("Passwords don't match");
        return;
      }
      if (!formData.password) {
        setError('Password is required');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
      setFormData({
        email: '',
        username: '',
        phone: '',
        password: '',
        password_confirm: '',
        first_name: '',
        last_name: '',
        role: 'customer',
      });
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === 'create' ? 'Create New User' : 'Edit User'}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        {error && <ErrorAlert message={error} />}

        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="text"
              label="First Name"
              value={formData.first_name}
              onChange={(e) =>
                setFormData({ ...formData, first_name: e.target.value })
              }
            />
            <Input
              type="text"
              label="Last Name"
              value={formData.last_name}
              onChange={(e) =>
                setFormData({ ...formData, last_name: e.target.value })
              }
            />
          </div>

          <Input
            type="email"
            label="Email *"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <Input
            type="text"
            label="Username *"
            required
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />

          <Input
            type="tel"
            label="Phone *"
            required
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <select
              required
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value as UserRole })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="customer">Customer</option>
              <option value="cashier">Cashier</option>
              <option value="delivery">Delivery</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
              {isSuperAdmin && <option value="super_admin">Super Admin</option>}
            </select>
          </div>

          {mode === 'create' && (
            <>
              <Input
                type="password"
                label="Password *"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                showPasswordToggle
              />

              <Input
                type="password"
                label="Confirm Password *"
                required
                value={formData.password_confirm}
                onChange={(e) =>
                  setFormData({ ...formData, password_confirm: e.target.value })
                }
                showPasswordToggle
              />
            </>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            {mode === 'create' ? 'Create User' : 'Update User'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
