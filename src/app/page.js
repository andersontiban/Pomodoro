// app/page.js (or app/page.tsx)
'use client'
// Components that use hooks like useState or useEffect need to be Client Components.
// We can define them in the same file or import them from separate files.
import Head from 'next/head'; 
import Link from 'next/link';
import Image from 'next/image'; 
import { useState, useEffect } from 'react'; 

// Navbar Component (Client Component)
const Navbar = ({ appUrl }) => {
  // "use client"; // Not needed here if Navbar is defined within a client component or this whole file is client
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const loginInUrl = "/login";

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <span className="text-2xl font-bold text-indigo-600 cursor-pointer">Song<span className="text-pink-500">Translator</span></span>
          </Link>
          <nav className="hidden md:flex space-x-6 items-center">
            <a href="#features" className="nav-link text-slate-600 hover:text-indigo-600 font-medium transition-colors">Features</a>
            <a href="#how-it-works" className="nav-link text-slate-600 hover:text-indigo-600 font-medium transition-colors">How It Works</a>
            <a href="#pricing" className="nav-link text-slate-600 hover:text-indigo-600 font-medium transition-colors">Pricing</a>
            <a href="#contact" className="nav-link text-slate-600 hover:text-indigo-600 font-medium transition-colors">Contact</a>
            <Link href= {loginInUrl}>
              <span className="bg-indigo-600 hover:bg-pink-500 text-white font-semibold py-2 px-5 rounded-full transition-colors duration-300 ease-in-out cursor-pointer">Login</span>
            </Link>
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
        <a href="#how-it-works" className="block py-2 px-4 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
        <a href="#pricing" className="block py-2 px-4 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
        <a href="#contact" className="block py-2 px-4 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600" onClick={() => setMobileMenuOpen(false)}>Contact</a>
        <Link href={appUrl}>
          <span className="block py-3 px-4 text-sm bg-indigo-600 text-white text-center font-semibold hover:bg-pink-500 transition-colors cursor-pointer" onClick={() => setMobileMenuOpen(false)}>Try App</span>
        </Link>
      </div>
    </header>
  );
};

// HeroSection, FeaturesSection, etc. (Server Components by default if no client hooks)

const HeroSection = ({ appUrl }) => (
  // Changed background gradient to shades of green
  <section className="hero bg-gradient-to-b from-black via-black to-indigo-500 text-white pt-24 pb-16 sm:pt-32 sm:pb-20 text-center overflow-hidden">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
        Unlock the Music. <span className="block sm:inline">Instantly Translate Songs.</span>
      </h1>
      {/* Adjusted subtitle text color for better contrast on green if needed */}
      <p className="text-lg sm:text-xl text-green-100 mb-10 max-w-2xl mx-auto"> 
        Dive deeper into the world of music. Understand lyrics in your chosen language, watch official videos,
        and connect with artists like never before.
      </p>
      <Link href="/sign-up">
        {/* CTA button color can remain pink or be adjusted to complement green */}
        <span className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer">
          Get Started Free
        </span>
      </Link>
      <div className="mt-12 sm:mt-16 max-w-3xl mx-auto">
        <div className="bg-white p-2 sm:p-3 rounded-xl shadow-2xl">
          <img src="https://placehold.co/800x450/E2E8F0/4A5568?text=App+Screenshot+Here" alt="Song Translator App Preview" className="rounded-lg w-full h-auto" />
          {/* Example with Next/Image (assuming image is in public/app-preview.png):
          <Image src="/app-preview.png" alt="Song Translator App Preview" width={800} height={450} className="rounded-lg" />
          */}
        </div>
      </div>
    </div>
  </section>
);

const FeaturesSection = () => (
  <section id="features" className="py-16 sm:py-24 bg-slate-50">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-3">Why You'll Love Song Translator</h2>
        <p className="text-lg text-slate-600 max-w-xl mx-auto">Discover a new way to experience music from around the globe.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 text-center">
          <div className="text-4xl text-indigo-500 mb-4">🎤</div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Instant Lyric Translation</h3>
          <p className="text-slate-600 text-sm">Translate song lyrics into multiple languages with just a few clicks. Understand the meaning behind the melodies.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 text-center">
          <div className="text-4xl text-indigo-500 mb-4">▶️</div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">YouTube Video Integration</h3>
          <p className="text-slate-600 text-sm">Watch the official music video directly alongside the original and translated lyrics for a complete experience.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 text-center">
          <div className="text-4xl text-indigo-500 mb-4">🌍</div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Vast Music Library</h3>
          <p className="text-slate-600 text-sm">Access lyrics for millions of songs across various genres and artists, powered by a comprehensive database.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 text-center">
          <div className="text-4xl text-indigo-500 mb-4">💡</div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Simple & Intuitive</h3>
          <p className="text-slate-600 text-sm">No complicated setups. Just enter the artist and song name, pick your language, and enjoy!</p>
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
          <p className="text-slate-600 text-sm">Select your desired language for translation from our extensive list.</p>
        </div>
        <div className="text-center flex-1 max-w-xs mx-auto">
          <div className="bg-pink-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-md">3</div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Enjoy & Explore</h3>
          <p className="text-slate-600 text-sm">Receive instant lyrics, translation, and the official music video. Dive in!</p>
        </div>
      </div>
    </div>
  </section>
);

