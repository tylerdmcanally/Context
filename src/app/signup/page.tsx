import SignupForm from '@/components/auth/SignupForm';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Sign Up</h1>
      <SignupForm />
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 hover:text-blue-800">
          Log in
        </Link>
      </p>
    </div>
  );
}

