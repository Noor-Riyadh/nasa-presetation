import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { Caption, Mark, Ocean, Photo, R, Stars, useStep } from './fx'
import { EmberField } from './Ember3D'

export const A = (p: string) => `assets/${p}`

export function useMounted() {
  const [m, setM] = useState(false)
  useEffect(() => {
    let a = 0
    let b = 0
    a = requestAnimationFrame(() => {
      b = requestAnimationFrame(() => setM(true))
    })
    return () => {
      cancelAnimationFrame(a)
      cancelAnimationFrame(b)
    }
  }, [])
  return m
}

// Opacity layer driven by the step: o[step] (clamped). `from` is the opacity before the first frame
// so a scene can animate in on mount.
export function Lyr({
  o,
  from,
  tr = 2.4,
  className = '',
  style,
  children,
}: {
  o: number[]
  from?: number
  tr?: number
  className?: string
  style?: CSSProperties
  children?: ReactNode
}) {
  const step = useStep()
  const m = useMounted()
  const val = from !== undefined && !m ? from : o[Math.min(step, o.length - 1)]
  return (
    <div className={`lyr ${className}`} style={{ opacity: val, transitionDuration: `${tr}s`, ...style }}>
      {children}
    </div>
  )
}

/* ───────────── SCENE 1 — THE UNSINKABLE ───────────── */
export function Scene1() {
  const step = useStep()
  return (
    <>
      <Lyr o={[0.35, 0.8, 0.85, 1]} from={0} tr={3.5}>
        <Ocean tint={step >= 3 ? 1 : 0} />
      </Lyr>
      <Lyr o={[0, 0.92, 0.92, 0.28]} tr={3.2} className="titanic-wrap">
        <div className="titanic">
          <img src={A('titanic.jpg')} alt="RMS Titanic, April 1912 (archival photograph)" draggable={false} className="kb kb-a" />
        </div>
        <div className="fogband f1" />
        <div className="fogband f2" />
      </Lyr>
      <Lyr o={[0, 0, 0, 1]} tr={2.6} className="s1-cold" />
      {/* iceberg — an illustration, labelled as such */}
      <div className={`iceberg ${step >= 3 ? 'up' : ''}`}>
        <svg viewBox="0 0 560 520" width="560" height="520">
          <defs>
            <linearGradient id="ib" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#dff1ff" />
              <stop offset=".5" stopColor="#7fb2dd" />
              <stop offset="1" stopColor="#1d3a5f" />
            </linearGradient>
          </defs>
          <polygon points="10,520 70,330 130,360 190,190 250,240 300,60 350,200 410,150 470,300 540,330 560,520" fill="url(#ib)" opacity=".92" />
          <polygon points="300,60 350,200 300,230 270,170" fill="#ffffff" opacity=".35" />
        </svg>
      </div>
      <R at={1} v="blur" className="y1912">
        1912
      </R>
      <R at={2} v="fade" d={0.2} className="unsink">
        THE UNSINKABLE
      </R>
      <R at={3} v="fade" className="tag-illus">
        ICEBERG · ILLUSTRATION, NOT A RECONSTRUCTION
      </R>
      <R at={1} v="fade" d={1.2}>
        <Caption>ARCHIVAL PHOTOGRAPH · RMS TITANIC DEPARTING SOUTHAMPTON, APRIL 1912 · PUBLIC DOMAIN (F.G.O. STUART)</Caption>
      </R>
    </>
  )
}

/* ───────────── SCENE 2 — THERE IS NOWHERE TO ESCAPE ───────────── */
export function Scene2() {
  return (
    <>
      <Lyr o={[0]} from={1} tr={5}>
        <Ocean />
      </Lyr>
      <Lyr o={[1]} from={0} tr={5}>
        <Stars />
      </Lyr>
      <Lyr o={[0, 1, 0.22, 0.12]} tr={3} className="earth2">
        <Photo src={A('earth-artemis2.jpg')} drift="b" />
      </Lyr>
      <Lyr o={[0, 0, 1, 1]} tr={3}>
        <Photo src={A('orion-pov.jpg')} drift="a" className="orion" />
        <div className="scrim-bl" />
      </Lyr>
      <Lyr o={[0, 0, 0, 1]} tr={2.2} className="glow-wrap">
        <div className="orange-glow" />
      </Lyr>
      <R at={1} until={2} v="fade" d={0.8}>
        <Caption>EARTH · ARTEMIS II · NASA</Caption>
      </R>
      <R at={2} v="rise" className="h-bl">
        <div className="h-small">IN SPACE,</div>
        <div className="h-big">THERE IS NO ESCAPE.</div>
      </R>
      <R at={3} v="fade" d={0.5} className="three-nos">
        NO FIREFIGHTERS &nbsp;·&nbsp; NO EXIT &nbsp;·&nbsp; NO TIME TO WAIT
      </R>
      <R at={2} v="fade" d={1}>
        <Caption side="right">ORION SPACECRAFT · ARTEMIS II · NASA{' '}{' '}·{' '}{' '}ORANGE GLOW IS AN ILLUSTRATIVE EFFECT</Caption>
      </R>
    </>
  )
}

