// app/song-app/page.js
"use client"; // This is crucial for components with interactivity and hooks

import { useState, useEffect } from 'react';
import Head from 'next/head'; // Optional: For setting page title specifically for this page

// You might want to install react-icons if you haven't: npm install react-icons
import { FaArrowLeft } from 'react-icons/fa'; 

// If you have a separate Pricing component, you'd import it.
// For now, I'll comment it out as it wasn't part of the core app logic you shared first.
// import Pricing from '../../components/pricing'; // Adjust path if you have this

export default function SongTranslatorApp() {
  const [resultsReady, setResultsReady] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [artist, setArtist] = useState('');
  const [song, setSong] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [translatedLyrics, setTranslatedLyrics] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('es'); // Default to Spanish

  // API Endpoints (these would be in your Next.js API routes, e.g., app/api/youtube/route.js)
  const LYRICS_API_URL = 'https://api.lyrics.ovh/v1/'; // External API
  const YOUTUBE_API_ROUTE = '/api/youtube'; // Your Next.js backend route
  const TRANSLATE_API_ROUTE = '/api/translate'; // Your Next.js backend route

  const handleSearch = async (e) => {
    e.preventDefault();
    setLyrics('');
    setTranslatedLyrics('');
    setVideoId(null);
    setResultsReady(false);
    setLoading(true);

    try {
      // Fetch lyrics from external API (or your backend wrapper if you have one)
      const lyricsPromise = fetch(`${LYRICS_API_URL}${encodeURIComponent(artist)}/${encodeURIComponent(song)}`);
      
      // Fetch YouTube video ID from your Next.js API route
      const ytPromise = fetch(YOUTUBE_API_ROUTE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `${song} ${artist} official music video` })
      });

      const [lyricsRes, ytRes] = await Promise.all([lyricsPromise, ytPromise]);

      const lyricsData = await lyricsRes.json();
      const ytData = await ytRes.json();

      if (lyricsData.lyrics) {
        const cleanedLyrics = lyricsData.lyrics.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        setLyrics(cleanedLyrics);
        // Translate the fetched lyrics using your Next.js API route
        await translateLyrics(cleanedLyrics, language);
      } else {
        setLyrics('No lyrics found for this song.');
        setTranslatedLyrics('Translation not available as no lyrics were found.');
      }

      if (ytData.videoId) {
        setVideoId(ytData.videoId);
      } else {
        console.warn("No video ID found from YouTube API.");
      }

      setResultsReady(true);
    } catch (error) {
      console.error("Error during search:", error);
      setLyrics('An error occurred while fetching lyrics.');
      setTranslatedLyrics('An error occurred while translating lyrics.');
      setResultsReady(true); // Show results page even with error to display messages
    }

    setLoading(false);
  };

  const translateLyrics = async (lyricsToTranslate, targetLanguage) => {
    if (!lyricsToTranslate.trim()) {
        setTranslatedLyrics('No lyrics to translate.');
        return;
    }
    try {
      const res = await fetch(TRANSLATE_API_ROUTE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lyrics: lyricsToTranslate, language: targetLanguage })
      });
      const data = await res.json();
      if (res.ok) {
        setTranslatedLyrics(data.translatedLyrics || 'No translation available or an error occurred.');
      } else {
        console.error("Translation API error:", data);
        setTranslatedLyrics(data.error || 'Failed to translate lyrics.');
      }
    } catch (error) {
      console.error("Error during translation request:", error);
      setTranslatedLyrics('An error occurred while connecting to the translation service.');
    }
  };

  const resetSearch = () => {
    setResultsReady(false);
    setArtist('');
    setSong('');
    setLyrics('');
    setTranslatedLyrics('');
    setVideoId(null);
    // Don't reset loading state here, it's handled by handleSearch
  };

  // UI for Loading State
  if (loading && !resultsReady) {
    return (
      <div className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center p-4 bg-gradient-to-b from-black via-black to-indigo-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500 border-opacity-75 mb-4"></div>
        <p className="text-xl text-indigo-300">Building your track...</p>
        <p className="text-sm text-slate-400 mt-2">Fetching lyrics, video, and translating...</p>
      </div>
    );
  }

  // UI for Results View
  if (resultsReady) {
    return (
      <>
        <Head>
          <title>{artist ? `${artist} - ${song}` : "Translation Results"} | Song Translator</title>
        </Head>
        <div className="min-h-screen w-full bg-gradient-to-br from-black via-slate-900 to-indigo-900 text-white flex flex-col selection:bg-pink-500 selection:text-white">
          <header className="p-4 sm:p-6 flex items-center sticky top-0 bg-black/70 backdrop-blur-md z-10 shadow-lg">
            <button 
              onClick={resetSearch} 
              className="text-2xl sm:text-3xl mr-3 sm:mr-4 p-2 rounded-full hover:bg-indigo-700 hover:text-indigo-100 transition-all duration-200"
              aria-label="Go back to search"
            >
              <FaArrowLeft />
            </button>
            <h1 className="text-lg sm:text-xl font-medium truncate">
              {artist && song ? `${artist} – ${song}` : "Translation Results"}
            </h1>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {/* Video Section */}
            {videoId && (
              <div className="w-full max-w-4xl mx-auto mb-6 sm:mb-8">
                <div className="aspect-w-16 aspect-h-9 bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-indigo-700">
                  <iframe
                    width="100%"
                    height="100%" // Tailwind aspect ratio classes handle this
                    src={`https://www.youtube.com/embed/$${videoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}
            {!videoId && !loading && (
                 <div className="w-full max-w-4xl mx-auto mb-6 sm:mb-8 p-4 bg-slate-800/50 rounded-xl text-center text-slate-400">
                    No video found for this song, or video search is disabled.
                 </div>
            )}


            {/* Lyrics Section */}
            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              <div className="bg-slate-800/50 rounded-xl p-4 sm:p-6 shadow-xl border border-slate-700">
                <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-indigo-300">Original Lyrics</h2>
                <pre className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap text-slate-200 overflow-x-auto max-h-[60vh] sm:max-h-[70vh] p-1 custom-scrollbar">{lyrics || "No original lyrics loaded."}</pre>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 sm:p-6 shadow-xl border border-slate-700">
                <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-pink-400 capitalize">Translated ({language})</h2>
                <pre className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap text-slate-200 overflow-x-auto max-h-[60vh] sm:max-h-[70vh] p-1 custom-scrollbar">{translatedLyrics || "No translation loaded."}</pre>
              </div>
            </div>
          </main>
           <footer className="p-4 text-center text-xs text-slate-500">
             Song Translator App &copy; {new Date().getFullYear()}
           </footer>
        </div>
      </>
    );
  }

  // UI for Initial Search Form
  return (
    <>
      <Head>
        <title>Translate a Song | Song Translator</title>
      </Head>
      <div className="min-h-screen w-full bg-gradient-to-br from-black via-indigo-950 to-pink-950 flex items-center justify-center p-4 selection:bg-pink-500 selection:text-white">
        {/* <Pricing/> // If you want to include pricing here */}
        <div className="w-full max-w-md sm:max-w-lg bg-slate-900/70 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 border border-indigo-700/50">
          <div className="flex items-center mb-6">
            {/* Icon can go here */}
            <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">Song Translator</h1>
          </div>
          <form onSubmit={handleSearch} className="space-y-4 sm:space-y-5">
            <input
              type="text"
              placeholder="Artist name"
              value={artist}
              onChange={e => setArtist(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-700 bg-slate-800 text-slate-100 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition placeholder-slate-500"
              required
            />
            <input
              type="text"
              placeholder="Song name"
              value={song}
              onChange={e => setSong(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-700 bg-slate-800 text-slate-100 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition placeholder-slate-500"
              required
            />
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-indigo-300 mb-1">Translate to:</label>
              <select
                id="language"
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-700 bg-slate-800 text-slate-100 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition"
              >
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="ja">Japanese</option>
                <option value="ko">Korean</option>
                <option value="pt">Portuguese</option>
                <option value="it">Italian</option>
                <option value="ru">Russian</option>
                <option value="zh">Chinese (Simplified)</option>
                {/* Add more languages as needed */}
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-semibold rounded-xl hover:from-indigo-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-pink-500 transition-all duration-300 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading || !artist || !song}
            >
              {loading ? 'Searching...' : 'Translate Song'}
            </button>
          </form>
        </div>
      </div>
      {/* Basic custom scrollbar styling (optional, can be in globals.css) */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.3); /* slate-700 with opacity */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4f46e5; /* indigo-600 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ec4899; /* pink-500 */
        }
        /* For Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #4f46e5 rgba(51, 65, 85, 0.3);
        }
      `}</style>
    </>
  );
}
