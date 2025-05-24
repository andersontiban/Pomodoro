// app/login/page.js (or .tsx)
"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Head from 'next/head';
import { loginAction } from '@/actions/users'; // Make sure this path is correct

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // You can use isPending instead of loading

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); 

    if (!/\S+@\S+\.\S+/.test(email)) {
        setError("Please enter a valid email address.");
        setLoading(false);
        return;
    }
    if (!password) {
        setError("Password is required.");
        setLoading(false);
        return;
    }

    const formData = new FormData(e.target); 

    startTransition(async () => {
      try {
        const result = await loginAction(formData); 

        if (result.success && result.user) { 
          console.log("Login successful! User:", result.user.email);
          // Clear form fields on successful login
          setEmail('');
          setPassword('');
          router.push('/song-app'); // Redirect to the protected app page
          router.refresh(); // VERY IMPORTANT: This re-fetches server data and re-runs middleware
                            // ensuring the new session cookie is recognized.
        } else {
          setError(result.error || "Login failed. Please check your credentials.");
          console.error("Login Action Error:", result.error);
        }
      } catch (e) { 
        console.error("Error calling loginAction:", e);
        setError("An unexpected error occurred during login. Please try again.");
      } finally {
        setLoading(false); 
      }
    });
  };

  return (
    <>
      <Head>
        <title>Login - Song Translator</title>
      </Head>
      <div className="min-h-screen w-full bg-gradient-to-b from-black via-black to-indigo-500 flex flex-col items-center justify-center p-4 selection:bg-pink-500 selection:text-white">
        <div className="w-full max-w-md bg-slate-800/70 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-indigo-700/50">
          <div className="text-center mb-8">
            <Link href="/">
              <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500 cursor-pointer">
                Song Translator
              </span>
            </Link>
            <h2 className="mt-2 text-xl text-indigo-300">Log in to your account</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email_login" className="block text-sm font-medium text-indigo-300 mb-1">
                Email address
              </label>
              <input
                id="email_login" 
                name="email" 
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-700 bg-slate-900 text-slate-100 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition placeholder-slate-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password_login" className="block text-sm font-medium text-indigo-300 mb-1">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-medium text-indigo-400 hover:text-pink-400 transition-colors">
                    Forgot your password?
                  </a>
                </div>
              </div>
              <input
                id="password_login" 
                name="password" 
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-700 bg-slate-900 text-slate-100 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition placeholder-slate-500"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-900/30 p-3 rounded-md border border-red-700">{error}</p>
            )}

            <div>
              <button
                type="submit"
                disabled={loading || isPending} 
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-pink-500 transition-all duration-300 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {(loading || isPending) ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Log In'}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Don&apos;t have an account?{' '}
            <Link href="/signup">
              <span className="font-medium text-indigo-400 hover:text-pink-400 cursor-pointer transition-colors">
                Sign up
              </span>
            </Link>
          </p>
        </div>
         <p className="mt-8 text-center text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Song Translator. All rights reserved.
        </p>
      </div>
    </>
  );
}
