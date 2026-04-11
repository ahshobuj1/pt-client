'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';
import { Eye, EyeOff, LoaderIcon, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppDispatch } from '@/redux/hooks';
import { setUser, TUser } from '@/redux/features/auth/authSlice';
import { useLoginMutation } from '@/redux/api/auth.api';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginValues) => {
    const toastId = toast.loading('Signing you in...');
    try {
      const response = await login(values).unwrap();
      const apiData = response.data || response;
      const token = apiData.accessToken;
      const apiUser = apiData.user;

      const decoded: any = jwtDecode(token);
      const user: TUser = {
        id: apiUser?.id || decoded.id || 'mock-id',
        email: apiUser?.email || decoded.email || values.email,
        role: (apiUser?.role || decoded.role || 'CANDIDATE').toUpperCase() as 'EMPLOYER' | 'CANDIDATE',
      };

      dispatch(setUser({ user, token }));
      toast.success('Login successful', { id: toastId });

      if (user.role === 'EMPLOYER') {
        router.push('/employer/dashboard');
      } else if (user.role === 'CANDIDATE') {
        router.push('/candidate/dashboard');
      } else {
        router.push('/');
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Invalid credentials', { id: toastId });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent pointer-events-none" />

      <Card className="w-full max-w-[420px] shadow-2xl border-none bg-white/80 backdrop-blur-xl rounded-[2rem] overflow-hidden">
        <CardHeader className="space-y-1 pb-8 pt-10">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-black text-center text-slate-900 tracking-tight">Welcome Back</CardTitle>
          <CardDescription className="text-center text-slate-500 font-medium">
            Enter your credentials to access the assessment platform
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-bold">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="name@company.com"
                        {...field}
                        className="h-12 bg-white/50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all rounded-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-slate-700 font-bold">Password</FormLabel>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          {...field}
                          className="h-12 bg-white/50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all pr-12 rounded-xl"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent text-slate-400 hover:text-slate-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoaderIcon className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-indigo-600 font-black hover:underline underline-offset-4">
                Register here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="fixed bottom-6 text-slate-400 text-sm font-medium">
        &copy; {new Date().getFullYear()} Online Assessment Platform. All rights reserved.
      </div>
    </div>
  );
}
