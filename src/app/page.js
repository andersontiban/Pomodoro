// import TaskList from "../../components/TaskList"
// import Head from "next/head"
// import Header from "../../components/Header"
// import Timer from "../../components/Timer"

// export default function Home() {
//     return (
//         <>
//             <h1>Glory to God</h1>
//             <Head>
//                 <title>FocusDeck</title>
//             </Head>
//             <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
//                 <Header />
//                 <main className="mt-10 max-w-2xl mx-auto space-y-12">
//                     <TaskList />
//                     <Timer />
//                 </main>
//             </div>
//         </>
        
//     ) 
// }
"use client"

import { useState } from 'react'
import { FaMusic, FaArrowLeft } from 'react-icons/fa'

export default function Home() {
  const [artist, setArtist] = useState('')
  const [song, setSong] = useState('')
  const [lyrics, setLyrics] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    setLyrics('')
    setLoading(true)
    try {
      const res = await fetch(`https://api.lyrics.ovh/v1/${artist}/${song}`)
      const data = await res.json()
      setLyrics(data.lyrics || 'No lyrics found.')
    } catch {
      setLyrics('Error fetching lyrics.')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setLyrics('')
    setArtist('')
    setSong('')
  }

  if (lyrics) {
    return (
      <div className="h-screen w-screen bg-gradient-to-b from-indigo-900 to-black text-white flex flex-col">
        <header className="p-4 flex items-center">
          <button onClick={reset} className="text-2xl mr-4 hover:text-indigo-300">
            <FaArrowLeft />
          </button>
          <h1 className="text-xl font-medium">{artist} – {song}</h1>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <pre className="text-2xl leading-relaxed whitespace-pre-wrap">{lyrics}</pre>
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