/* ───────────── SCENE 3 — THE COST OF FAILURE ───────────── */
export function Scene3() {
  return (
    <>
      <div className="split">
        <R at={0} v="wipe" className="pane pane-l">
          <Photo src={A('apollo1-cm.jpg')} drift="a" className="grade-warm" />
          <div className="pane-scrim" />
          <div className="pane-txt">
            <div className="yr">1967</div>
            <div className="pn">APOLLO 1</div>
            <div className="ev">Ground-test cabin fire</div>
            <div className="ft">Three astronauts lost their lives.</div>
          </div>
          <div className="pane-src">NASA · S67-21294 · COMMAND MODULE 012 AFTER THE FIRE</div>
        </R>
        <R at={1} v="wipe" className="pane pane-r">
          <Photo src={A('apollo13-sm.jpg')} drift="b" className="grade-cold" />
          <div className="pane-scrim" />
          <div className="pane-txt">
            <div className="yr">1970</div>
            <div className="pn">APOLLO 13</div>
            <div className="ev">Oxygen tank explosion</div>
            <div className="ft">A Moon mission became an emergency return.</div>
            <div className="chip">SERVICE-MODULE TANK RUPTURE — NOT A CABIN FIRE</div>
          </div>
          <div className="pane-src">NASA · AS13-59-8562 · DAMAGED SERVICE MODULE</div>
        </R>
        <div className="divider" />
      </div>
      <R at={2} v="fade" className="cost-line">
        <div>A FACT UNDERSTOOD EARLY.</div>
        <div className="alt">A RISK MISSED IN TIME.</div>
      </R>
    </>
  )
}

/* ───────────── SCENE 4 — THE RESEARCH PROBLEM ───────────── */
type DocCard = { t: string; k: string; x: number; y: number; r: number; w?: number }
const DOCS: DocCard[] = [
  { t: 'FLEX · Flame Extinguishment Experiment', k: 'EXPERIMENT', x: 120, y: 150, r: -5 },
  { t: 'NASA/TP–2015–216046 · FLEX final report', k: 'REPORT', x: 560, y: 90, r: 3 },
  { t: 'BASS-II · Burning and Suppression of Solids', k: 'EXPERIMENT', x: 1010, y: 170, r: -2 },
  { t: 'ACME · Gas flame, spherical burner', k: 'EXPERIMENT', x: 1440, y: 110, r: 4 },
  { t: 'CFI-G · gas-flame tables', k: 'DATASET', x: 70, y: 430, r: 4 },
  { t: 'Saffire I–VI · spacecraft-scale fires', k: 'EXPERIMENT', x: 520, y: 380, r: -3 },
  { t: 'SAME-R · smoke source records', k: 'DATASET', x: 980, y: 470, r: 5 },
  { t: 'PSI-69 · MDCA flame view (video)', k: 'VIDEO', x: 1430, y: 400, r: -4 },
  { t: 'SIBAL · simulated lunar gravity', k: 'EXPERIMENT', x: 190, y: 700, r: -3 },
  { t: 'LUCI · plastic rod & fabric burn', k: 'EXPERIMENT', x: 640, y: 690, r: 3 },
  { t: 'FLEX burning-rate K (mm²/s)', k: 'DATASET', x: 1100, y: 760, r: -5 },
  { t: 'PSI-25 · BASS-II raw video', k: 'VIDEO', x: 1500, y: 700, r: 3 },
]

