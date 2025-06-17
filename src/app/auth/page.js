'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../utils/supabase/client'; // adjust path if needed

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const confirmUser = async () => {
      const { error } = await supabase.auth.getSessionFromUrl();

      if (error) {
        console.error('Error confirming sign-up:', error.message);
        router.push('/login');
      } else {
        router.push('/login'); 
      }
    };

    confirmUser();
  }, []);

  return null; // nothing is rendered
}
