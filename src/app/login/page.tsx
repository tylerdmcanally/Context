import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Log In</h1>
      <LoginForm />
      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link href="/signup" className="text-blue-600 hover:text-blue-800">
          Sign up
        </Link>
      </p>
    </div>
  );
}

