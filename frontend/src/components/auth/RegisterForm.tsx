import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { useRegister } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const registerSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
    phoneNumber: z
      .string()
      .min(1, 'Phone number is required')
      .regex(/^\+?[1-9]\d{6,14}$/, 'Please enter a valid phone number'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must include an uppercase letter')
      .regex(/[a-z]/, 'Password must include a lowercase letter')
      .regex(/[0-9]/, 'Password must include a number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    const { confirmPassword: _, ...payload } = data;
    registerMutation.mutate(payload, {
      onError: (error: unknown) => {
        const message =
          error instanceof Error ? error.message : 'Registration failed. Please try again.';
        toast.error(message);
      },
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-bank-text">Create your account</h1>
        <p className="text-bank-muted mt-1">Join ZingyBank and start banking smarter</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            placeholder="John"
            icon={<User className="w-5 h-5" />}
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <Input
            label="Last Name"
            placeholder="Doe"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          icon={<Mail className="w-5 h-5" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="+1234567890"
          icon={<Phone className="w-5 h-5" />}
          error={errors.phoneNumber?.message}
          {...register('phoneNumber')}
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Create a strong password"
          icon={<Lock className="w-5 h-5" />}
          error={errors.password?.message}
          {...register('password')}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-bank-muted hover:text-bank-text transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          }
        />

        <Input
          label="Confirm Password"
          type={showConfirm ? 'text' : 'password'}
          placeholder="Re-enter your password"
          icon={<Lock className="w-5 h-5" />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="text-bank-muted hover:text-bank-text transition-colors"
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          }
        />

        <Button
          type="submit"
          className="w-full"
          size="lg"
          loading={registerMutation.isPending}
        >
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-bank-muted">
        Already have an account?{' '}
        <Link to="/login" className="text-zingy-600 font-semibold hover:text-zingy-700 transition-colors">
          Sign In
        </Link>
      </p>
    </div>
  );
};