const PricingSection = ({ appUrl, signUpUrl }) => (
  <section id="pricing" className="py-16 sm:py-24 bg-slate-50">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-3">Find the Perfect Plan</h2>
        <p className="text-lg text-slate-600 max-w-xl mx-auto">Choose a plan that suits your music exploration needs.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col transition-transform duration-300 hover:scale-105">
          <h3 className="text-2xl font-semibold text-indigo-600 mb-2">Free Tier</h3>
          <p className="text-4xl font-bold text-slate-800 mb-1">$0<span className="text-lg font-normal text-slate-500">/month</span></p>
          <p className="text-slate-600 text-sm mb-6 min-h-[40px]">Get a taste of music translation.</p>
          <ul className="space-y-3 text-slate-600 text-sm mb-8 flex-grow">
            <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>Translate up to 3 songs/day</li>
            <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>Access to 5 common languages</li>
            <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>YouTube video integration</li>
          </ul>
          <Link href={signUpUrl || appUrl}>
            <span className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center cursor-pointer block">Start for Free</span>
          </Link>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-2xl flex flex-col ring-2 ring-pink-500 relative transition-transform duration-300 hover:scale-105">
          <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase">Most Popular</div>
          <h3 className="text-2xl font-semibold text-pink-500 mb-2">Pro Monthly</h3>
          <p className="text-4xl font-bold text-slate-800 mb-1">$9.99<span className="text-lg font-normal text-slate-500">/month</span></p>
          <p className="text-slate-600 text-sm mb-6 min-h-[40px]">Unlock the full power of Song Translator.</p>
          <ul className="space-y-3 text-slate-600 text-sm mb-8 flex-grow">
            <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>Unlimited song translations</li>
            <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>Access to all available languages</li>
            <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>Ad-free experience</li>
            <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>Priority email support</li>
            <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>Save favorite translations (Soon)</li>
          </ul>
          <Link href={signUpUrl || appUrl}>
            <span className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center cursor-pointer block">Go Pro</span>
          </Link>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col transition-transform duration-300 hover:scale-105">
          <h3 className="text-2xl font-semibold text-indigo-600 mb-2">Pro Annually</h3>
          <p className="text-4xl font-bold text-slate-800 mb-1">$99<span className="text-lg font-normal text-slate-500">/year</span></p>
          <p className="text-slate-600 text-sm mb-6 min-h-[40px]">Best value for dedicated music lovers.</p>
          <ul className="space-y-3 text-slate-600 text-sm mb-8 flex-grow">
            <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>All Pro features</li>
            <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>Save 20% compared to monthly</li>
            <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>Early access to new features</li>
            <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>Dedicated account manager</li>
          </ul>
          <Link href={signUpUrl || appUrl}>
            <span className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center cursor-pointer block">Choose Annual</span>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const CallToActionSection = ({ appUrl }) => (
  <section id="cta" className="py-16 sm:py-24 bg-indigo-600 text-white">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Ready to Experience Music Differently?</h2>
      <p className="text-lg sm:text-xl text-indigo-200 mb-10 max-w-2xl mx-auto">
        Don't let language be a barrier. Start translating your favorite songs today and connect with music on a deeper level.
      </p>
      <Link href={appUrl}>
        <span className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-10 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer">
          Try Song Translator Now
        </span>
      </Link>
    </div>
  </section>
);


// This is your main page component for the App Router
export default function LandingPage() {
  // Define the URL for your main application page within your Next.js project
  // Example: if your song translator app is at app/song-app/page.js, appUrl would be "/song-app"
  const appUrl = "/song-app"; 
  const signUpUrl = "/signup"; // Example: if you have a dedicated signup page at app/signup/page.js
  const loginInUrl = "/login";

  return (
    <>
      <Head>
        <title>Song Translator - Understand Music in Any Language</title>
        <meta name="description" content="Instantly translate your favorite songs, understand lyrics in any language, and watch official music videos with Song Translator." />
        <link rel="icon" href="/favicon.ico" /> {/* Make sure to have a favicon in your /public folder */}
      </Head>

      <Navbar appUrl={appUrl} />
      <main>
        <HeroSection appUrl={appUrl} />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection appUrl={appUrl} signUpUrl={signUpUrl} />
        <CallToActionSection appUrl={appUrl} />
      </main>
    </>
  );
}