export function Scene4() {
  const step = useStep()
  const m = useMounted()
  return (
    <>
      <Lyr o={[0.0, 0.55, 0.3, 0.12]} from={0} tr={3} className="vid-bg">
        <video src={A('flame-acme.mp4')} autoPlay muted loop playsInline preload="auto" />
      </Lyr>
      <div className="s4-vig" />
      {DOCS.map((d, i) => {
        const tight = step >= 3
        return (
          <div
            key={i}
            className={`doc ${m ? 'in' : ''} ${step === 1 ? 'dim' : ''} ${step >= 2 ? 'blur' : ''} ${tight ? 'gone' : ''}`}
            style={{
              left: d.x,
              top: d.y,
              ['--r' as string]: `${d.r}deg`,
              ['--d' as string]: `${i * 0.12}s`,
            }}
          >
            <div className="dk">{d.k}</div>
            <div className="dt">{d.t}</div>
            <div className="dl" />
            <div className="dl s" />
          </div>
        )
      })}

      <R at={1} until={2} v="rise" className="s4-head">
        <div className="h-kicker">THE RESEARCH PROBLEM</div>
        <div className="h-xl">THE DATA EXISTS.</div>
      </R>
      <R at={1} until={2} v="fade" d={0.6} className="stats">
        {[
          ['34', 'NASA investigations'],
          ['93', 'reports & papers'],
          ['3,187', 'indexed pages'],
          ['1,161', 'source test records'],
        ].map(([n, l]) => (
          <div key={l} className="stat">
            <div className="n">{n}</div>
            <div className="l">{l}</div>
          </div>
        ))}
      </R>
      <R at={2} until={3} v="rise" className="s4-head">
        <div className="h-kicker">…BUT</div>
        <div className="h-xl lg">THE INSIGHT IS HARDER TO FIND.</div>
      </R>
      <R at={2} until={3} v="fade" d={0.7} className="chips">
        {['K · mm²/s', 'pressure · mmHg', 'pressure · psi', 'O₂ · mole fraction %', 'reports · PDF', 'tests · tables', 'video · MP4'].map((c, i) => (
          <span key={c} className="uchip" style={{ ['--i' as string]: i }}>
            {c}
          </span>
        ))}
      </R>
      <R at={3} v="rise" className="manual">
        <div className="h-kicker">THE RESEARCHER’S MANUAL WORKFLOW</div>
        <div className="mflow">
          {[
            ['01', 'Search', 'across many studies'],
            ['02', 'Compare', 'different experiments'],
            ['03', 'Reconcile', 'measurements & units'],
            ['04', 'Analyze', 'the results — alone'],
          ].map(([n, a, b], i) => (
            <div key={n} className="mstep" style={{ ['--d' as string]: `${0.3 + i * 0.35}s` }}>
              <div className="mn">{n}</div>
              <div className="ma">{a}</div>
              <div className="mb">{b}</div>
            </div>
          ))}
        </div>
        <div className="h-mid">Time and effort — before the first insight.</div>
      </R>
      <R at={0} v="fade" d={1}>
        <Caption>EXPERIMENT NAMES AND CORPUS COUNTS: NASA PSI SNAPSHOT AS INDEXED BY EMBERNOVA (2026-11-13) · CARDS ARE ILLUSTRATIVE LAYOUT</Caption>
      </R>
    </>
  )
}

/* ───────────── SCENE 5 — THE REVEAL ───────────── */
export function Scene5() {
  const step = useStep()
  const m = useMounted()
  const phase = step < 1 ? 0 : step === 1 ? 0.1 : 1
  return (
    <>
      <div className="collapse">
        {DOCS.map((d, i) => (
          <div
            key={i}
            className={`doc cdoc ${m ? 'collapsed' : ''} ${step >= 1 ? 'hide' : ''}`}
            style={{ left: d.x, top: d.y, ['--r' as string]: `${d.r}deg`, ['--d' as string]: `${i * 0.08}s` }}
          >
            <div className="dk">{d.k}</div>
            <div className="dt">{d.t}</div>
            <div className="dl" />
          </div>
        ))}
      </div>
      {step >= 1 && (
        <Lyr o={[0, 1, 1, 0.8, 0.55]} tr={2}>
          <EmberField phase={phase} />
        </Lyr>
      )}
      <R at={2} v="zoom" d={1.1} className="reveal-mark">
        <Mark size={150} />
      </R>
      <R at={3} v="blur" className="wordmark">
        EMBER<span>NOVA</span>
      </R>
      <R at={3} v="fade" d={0.8} className="subtitle">
        AUTONOMOUS AI RESEARCH AGENT
      </R>
      <R at={4} v="rise" className="not-chat">
        Not another chatbot.
      </R>
    </>
  )
}
