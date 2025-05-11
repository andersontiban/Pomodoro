// app/song-app/page.js
"use client"; 

import { useState, useEffect } from 'react';
import Head from 'next/head'; 
import { FaArrowLeft } from 'react-icons/fa'; 

export default function SongTranslatorApp() {
  const [resultsReady, setResultsReady] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [artist, setArtist] = useState('');
  const [song, setSong] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [translatedLyrics, setTranslatedLyrics] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('es'); 

  const LYRICS_API_URL = 'https://api.lyrics.ovh/v1/'; 
  const YOUTUBE_API_ROUTE = '/api/youtube'; 
  const TRANSLATE_API_ROUTE = '/api/translate'; 

  const handleSearch = async (e) => {
    e.preventDefault();
    setLyrics('');
    setTranslatedLyrics('');
    setVideoId(null);
    setResultsReady(false);
    setLoading(true);

    try {
      const lyricsPromise = fetch(`${LYRICS_API_URL}${encodeURIComponent(artist)}/${encodeURIComponent(song)}`);
      const ytPromise = fetch(YOUTUBE_API_ROUTE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `${song} ${artist} official music video` }) // Changed query to be more specific
      });

      const [lyricsRes, ytRes] = await Promise.all([lyricsPromise, ytPromise]);

      const lyricsData = await lyricsRes.json();
      const ytData = await ytRes.json();

      if (lyricsData.lyrics) {
        const cleanedLyrics = lyricsData.lyrics.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        setLyrics(cleanedLyrics);
        await translateLyrics(cleanedLyrics, language); // Pass language to translateLyrics
      } else {
        setLyrics('No lyrics found for this song.');
        setTranslatedLyrics('No translation found as no lyrics were found.');
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
      setResultsReady(true); 
    }
    setLoading(false);
  };

  // Updated to accept language parameter, matching your original logic
  const translateLyrics = async (lyricsToTranslate, targetLanguage) => { 
    if (!lyricsToTranslate.trim()) {
        setTranslatedLyrics('No lyrics to translate.');
        return;
    }
    try {
      const res = await fetch(TRANSLATE_API_ROUTE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lyrics: lyricsToTranslate, language: targetLanguage }) // Use targetLanguage
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

  // This function resets the state to go back to the search form
  const resetSearchAndInputs = () => {
    setResultsReady(false);
    // Clear inputs as per your original reset logic
    setArtist('');
    setSong('');
    // Clear results
    setLyrics('');
    setTranslatedLyrics('');
    setVideoId(null);
  };

  // --- UI for Loading State (Kept from my previous version) ---
  if (loading && !resultsReady) {
    return (
      <div className="h-screen w-full bg-black text-white flex flex-col items-center justify-center p-4 bg-gradient-to-b from-black via-black to-indigo-500 overflow-hidden">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500 border-opacity-75 mb-4"></div>
        <p className="text-xl text-indigo-300">Building your track...</p>
        <p className="text-sm text-slate-400 mt-2">Fetching lyrics, video, and translating...</p>
      </div>
    );
  }

  // --- UI for Results View (Merged) ---
  if (resultsReady) {
    return (
      <div className="h-screen w-screen bg-gradient-to-b from-black via-black to-indigo-500 text-white flex flex-col">
  <header className="p-4 flex items-center">
    <button onClick={resetSearchAndInputs} className="text-2xl mr-4 hover:text-indigo-300">
      <FaArrowLeft />
    </button>
    <h1 className="text-xl font-medium">{artist} – {song}</h1>
  </header>

  {/* Video Section */}
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

  {/* Scrollable Lyrics Section */}
<div className="flex-1 overflow-y-auto px-4 md:px-10 pb-8">
  <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-white/10 rounded-xl p-6 shadow-inner">
      <h2 className="text-xl font-semibold mb-4 text-indigo-500 text-center">Original</h2>
      <pre className="text-md leading-relaxed whitespace-pre-wrap text-white">{lyrics}</pre>
    </div>
    <div className="bg-white/10 rounded-xl p-6 shadow-inner">
      <h2 className="text-xl font-semibold mb-4 text-pink-400 capitalize text-center">Translated ({language})</h2>
      <pre className="text-md leading-relaxed whitespace-pre-wrap text-white">{translatedLyrics}</pre>
    </div>
  </div>
</div>
</div>

    )
  }

  return (
    <>
      <Head>
        <title>Translate a Song | Song Translator</title>
      </Head>
      <div className="min-h-screen w-full bg-gradient-to-b from-black via-black to-indigo-500 flex items-center justify-center p-4 selection:bg-pink-500 selection:text-white">
        <div className="w-full max-w-md sm:max-w-lg bg-slate-900/70 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 border border-indigo-700/50">
          <div className="flex items-center mb-6">
            {/* <FaMusic className="text-3xl text-pink-500 mr-3" /> Optional icon from your original */}
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
              </select>
            </div>
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
          background: rgba(51, 65, 85, 0.2); /* Lighter track for the new background */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6366f1; /* Indigo-500 for thumb */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ec4899; /* Pink-500 for hover */
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #6366f1 rgba(51, 65, 85, 0.2);
        }
      `}</style>
    </>
  );
}
