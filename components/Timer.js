'use client';
import { useState, useEffect } from 'react'

export default function Timer() {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      const interval = setInterval(() => {
        setSecondsLeft((sec) => sec - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isRunning, secondsLeft])

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-4">Focus Timer</h2>
      <div className="text-5xl mb-4">{formatTime(secondsLeft)}</div>
      <button
        onClick={() => setIsRunning(!isRunning)}
        className="bg-green-500 px-6 py-2 rounded text-white"
      >
        {isRunning ? 'Pause' : 'Start'}
      </button>
    </div>
  )
}
