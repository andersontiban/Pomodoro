// app/song-app/page.js
"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { FaArrowLeft } from 'react-icons/fa';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import LogoutButton from "../../components/LogoutButton";

export default function SongTranslatorApp() {
  const [session, setSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
      } else {
        setSession(session);
      }
    };
    fetchSession();
  }, []);

  const [resultsReady, setResultsReady] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [artist, setArtist] = useState('');
  const [song, setSong] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [translatedLyrics, setTranslatedLyrics] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('es');
  const [error, setError] = useState('');

  const LYRICS_API_URL = 'https://api.lyrics.ovh/v1/';
  const YOUTUBE_API_ROUTE = '/api/youtube';
  const TRANSLATE_API_ROUTE = '/api/translate';

  const FETCH_TIMEOUT_MS = 5000;

  const handleSearch = async (e) => {
    e.preventDefault();
    setLyrics('');
    setTranslatedLyrics('');
    setVideoId(null);
    setResultsReady(false);
    setLoading(true);
    setError('');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, FETCH_TIMEOUT_MS);

    try {
      const lyricsPromise = fetch(`${LYRICS_API_URL}${encodeURIComponent(artist)}/${encodeURIComponent(song)}`, { signal: controller.signal });
      const ytPromise = fetch(YOUTUBE_API_ROUTE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `${song} ${artist}` }),
        signal: controller.signal
      });

      const [lyricsRes, ytRes] = await Promise.all([lyricsPromise, ytPromise]);

      clearTimeout(timeoutId);

      const lyricsData = await lyricsRes.json();
      const ytData = await ytRes.json();

      if (lyricsData.lyrics) {
        const cleanedLyrics = lyricsData.lyrics.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        setLyrics(cleanedLyrics);
        await translateLyrics(cleanedLyrics, language);
      } else {
        setLyrics('No lyrics found for this song.');
        setTranslatedLyrics('No translation found as no lyrics were found.');
        setResultsReady(true);
        setLoading(false);
        return;
      }

      if (ytData.videoId) {
        setVideoId(ytData.videoId);
      } else {
        console.warn("No video ID found from YouTube API.");
      }

      setResultsReady(true);
    } catch (error) {
      clearTimeout(timeoutId);
      console.error("Error during search:", error);

      if (error.name === 'AbortError') {
        setError('Lyrics unavailable please try a different song/artist.');
      } else {
        setError('An error occurred during the search. Please try again.');
      }

      setLyrics('');
      setTranslatedLyrics('');
      setVideoId(null);
      setResultsReady(false);
    } finally {
      setLoading(false);
    }
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

  const resetSearchAndInputs = () => {
    setResultsReady(false);
    setArtist('');
    setSong('');
    setLyrics('');
    setTranslatedLyrics('');
    setVideoId(null);
    setError('');
  };

  if (loading && !resultsReady) {
    return (
      <div className="h-screen w-full bg-black text-white flex flex-col items-center justify-center p-4 bg-gradient-to-b from-black via-black to-indigo-500 overflow-hidden">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500 border-opacity-75 mb-4"></div>
        <p className="text-xl text-indigo-300">Building your track...</p>
        <p className="text-sm text-slate-400 mt-2">Fetching lyrics, video, and translating...</p>
      </div>
    );
  }

  if (resultsReady) {
    return (
      <div className="h-screen w-screen bg-gradient-to-b from-black via-black to-indigo-500 text-white flex flex-col">
        <header className="p-4 flex items-center justify-between"> {/* Added justify-between to space items */}
          <button onClick={resetSearchAndInputs} className="text-2xl hover:text-indigo-300"> {/* Removed mr-4 */}
            <FaArrowLeft />
          </button>
          <LogoutButton />
        </header>

        {videoId && (
          <div className="w-full max-w-7xl mx-auto px-4 md:px-10">
            <div className="aspect-w-16 aspect-h-9 mb-6">
              <iframe
                width="100%"
                height="400"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-xl shadow-lg w-full"
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-8 custom-scrollbar">
          <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 rounded-xl p-6 shadow-inner">
              <h2 className="text-xl font-semibold mb-4 text-indigo-300 text-center">Original Lyrics</h2>
              <pre className="text-lg leading-relaxed whitespace-pre-wrap text-white text-center">{lyrics || "No original lyrics loaded."}</pre>
            </div>
            <div className="bg-white/10 rounded-xl p-6 shadow-inner">
              <h2 className="text-xl font-semibold mb-4 text-pink-400 capitalize text-center">Translated ({language})</h2>
              <pre className="text-lg leading-relaxed whitespace-pre-wrap text-white text-center">{translatedLyrics || "No translation loaded."}</pre>
            </div>
          </div>
        </div>

      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Translate a Song | LyricSwitch</title>
      </Head>
      {/* Position LogoutButton absolutely at the top right with padding */}
      <div className="absolute top-0 right-0 p-4 z-10"> {/* Added z-10 to ensure it's on top */}
        <LogoutButton />
      </div>
      <div className="min-h-screen w-full bg-gradient-to-b from-black via-black to-indigo-500 flex items-center justify-center p-4 selection:bg-pink-500 selection:text-white">
        <div className="w-full max-w-md sm:max-w-lg bg-slate-900/70 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 border border-indigo-700/50">
          <div className="flex items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">LyricSwitch</h1>
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
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="pt">Portuguese</option>
                <option value="ja">Japanese</option>
              </select>
            </div>
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-semibold rounded-xl hover:from-indigo-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-pink-500 transition-all duration-300 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading || !artist || !song}
            >
              {loading ? 'Searching…' : 'Translate Song'}
            </button>
          </form>
        </div>
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6366f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ec4899;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #6366f1 rgba(51, 65, 85, 0.2);
        }
      `}</style>
    </>
  );
}
