import { useCallback, useEffect, useRef, useState } from 'react'
import { clampPos, type Pos } from './notes'

/* ── shared state helpers (position persists in the URL hash so refresh/back-from-demo recovers) ── */
export const readHash = (): Pos => {
  const m = /#(\d+)\.(\d+)/.exec(location.hash)
  return m ? clampPos({ scene: +m[1], step: +m[2] }) : { scene: 0, step: 0 }
}

const CH = 'embernova-sync'
const TIMER_KEY = 'embernova-timer'
type TimerState = { startedAt: number | null; acc: number }
export const readTimer = (): TimerState => {
  try {
    return JSON.parse(localStorage.getItem(TIMER_KEY) || '') as TimerState
  } catch {
    return { startedAt: null, acc: 0 }
  }
}
const writeTimer = (t: TimerState) => {
  try {
    localStorage.setItem(TIMER_KEY, JSON.stringify(t))
  } catch {
    /* storage unavailable */
  }
}
export const elapsedOf = (t: TimerState) => t.acc + (t.startedAt ? (Date.now() - t.startedAt) / 1000 : 0)
export function useElapsed() {
  const [, tick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 500)
    const onStore = () => tick((n) => n + 1)
    window.addEventListener('storage', onStore)
    return () => {
      clearInterval(id)
      window.removeEventListener('storage', onStore)
    }
  }, [])
  return elapsedOf(readTimer())
}
export const timerControls = {
  start() {
    const t = readTimer()
    if (!t.startedAt) writeTimer({ startedAt: Date.now(), acc: t.acc })
  },
  pause() {
    const t = readTimer()
    if (t.startedAt) writeTimer({ startedAt: null, acc: elapsedOf(t) })
  },
  reset() {
    writeTimer({ startedAt: null, acc: 0 })
  },
}

export function useSync(onCmd: (c: { cmd: string; pos?: Pos }) => void, onPos?: (p: Pos) => void) {
  const ch = useRef<BroadcastChannel | null>(null)
  const cb = useRef(onCmd)
  const pb = useRef(onPos)
  cb.current = onCmd
  pb.current = onPos
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return
    const c = new BroadcastChannel(CH)
    ch.current = c
    c.onmessage = (e) => {
      const d = e.data
      if (d.type === 'cmd') cb.current(d)
      if (d.type === 'pos') pb.current?.(d.pos)
    }
    return () => {
      c.close()
      ch.current = null
    }
  }, [])
  return useCallback((msg: unknown) => ch.current?.postMessage(msg), [])
}

