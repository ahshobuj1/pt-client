import RegisterForm from '@/components/auth/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register | Online Assessment Platform',
  description: 'Create your account to join the assessment platform',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
