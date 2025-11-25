'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ErrorAlert } from '@/components/ui/Alert';

const registerSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    phone: z.string().regex(/^\+?1?\d{9,15}$/, 'Invalid phone number'),
    password: z.string().min(1, 'Password is required'),
    password_confirm: z.string(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "Passwords don't match",
    path: ['password_confirm'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const router = useRouter();
  const { register: registerUser, error, clearError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    clearError();

    try {
      // Backend expects password2, not password_confirm
      const { password_confirm, ...rest } = data;
      await registerUser({ ...rest, password2: password_confirm });
      router.push('/');
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {error && <ErrorAlert message={error} />}

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            {...register('first_name')}
            id="first_name"
            type="text"
            label="First Name"
            placeholder="John"
            error={errors.first_name?.message}
          />

          <Input
            {...register('last_name')}
            id="last_name"
            type="text"
            label="Last Name"
            placeholder="Doe"
            error={errors.last_name?.message}
          />
        </div>

        <Input
          {...register('email')}
          id="email"
          type="email"
          label="Email address *"
          autoComplete="email"
          placeholder="john@example.com"
          error={errors.email?.message}
        />

        <Input
          {...register('username')}
          id="username"
          type="text"
          label="Username *"
          autoComplete="username"
          placeholder="johndoe"
          error={errors.username?.message}
        />

        <Input
          {...register('phone')}
          id="phone"
          type="tel"
          label="Phone Number *"
          autoComplete="tel"
          placeholder="+8801712345678"
          error={errors.phone?.message}
        />

        <Input
          {...register('password')}
          id="password"
          type="password"
          label="Password *"
          autoComplete="new-password"
          placeholder="••••••••"
          error={errors.password?.message}
          showPasswordToggle
        />

        <Input
          {...register('password_confirm')}
          id="password_confirm"
          type="password"
          label="Confirm Password *"
          autoComplete="new-password"
          placeholder="••••••••"
          error={errors.password_confirm?.message}
          showPasswordToggle
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        isLoading={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  );
};
