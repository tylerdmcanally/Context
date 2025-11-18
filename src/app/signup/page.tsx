import SignupForm from '@/components/auth/SignupForm';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-semibold mb-8 text-center text-white">Sign Up</h1>
      <SignupForm />
      <p className="mt-4 text-center text-sm text-white/60">
        Already have an account?{' '}
        <Link href="/login" className="text-white hover:text-white/80 underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

