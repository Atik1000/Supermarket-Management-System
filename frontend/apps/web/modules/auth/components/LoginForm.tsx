'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ErrorAlert } from '@/components/ui/Alert';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const router = useRouter();
  const { login, error, clearError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    clearError();

    try {
      await login(data);
      router.push('/');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {error && <ErrorAlert message={error} />}

      <div className="space-y-4">
        <Input
          {...register('email')}
          id="email"
          type="email"
          label="Email address"
          autoComplete="email"
          placeholder="john@example.com"
          error={errors.email?.message}
        />

        <Input
          {...register('password')}
          id="password"
          type="password"
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
          error={errors.password?.message}
          showPasswordToggle
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <Link
            href="/forgot-password"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Forgot your password?
          </Link>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        isLoading={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
};
