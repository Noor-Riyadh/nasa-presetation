import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType } from 'react'
import { PausedCtx, StepCtx } from './fx'
import { Scene1, Scene2, Scene3, Scene4, Scene5, A } from './scenes1'
import { Scene10, Scene11 } from './scenes3'
import { Scene6, Scene7, Scene8, Scene9, DEMO_IMAGES } from './scenes2'
import { audioCue, sound } from './audio'
import {
  DEMO_PROMPT,
  REAL_APP,
  SCENES,
  TOTAL_TARGET,
  clampPos,
  fmt,
  nextPos,
  prevPos,
  type Pos,
} from './notes'
import { Presenter, ScriptPage } from './Presenter'
import { readHash, useElapsed, timerControls, useSync } from './shared'

const COMPONENTS: ComponentType[] = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7, Scene8, Scene9, Scene10, Scene11]

/* ───────────────────────── Stage ───────────────────────── */
function Stage() {
  const [pos, setPos] = useState<Pos>(readHash)
  const [replayKey, setReplayKey] = useState(0)
  const [paused, setPaused] = useState(false)
  const [dock, setDock] = useState(false)
  const [clickAdvance, setClickAdvance] = useState(true)
  const [snd, setSnd] = useState(false)
  const [vol, setVol] = useState(0.5)
  const [scale, setScale] = useState(1)
  const [leaving, setLeaving] = useState<Pos | null>(null)
  const prevScene = useRef(pos)
  const posRef = useRef(pos)
  posRef.current = pos
  const elapsed = useElapsed()

  const send = useSync(
    (d) => {
      if (d.cmd === 'next') go(nextPos(posRef.current))
      if (d.cmd === 'prev') go(prevPos(posRef.current))
      if (d.cmd === 'goto' && d.pos) go(d.pos)
      if (d.cmd === 'replay') setReplayKey((k) => k + 1)
      if (d.cmd === 'hello') send({ type: 'pos', pos: posRef.current })
    },
  )

  const go = useCallback(
    (p: Pos) => {
      const np = clampPos(p)
      if (np.scene === posRef.current.scene && np.step === posRef.current.step) return
      if (np.scene !== posRef.current.scene) {
        setLeaving({ scene: posRef.current.scene, step: SCENES[posRef.current.scene].steps - 1 })
      }
      posRef.current = np
      setPos(np)
      history.replaceState(null, '', `#${np.scene}.${np.step}`)
      send({ type: 'pos', pos: np })
      audioCue(np.scene, np.step)
      if (np.scene > 0 || np.step > 0) timerControls.start()
    },
    [send],
  )

  // clear the outgoing scene once its fade is done (timer tied to scene index only)
  useEffect(() => {
    if (prevScene.current.scene === pos.scene) return
    prevScene.current = pos
    const t = setTimeout(() => setLeaving(null), 1300)
    return () => clearTimeout(t)
  }, [pos.scene]) // eslint-disable-line react-hooks/exhaustive-deps

  // fit 1920×1080 stage to any window
  useEffect(() => {
    const fit = () => setScale(Math.min(innerWidth / 1920, innerHeight / 1080))
    fit()
    addEventListener('resize', fit)
    return () => removeEventListener('resize', fit)
  }, [])

  // preload critical assets so scene changes never wait on the network/disk
  useEffect(() => {
    const imgs = ['titanic.jpg', 'earth-artemis2.jpg', 'orion-pov.jpg', 'apollo1-cm.jpg', 'apollo13-sm.jpg', 'earth-limb.jpg'].map(A)
    const keep: HTMLImageElement[] = []
    for (const s of [...imgs, ...DEMO_IMAGES.map((n) => `demo/${n}.jpg`)]) {
      const i = new Image()
      i.src = s
      keep.push(i)
    }
    const v = document.createElement('video')
    v.preload = 'auto'
    v.src = A('flame-acme.mp4')
    return () => {
      keep.length = 0
    }
  }, [])

  const toggleFs = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void document.documentElement.requestFullscreen?.().catch(() => undefined)
  }, [])

  const toggleSound = useCallback(async () => {
    const next = !sound.enabled
    await sound.setEnabled(next)
    setSnd(next)
    if (next) audioCue(posRef.current.scene, posRef.current.step)
  }, [])

  const openPresenter = useCallback(() => {
    window.open(`${location.pathname}#presenter`, 'embernova-presenter', 'width=1280,height=860')
  }, [])

  const copyPrompt = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(DEMO_PROMPT)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const t = e.target as HTMLElement
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return
      const k = e.key
      const p = posRef.current
      const onBtn = t && (t.tagName === 'BUTTON' || t.tagName === 'A') && (k === ' ' || k === 'Enter')
      if (onBtn) return // let focused controls activate
      if (k === 'ArrowRight' || k === 'ArrowDown' || k === ' ' || k === 'PageDown' || k === 'Enter') {
        e.preventDefault()
        go(nextPos(p))
      } else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'Backspace' || k === 'PageUp') {
        e.preventDefault()
        go(prevPos(p))
      } else if (k === 'Home') go({ scene: 0, step: 0 })
      else if (k === 'End') go({ scene: SCENES.length - 1, step: SCENES[SCENES.length - 1].steps - 1 })
      else if (k === 'f' || k === 'F') toggleFs()
      else if (k === 'd' || k === 'D') setDock((v) => !v)
      else if (k === 'p' || k === 'P') setPaused((v) => !v)
      else if (k === 'r' || k === 'R') setReplayKey((n) => n + 1)
      else if (k === 'm' || k === 'M') void toggleSound()
      else if (k === 'n' || k === 'N') openPresenter()
      else if (k === 't' || k === 'T') timerControls.reset()
      else if ((k === 'o' || k === 'O') && p.scene === 5) window.open(REAL_APP, '_blank', 'noopener')
      else if ((k === 'c' || k === 'C') && p.scene === 5) void copyPrompt()
      else if (/^[1-9]$/.test(k)) go({ scene: +k - 1, step: 0 })
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [go, toggleFs, toggleSound, openPresenter, copyPrompt])

  const onStageClick = (e: React.MouseEvent) => {
    if (!clickAdvance) return
    const t = e.target as HTMLElement
    if (t.closest('a,button,input,.dock,.no-advance')) return
    go(nextPos(posRef.current))
  }

  const Cur = COMPONENTS[pos.scene]
  const Out = leaving ? COMPONENTS[leaving.scene] : null
  const meta = SCENES[pos.scene]
  const frac = useMemo(() => (pos.scene + (pos.step + 1) / meta.steps) / SCENES.length, [pos, meta.steps])

  return (
    <div className={`viewport ${paused ? 'is-paused' : ''}`} onClick={onStageClick}>
      <div className="stage" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
        <PausedCtx.Provider value={paused}>
          {Out && leaving && (
            <div className="scene exit" key={`out-${leaving.scene}`} aria-hidden="true">
              <StepCtx.Provider value={leaving.step}>
                <Out />
              </StepCtx.Provider>
            </div>
          )}
          <div className="scene enter" key={`s-${pos.scene}-${replayKey}`} data-scene={meta.id}>
            <StepCtx.Provider value={pos.step}>
              <Cur />
            </StepCtx.Provider>
          </div>
        </PausedCtx.Provider>
        <div className="grain" />
        <div className="vignette" />
      </div>

      {/* discreet progress — scene-segmented */}
      <div className="progress" aria-hidden="true">
        <div className="pfill" style={{ width: `${frac * 100}%` }} />
      </div>

      <div className={`dock ${dock ? 'open' : ''}`} aria-hidden={!dock} role="toolbar" aria-label="Presenter controls (hidden from audience with D)">
        <div className="dk-row">
          <button tabIndex={dock ? 0 : -1} onClick={() => go(prevPos(pos))} title="Previous (←)">
            ◀
          </button>
          <span className="dk-count">
            {String(pos.scene + 1).padStart(2, '0')} / {String(SCENES.length).padStart(2, '0')} · {pos.step + 1}/{meta.steps}
          </span>
          <button tabIndex={dock ? 0 : -1} onClick={() => go(nextPos(pos))} title="Next (→ / Space)">
            ▶
          </button>
          <span className="dk-sep" />
          {SCENES.map((s, i) => (
            <button
              key={s.id}
              tabIndex={dock ? 0 : -1}
              className={i === pos.scene ? 'cur' : ''}
              onClick={() => go({ scene: i, step: 0 })}
              title={`${i + 1}. ${s.title}`}
            >
              {i + 1}
            </button>
          ))}
          <span className="dk-sep" />
          <button tabIndex={dock ? 0 : -1} onClick={() => setReplayKey((n) => n + 1)} title="Replay scene (R)">
            ↺
          </button>
          <button tabIndex={dock ? 0 : -1} className={paused ? 'cur' : ''} onClick={() => setPaused((v) => !v)} title="Pause / resume motion (P)">
            {paused ? '▶ motion' : '❚❚ motion'}
          </button>
          <button tabIndex={dock ? 0 : -1} className={clickAdvance ? 'cur' : ''} onClick={() => setClickAdvance((v) => !v)} title="Click-to-advance">
            click
          </button>
          <span className="dk-sep" />
          <button tabIndex={dock ? 0 : -1} className={snd ? 'cur' : ''} onClick={() => void toggleSound()} title="Sound (M) — off by default">
            {snd ? '♪ on' : '♪ off'}
          </button>
          <input
            tabIndex={dock ? 0 : -1}
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={vol}
            aria-label="Volume"
            onChange={(e) => {
              setVol(+e.target.value)
              sound.setVolume(+e.target.value)
            }}
          />
          <span className="dk-sep" />
          <button tabIndex={dock ? 0 : -1} onClick={toggleFs} title="Fullscreen (F)">
            ⛶
          </button>
          <button tabIndex={dock ? 0 : -1} onClick={openPresenter} title="Open presenter window (N)">
            presenter
          </button>
          <span className="dk-time" title="Elapsed (T resets)">
            {fmt(elapsed)} <i>/ {fmt(TOTAL_TARGET)}</i>
          </span>
        </div>
      </div>
    </div>
  )
}

export function App() {
  const [route, setRoute] = useState(location.hash)
  useEffect(() => {
    const on = () => setRoute(location.hash)
    addEventListener('hashchange', on)
    return () => removeEventListener('hashchange', on)
  }, [])
  if (route.startsWith('#presenter')) return <Presenter />
  if (route.startsWith('#script')) return <ScriptPage />
  return <Stage />
}
