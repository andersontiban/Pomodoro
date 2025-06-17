'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../utils/supabase/client'; // adjust path if needed

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClient(); // should be the browser-side client

  useEffect(() => {
    const confirmUser = async () => {
      const { error } = await supabase.auth.getSessionFromUrl();

      if (error) {
        console.error('Error confirming sign-up:', error.message);
        alert('Something went wrong verifying your email.');
      } else {
        // Optional: you can fetch the session if you want to check auth
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Session confirmed:', session);

        // Redirect to dashboard or login page
        router.push('/login'); // change to wherever you want users to go
      }
    };

    confirmUser();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-black">
      <p className="text-xl animate-pulse">Confirming your email...</p>
    </div>
  );
}
