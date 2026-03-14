import { useEffect, useMemo, useRef, useState } from 'react'
import { Headphones, Play, Pause, Square, RotateCcw } from 'lucide-react'

function htmlToText(html) {
  if (!html) return ''
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return String(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  }
  const doc = new DOMParser().parseFromString(String(html), 'text/html')
  return (doc.body?.textContent || '').replace(/\s+/g, ' ').trim()
}

function splitIntoChunks(text, maxLen = 220) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim()
  if (!clean) return []

  const sentences = clean.split(/(?<=[.!?])\s+/)
  const chunks = []
  let current = ''

  for (const sentence of sentences) {
    if (!sentence) continue
    const candidate = current ? `${current} ${sentence}` : sentence
    if (candidate.length <= maxLen) {
      current = candidate
      continue
    }

    if (current) chunks.push(current)

    if (sentence.length <= maxLen) {
      current = sentence
      continue
    }

    // Hard wrap unusually long sentence segments.
    let remainder = sentence
    while (remainder.length > maxLen) {
      chunks.push(remainder.slice(0, maxLen))
      remainder = remainder.slice(maxLen).trim()
    }
    current = remainder
  }

  if (current) chunks.push(current)
  return chunks
}

export default function AudioCompanion({ title = '', content = '' }) {
  const [supported, setSupported] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(false)
  const [status, setStatus] = useState('idle')
  const [voices, setVoices] = useState([])
  const [selectedVoice, setSelectedVoice] = useState('')
  const [rate, setRate] = useState(1)
  const [activeChunk, setActiveChunk] = useState(0)
  const [errorText, setErrorText] = useState('')
  const queueRef = useRef([])
  const indexRef = useRef(0)
  const stoppedRef = useRef(false)
  const text = useMemo(() => htmlToText(content), [content])
  const chunks = useMemo(() => splitIntoChunks(text), [text])

  useEffect(() => {
    const ok = typeof window !== 'undefined' && 'speechSynthesis' in window
    setSupported(ok)

    if (!ok) return undefined

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices() || []
      setVoices(available)

      if (!selectedVoice && available.length) {
        const english = available.find((v) => String(v.lang || '').toLowerCase().startsWith('en'))
        setSelectedVoice((english || available[0]).name)
      }
    }

    loadVoices()
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices)

    return () => {
      window.speechSynthesis.cancel()
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices)
    }
  }, [selectedVoice])

  const stopInternal = () => {
    if (!supported) return
    stoppedRef.current = true
    window.speechSynthesis.cancel()
    queueRef.current = []
    indexRef.current = 0
    setPlaying(false)
    setPaused(false)
    setActiveChunk(0)
  }

  const speakNextChunk = () => {
    if (!supported) return
    const queue = queueRef.current
    const idx = indexRef.current

    if (stoppedRef.current) return
    if (!queue.length || idx >= queue.length) {
      setPlaying(false)
      setPaused(false)
      setStatus('ended')
      return
    }

    const selected = voices.find((v) => v.name === selectedVoice)
    const utterance = new SpeechSynthesisUtterance(queue[idx])
    if (selected) utterance.voice = selected
    utterance.rate = rate
    utterance.pitch = 1

    utterance.onstart = () => {
      setActiveChunk(idx + 1)
      setPlaying(true)
      setPaused(false)
      setStatus('playing')
    }

    utterance.onend = () => {
      if (stoppedRef.current) return
      indexRef.current = idx + 1
      speakNextChunk()
    }

    utterance.onerror = () => {
      setPlaying(false)
      setPaused(false)
      setStatus('error')
      setErrorText('Playback failed. Try another voice or speed.')
    }

    window.speechSynthesis.speak(utterance)
  }

  const start = () => {
    if (!supported || !chunks.length) return
    stopInternal()
    stoppedRef.current = false
    setErrorText('')

    const preface = title ? `${title}.` : ''
    queueRef.current = preface ? [preface, ...chunks] : [...chunks]
    indexRef.current = 0
    setStatus('buffering')
    speakNextChunk()
  }

  const pause = () => {
    if (!supported || !playing) return
    window.speechSynthesis.pause()
    setPaused(true)
    setStatus('paused')
  }

  const resume = () => {
    if (!supported || !playing) return
    window.speechSynthesis.resume()
    setPaused(false)
    setStatus('playing')
  }

  const stop = () => {
    stopInternal()
    setStatus('stopped')
  }

  const percent = queueRef.current.length
    ? Math.min(100, Math.round((activeChunk / queueRef.current.length) * 100))
    : 0

  return (
    <div className="mt-10 rounded-card border border-border bg-surface p-6">
      <div className="flex items-center gap-2 mb-4">
        <Headphones size={16} className="text-accent" />
        <p className="font-mono text-[10px] tracking-widest uppercase text-ink-3">Audio Companion</p>
      </div>
      <p className="text-[14px] text-ink-2 mb-4">
        {supported
          ? 'Listen to this post with browser text-to-speech. Choose voice and speed, then play.'
          : 'Audio playback is unavailable in this browser/device. Try Chrome, Edge, or Safari on a full browser.'}
      </p>

      {supported && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <label className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-3">Voice</span>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="field py-2"
            >
              {voices.length === 0 ? (
                <option value="">Loading voices...</option>
              ) : (
                voices.map((voice) => (
                  <option key={`${voice.name}-${voice.lang}`} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))
              )}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-3">
              Speed: {rate.toFixed(2)}x
            </span>
            <input
              type="range"
              min="0.8"
              max="1.2"
              step="0.05"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full"
            />
          </label>
        </div>
      )}

      {supported && (
        <div className="mb-4">
          <div className="h-1.5 rounded-full bg-paper-alt overflow-hidden">
            <div
              className="h-full bg-accent transition-[width] duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-[11px] text-ink-3 mt-1">
            {queueRef.current.length
              ? `Progress: ${Math.min(activeChunk, queueRef.current.length)} / ${queueRef.current.length} segments`
              : 'Progress: idle'}
          </p>
        </div>
      )}

      {supported && status === 'error' && (
        <p className="text-[12px] text-amber-600 dark:text-amber-400 mb-3">
          {errorText || 'Playback could not start. Please try again.'}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <button onClick={start} className="share-btn" disabled={!supported || !chunks.length || (playing && !paused)}>
          <Play size={13} /> Play
        </button>
        <button onClick={paused ? resume : pause} className="share-btn" disabled={!supported || !playing}>
          {paused ? <RotateCcw size={13} /> : <Pause size={13} />}
          {paused ? 'Resume' : 'Pause'}
        </button>
        <button onClick={stop} className="share-btn" disabled={!supported || !playing}>
          <Square size={13} /> Stop
        </button>
      </div>
    </div>
  )
}
