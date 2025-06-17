// components/LogoutButton.js
"use client";

import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { FaSignOutAlt } from 'react-icons/fa';

export default function LogoutButton({ className }) {
  const router = useRouter();
  // Initialize Supabase client directly within the component
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
      // Optionally, show an error message to the user via a toast or alert
    } else {
      router.push('/');
      router.refresh(); // Ensure server components and middleware re-evaluate
    }
  };

  // Added ml-auto and cursor-pointer to the default class string
  // Changed rounded-xl to rounded-full for a more oval/circular shape
  const defaultClasses = "ml-auto flex items-center text-sm sm:text-base bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-3 sm:px-4 rounded-full transition-colors duration-200 cursor-pointer";

  return (
    <button
      onClick={handleLogout}
      className={className || defaultClasses} // If className is provided, it overrides the default
      aria-label="Logout"
    >
    
      Logout
    </button>
  );
}
