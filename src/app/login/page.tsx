import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-semibold mb-8 text-center text-white">Log In</h1>
      <LoginForm />
      <p className="mt-4 text-center text-sm text-white/60">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-white hover:text-white/80 underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
