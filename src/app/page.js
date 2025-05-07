"use client"

import { useState } from 'react'
import { FaMusic, FaArrowLeft } from 'react-icons/fa'
import Pricing from '../../components/pricing';

export default function Home() {
  const [resultsReady, setResultsReady] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [artist, setArtist] = useState('')
  const [song, setSong] = useState('')
  const [lyrics, setLyrics] = useState('')
  const [translatedLyrics, setTranslatedLyrics] = useState('')  // State to store translated lyrics
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState('es')  // Default to Spanish, change as needed

  const handleSearch = async (e) => {
    e.preventDefault();
    setLyrics('');
    setTranslatedLyrics('');
    setVideoId(null);
    setResultsReady(false);
    setLoading(true);
  
    try {
      // Fire both requests in parallel
      const lyricsPromise = fetch(`https://api.lyrics.ovh/v1/${artist}/${song}`);
      const ytPromise = fetch('/api/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `${song} ${artist} official` })
      });
  
      const [lyricsRes, ytRes] = await Promise.all([lyricsPromise, ytPromise]);
  
      const lyricsData = await lyricsRes.json();
      const ytData = await ytRes.json();
  
      if (lyricsData.lyrics) {
        setLyrics(lyricsData.lyrics);
        await translateLyrics(lyricsData.lyrics);
      } else {
        setLyrics('No lyrics found.');
        setTranslatedLyrics('No translation found.');
      }
  
      if (ytData.videoId) {
        setVideoId(ytData.videoId);
      }
  
      setResultsReady(true);
    } catch (error) {
      console.error("Error:", error);
      setLyrics('Error fetching lyrics.');
      setTranslatedLyrics('Error translating lyrics.');
    }
  
    setLoading(false);
  };
  
  

  const translateLyrics = async (lyrics) => {
    try {
      const res = await fetch("/api/translate", {  // Assuming an API route to handle translation
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lyrics, language })
      })
      const data = await res.json()
      setTranslatedLyrics(data.translatedLyrics || 'No translation found.')
    } catch (error) {
      console.error("Error during translation:", error)
      setTranslatedLyrics('Error translating lyrics.')
    }
  }

  const reset = () => {
    setLyrics('')
    setTranslatedLyrics('')
    setArtist('')
    setSong('')
  }

  if (loading && !resultsReady) {
    return (
      <div className="h-screen w-screen bg-black text-white flex items-center justify-center bg-gradient-to-b from-black via-black to-indigo-500">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500 border-opacity-50 mb-4 bg-gradient-to-b from-black via-black to-indigo-500" />
          <p className="text-xl">Building your track...</p>
        </div>
      </div>
    )
  }

  if (resultsReady) {
    return (
      <div className="h-screen w-screen bg-gradient-to-b from-black via-black to-indigo-500
      text-white flex flex-col">
        <header className="p-4 flex items-center">
          <button onClick={reset} className="text-2xl mr-4 hover:text-indigo-300">
            <FaArrowLeft />
          </button>
          <h1 className="text-xl font-medium">{artist} – {song}</h1>
        </header>
        {/* <div className="flex-1 overflow-y-auto px-6 py-8"> */}
        <div className="flex-1 overflow-y-auto py-8 flex justify-center">
          <div className="w-full max-w-7xl px-4 md:px-10">
            {videoId && (
                  <div className="">
                    <div className="aspect-w-16 aspect-h-9">
                      <iframe
                        width="100%"
                        height="400"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-xl shadow-lg"
                      />
                    </div>
                  </div>
                  )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Original Lyrics */}
                <div className="bg-white/10 rounded-xl p-6 shadow-inner">
                <h2 className="text-xl font-semibold mb-4 text-indigo-300">Original Lyrics</h2>
                <pre className="text-lg leading-relaxed whitespace-pre-wrap text-white">{lyrics}</pre>
                </div>

                {/* Translated Lyrics */}
                <div className="bg-white/10 rounded-xl p-6 shadow-inner">
                <h2 className="text-xl font-semibold mb-4 text-indigo-300 capitalize">Translated ({language})</h2>
                <pre className="text-lg leading-relaxed whitespace-pre-wrap text-white">{translatedLyrics}</pre>
                </div>
            </div>
            </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-b to-indigo-500 flex items-center justify-center px-4">
      <Pricing/>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Song Translator</h1>
        </div>
        <form onSubmit={handleSearch} className="space-y-4">
          <input
            type="text"
            placeholder="Artist name"
            value={artist}
            onChange={e => setArtist(e.target.value)}
            className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition text-black"
          />
          <input
            type="text"
            placeholder="Song name"
            value={song}
            onChange={e => setSong(e.target.value)}
            className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition text-black"
          />
          <button
            type="submit"
            className="w-full py-3 bg-indigo-500 text-white font-semibold rounded-xl hover:bg-pink-700 transition"
            disabled={loading || !artist || !song}
          >
            {loading ? 'Searching…' : 'Translate song'}
          </button>
        </form>
      </div>
    </div>
  )
}
