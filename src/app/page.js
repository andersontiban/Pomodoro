"use client"

import { useState } from 'react'
import { FaMusic, FaArrowLeft } from 'react-icons/fa'

export default function Home() {
  const [artist, setArtist] = useState('')
  const [song, setSong] = useState('')
  const [lyrics, setLyrics] = useState('')
  const [translatedLyrics, setTranslatedLyrics] = useState('')  // State to store translated lyrics
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState('es')  // Default to Spanish, change as needed

  const handleSearch = async (e) => {
    e.preventDefault()
    setLyrics('')
    setLoading(true)
    try {
      const res = await fetch(`https://api.lyrics.ovh/v1/${artist}/${song}`)
      const data = await res.json()
      setLyrics(data.lyrics || 'No lyrics found.')
      if (data.lyrics) {
        // Call translation function after fetching lyrics
        await translateLyrics(data.lyrics)
      }
    } catch {
      setLyrics('Error fetching lyrics.')
    } finally {
      setLoading(false)
    }
  }

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

  if (lyrics || translatedLyrics) {
    return (
      <div className="h-screen w-screen bg-gradient-to-b from-indigo-900 to-black text-white flex flex-col">
        <header className="p-4 flex items-center">
          <button onClick={reset} className="text-2xl mr-4 hover:text-indigo-300">
            <FaArrowLeft />
          </button>
          <h1 className="text-xl font-medium">{artist} – {song}</h1>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-8">
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
    )
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-indigo-800 via-purple-700 to-pink-600 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex items-center mb-6">
          <FaMusic className="text-pink-600 text-4xl mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Lyric Translator</h1>
        </div>
        <form onSubmit={handleSearch} className="space-y-4">
          <input
            type="text"
            placeholder="Artist name"
            value={artist}
            onChange={e => setArtist(e.target.value)}
            className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition"
          />
          <input
            type="text"
            placeholder="Song name"
            value={song}
            onChange={e => setSong(e.target.value)}
            className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition"
          />
          <button
            type="submit"
            className="w-full py-3 bg-pink-600 text-white font-semibold rounded-xl hover:bg-pink-700 transition"
            disabled={loading || !artist || !song}
          >
            {loading ? 'Searching…' : 'Search Lyrics'}
          </button>
        </form>
      </div>
    </div>
  )
}
