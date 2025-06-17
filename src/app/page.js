// app/page.js (or app/page.tsx)
'use client'
import Head from 'next/head'; 
import Link from 'next/link';
import Image from 'next/image'; 
import { useState, useEffect } from 'react'; 
import { createBrowserClient } from '@supabase/ssr'; // For client-side Supabase

// Navbar Component (Client Component)
const Navbar = ({ appUrl, user }) => { // Pass user to Navbar if it needs to change based on auth state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const loginInUrl = "/login";
  const signUpUrl = "/sign-up"; // Define signUpUrl for consistency

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <span className="text-2xl font-bold text-indigo-600 cursor-pointer">Lyric<span className="text-pink-500">Switch</span></span>
          </Link>
          <nav className="hidden md:flex space-x-6 items-center">
            <a href="#how-it-works" className="nav-link text-slate-600 hover:text-indigo-600 font-medium transition-colors">How It Works</a>
            {user ? (
              <Link href="/song-app"> {/* Or a dashboard link */}
                <span className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-5 rounded-full transition-colors duration-300 ease-in-out cursor-pointer">Go to App</span>
              </Link>
            ) : (
              <>
                <Link href={loginInUrl}>
                  <span className="text-slate-600 hover:text-indigo-600 font-medium transition-colors cursor-pointer">Login</span>
                </Link>
                <Link href={signUpUrl}>
                  <span className="bg-indigo-600 hover:bg-pink-500 text-white font-semibold py-2 px-5 rounded-full transition-colors duration-300 ease-in-out cursor-pointer">Sign Up</span>
                </Link>
              </>
            )}
          </nav>
          <div className="md:hidden">
            <button
              id="mobile-menu-button"
              className="text-slate-500 hover:text-indigo-600 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      <div id="mobile-menu" className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} bg-white shadow-lg`}>
        <a href="#features" className="block py-2 px-4 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600" onClick={() => setMobileMenuOpen(false)}>Features</a>
        {/* ... other mobile links ... */}
        {user ? (
            <Link href="/song-app">
              <span className="block py-3 px-4 text-sm bg-pink-500 text-white text-center font-semibold hover:bg-pink-600 transition-colors cursor-pointer" onClick={() => setMobileMenuOpen(false)}>Go to App</span>
            </Link>
        ) : (
            <>
                <Link href={loginInUrl}>
                <span className="block py-2 px-4 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600" onClick={() => setMobileMenuOpen(false)}>Login</span>
                </Link>
                <Link href={signUpUrl}>
                <span className="block py-3 px-4 text-sm bg-indigo-600 text-white text-center font-semibold hover:bg-pink-500 transition-colors cursor-pointer" onClick={() => setMobileMenuOpen(false)}>Sign Up</span>
                </Link>
            </>
        )}
      </div>
    </header>
  );
};

const HeroSection = ({ signUpUrl }) => ( // Changed appUrl to signUpUrl for clarity
  <section className="hero bg-gradient-to-b from-black via-black to-indigo-500 text-white pt-24 pb-16 sm:pt-32 sm:pb-20 text-center overflow-hidden">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
        Unlock the Music. <span className="block sm:inline">Instantly Translate Songs.</span>
      </h1>
      <p className="text-lg sm:text-xl text-indigo-200 mb-10 max-w-2xl mx-auto"> 
        Dive deeper into the world of music. Understand lyrics in your chosen language!
      </p>
      <Link href={signUpUrl}>
        <span className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer">
          Get Started Free
        </span>
      </Link>
      <div className="mt-12 sm:mt-16 max-w-3xl mx-auto">
        <div className="bg-white p-2 sm:p-0.5 rounded-xl shadow-2xl">
          <img src="/images/display.png" alt="LyricSwitch App Preview" className="rounded-lg w-full h-auto" />
        </div>
      </div>
    </div>
  </section>
);

const HowItWorksSection = () => (
  <section id="how-it-works" className="py-16 sm:py-24 bg-white">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-3">Get Translating in 3 Easy Steps</h2>
        <p className="text-lg text-slate-600 max-w-xl mx-auto">Start your musical journey in minutes.</p>
      </div>
      <div className="flex flex-col md:flex-row justify-around items-start gap-8 md:gap-12">
        <div className="text-center flex-1 max-w-xs mx-auto">
          <div className="bg-pink-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-md">1</div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Enter Song Details</h3>
          <p className="text-slate-600 text-sm">Type in the name of the artist and the song you want to translate.</p>
        </div>
        <div className="text-center flex-1 max-w-xs mx-auto">
          <div className="bg-pink-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-md">2</div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Choose Your Language</h3>
          <p className="text-slate-600 text-sm">Select your desired language for translation from our list.</p>
        </div>
        <div className="text-center flex-1 max-w-xs mx-auto">
          <div className="bg-pink-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-md">3</div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Enjoy & Explore</h3>
          <p className="text-slate-600 text-sm">Receive lyrics, translation, and the music video. Dive in!</p>
        </div>
      </div>
    </div>
  </section>
);


const CallToActionSection = ({ signUpUrl }) => ( 
  <section id="cta" className="py-16 sm:py-24 bg-indigo-600 text-white">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Ready to Experience Music Differently?</h2>
      <p className="text-lg sm:text-xl text-indigo-200 mb-10 max-w-2xl mx-auto">
        Don't let language be a barrier. Start translating your favorite songs today and connect with music on a deeper level.
      </p>
      <Link href={signUpUrl}>
        <span className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-10 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer">
          Try LyricSwitch Now
        </span>
      </Link>
    </div>
  </section>
);

export default function LandingPage() {
  const appUrl = "/song-app"; 
  const signUpUrl = "/sign-up";
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUser(session?.user ?? null);
      setAuthLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setCurrentUser(session?.user ?? null);
      setAuthLoading(false); 
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase.auth]); 

  if (authLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500"></div>
        </div>
    ); 
  }

  return (
    <>
      <Head>
        <title>LyricSwitch - Understand Music in Any Language</title>
        <meta name="description" content="Instantly translate your favorite songs, understand lyrics in any language, and watch official music videos with Song Translator." />
        <link rel="icon" href="/favicon.ico" /> 
      </Head>

      <Navbar appUrl={appUrl} user={currentUser} /> 
      <main>
        <HeroSection signUpUrl={signUpUrl} /> 
        <HowItWorksSection />
        <CallToActionSection signUpUrl={signUpUrl} />
      </main>
    </>
  );
}
