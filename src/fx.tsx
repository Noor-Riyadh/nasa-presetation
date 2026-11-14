import { createContext, useContext, useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

export const StepCtx = createContext(0)
export const PausedCtx = createContext(false)

// Reveal wrapper: becomes visible once the scene's step reaches `at` (and stays until `until`, if given).
export function R({
  at = 0,
  until,
  d = 0,
  v = 'rise',
  className = '',
  style,
  children,
}: {
  at?: number
  until?: number
  d?: number
  v?: 'rise' | 'fade' | 'zoom' | 'blur' | 'wipe'
  className?: string
  style?: CSSProperties
  children?: ReactNode
}) {
  const step = useContext(StepCtx)
  const on = step >= at && (until === undefined || step < until)
  return (
    <div className={`r r-${v} ${on ? 'on' : ''} ${className}`} style={{ ['--d' as string]: `${d}s`, ...style }}>
      {children}
    </div>
  )
}

export function useStep() {
  return useContext(StepCtx)
}

export function Mark({ size = 64 }: { size?: number }) {
  const id = useRef(`g${Math.random().toString(36).slice(2, 7)}`).current
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true" className="mark">
      <defs>
        <radialGradient id={id} cx=".42" cy=".38" r=".7">
          <stop offset="0" stopColor="#ffe2b8" />
          <stop offset=".45" stopColor="#ff7a33" />
          <stop offset="1" stopColor="#c8321c" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="14.5" fill="none" stroke="#9cc9ff" strokeOpacity=".3" />
      <ellipse cx="16" cy="16" rx="14.5" ry="5.2" fill="none" stroke="#9cc9ff" strokeOpacity=".6" transform="rotate(-24 16 16)" />
      <circle cx="16" cy="16" r="5.4" fill={`url(#${id})`} />
    </svg>
  )
}

const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

// Generic rAF loop that stops when paused/unmounted (no leaks, no cumulative callbacks).
function useLoop(draw: (t: number, dt: number) => void, paused: boolean, deps: unknown[] = []) {
  useEffect(() => {
    let raf = 0
    let last = performance.now()
    let acc = 0
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!paused && !reduced()) acc += dt
      draw(acc, dt)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, ...deps])
}

// Dark Atlantic: layered swells + drifting fog. Low-res canvas, upscaled for performance.
export function Ocean({ tint = 0, className = '' }: { tint?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const paused = useContext(PausedCtx)
  useLoop(
    (t) => {
      const c = ref.current
      if (!c) return
      const g = c.getContext('2d')!
      const W = c.width
      const H = c.height
      g.clearRect(0, 0, W, H)
      const sky = g.createLinearGradient(0, 0, 0, H)
      sky.addColorStop(0, '#02040a')
      sky.addColorStop(0.55, `rgb(${6 + tint * 4},${12 + tint * 14},${26 + tint * 34})`)
      sky.addColorStop(1, '#02050c')
      g.fillStyle = sky
      g.fillRect(0, 0, W, H)
      const horizon = H * 0.62
      for (let layer = 0; layer < 7; layer++) {
        const k = layer / 6
        const y0 = horizon + k * k * (H - horizon) * 0.95
        const amp = 2 + k * 16
        const len = 90 - k * 55
        g.beginPath()
        g.moveTo(0, H)
        for (let x = 0; x <= W; x += 8) {
          const y = y0 + Math.sin(x / len + t * (0.35 + k * 0.5) + layer * 1.7) * amp + Math.sin(x / (len * 2.3) - t * 0.25 + layer) * amp * 0.6
          g.lineTo(x, y)
        }
        g.lineTo(W, H)
        g.closePath()
        const b = 10 + k * 22
        g.fillStyle = `rgba(${6 + b * 0.12 + tint * 6},${12 + b * 0.5 + tint * 14},${22 + b * 1.1 + tint * 36},${0.5 + k * 0.25})`
        g.fill()
        // moon-cold glints along crests
        g.strokeStyle = `rgba(${120 + tint * 40},${160 + tint * 30},${210},${0.035 + k * 0.05})`
        g.lineWidth = 1
        g.stroke()
      }
      // drifting fog banks
      for (let i = 0; i < 4; i++) {
        const fx = ((t * (6 + i * 3) + i * 380) % (W + 600)) - 300
        const fy = horizon - 30 + i * 22 + Math.sin(t * 0.2 + i) * 6
        const fg = g.createRadialGradient(fx, fy, 0, fx, fy, 330)
        fg.addColorStop(0, `rgba(120,150,190,${0.1 + tint * 0.03})`)
        fg.addColorStop(1, 'rgba(120,150,190,0)')
        g.fillStyle = fg
        g.fillRect(fx - 330, fy - 330, 660, 660)
      }
    },
    paused,
    [tint],
  )
  return <canvas ref={ref} width={960} height={540} className={`fx-canvas ${className}`} />
}

export function Stars({ count = 420, className = '' }: { count?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const paused = useContext(PausedCtx)
  const stars = useRef(
    Array.from({ length: count }, () => ({ x: Math.random(), y: Math.random(), z: Math.random(), p: Math.random() * 6 })),
  ).current
  useLoop(
    (t) => {
      const c = ref.current
      if (!c) return
      const g = c.getContext('2d')!
      g.clearRect(0, 0, c.width, c.height)
      for (const s of stars) {
        const x = ((s.x * c.width + t * (1 + s.z * 5)) % c.width + c.width) % c.width
        const a = 0.25 + 0.75 * s.z * (0.6 + 0.4 * Math.sin(t * (0.6 + s.z) + s.p))
        g.fillStyle = `rgba(${200 + s.z * 55},${215 + s.z * 40},255,${a})`
        const r = 0.4 + s.z * 1.1
        g.fillRect(x, s.y * c.height, r, r)
      }
    },
    paused,
  )
  return <canvas ref={ref} width={1920} height={1080} className={`fx-canvas ${className}`} />
}

// Slow cinematic camera move on a photograph.
export function Photo({
  src,
  className = '',
  style,
  drift = 'a',
  alt = '',
}: {
  src: string
  className?: string
  style?: CSSProperties
  drift?: 'a' | 'b' | 'c'
  alt?: string
}) {
  return (
    <div className={`photo ${className}`} style={style}>
      <img src={src} alt={alt} className={`kb kb-${drift}`} draggable={false} />
    </div>
  )
}

export function Caption({ children, side = 'left' }: { children: ReactNode; side?: 'left' | 'right' }) {
  return <div className={`caption caption-${side}`}>{children}</div>
}
