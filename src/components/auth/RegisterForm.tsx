'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff, LoaderIcon, ShieldCheck, UserPlus } from 'lucide-react';
import Link from 'next/link';

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRegisterMutation } from '@/redux/api/auth.api';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['EMPLOYER', 'CANDIDATE']),
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation();

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'CANDIDATE',
    },
  });

  const onSubmit = async (values: RegisterValues) => {
    const toastId = toast.loading('Creating your account...');
    try {
      await register(values).unwrap();
      toast.success('Registration successful! Please sign in.', { id: toastId });
      router.push('/login');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Registration failed', { id: toastId });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent pointer-events-none" />
      
      <Card className="w-full max-w-[450px] shadow-2xl border-none bg-white/80 backdrop-blur-xl rounded-[2rem] overflow-hidden">
        <CardHeader className="space-y-1 pb-8 pt-10">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-black text-center text-slate-900 tracking-tight">Create Account</CardTitle>
          <CardDescription className="text-center text-slate-500 font-medium">Join our enterprise assessment platform today</CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-bold">Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} className="h-12 bg-white/50 border-slate-200 focus:ring-indigo-600 rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-bold">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@company.com" {...field} className="h-12 bg-white/50 border-slate-200 focus:ring-indigo-600 rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-bold">I am a...</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-white/50 border-slate-200 rounded-xl">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="EMPLOYER">Employer (Recruiter)</SelectItem>
                        <SelectItem value="CANDIDATE">Candidate (Test Taker)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-bold">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" {...field} className="h-12 bg-white/50 border-slate-200 focus:ring-indigo-600 pr-12 rounded-xl" />
                        <Button type="button" variant="ghost" size="sm" className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent text-slate-400" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-indigo-100 transition-all" disabled={isLoading}>
                {isLoading ? <LoaderIcon className="w-5 h-5 animate-spin mr-2" /> : 'Register Now'}
              </Button>
            </form>
          </Form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Already have an account?{' '}
              <Link href="/login" className="text-indigo-600 font-black hover:underline underline-offset-4">Sign In</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
