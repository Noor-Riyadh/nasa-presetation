import { useCallback, useEffect, useRef, useState } from 'react'
import { DEMO_PROMPT, REAL_APP, REAL_REPLAY, SCENES, TOTAL_TARGET, fmt, nextPos, prevPos, type Pos } from './notes'
import { timerControls, useElapsed, useSync } from './shared'

// Presenter view — opens in its own window (N on the stage). Never rendered on the projected stage.
export function Presenter() {
  const [pos, setPos] = useState<Pos>({ scene: 0, step: 0 })
  const posRef = useRef(pos)
  posRef.current = pos
  const elapsed = useElapsed()

  const send = useSync(() => undefined, (p) => setPos(p))
  useEffect(() => {
    const id = setTimeout(() => send({ type: 'cmd', cmd: 'hello' }), 200)
    return () => clearTimeout(id)
  }, [send])

  const cmd = useCallback(
    (c: string, p?: Pos) => {
      send({ type: 'cmd', cmd: c, pos: p })
      if (c === 'next') setPos(nextPos(posRef.current))
      if (c === 'prev') setPos(prevPos(posRef.current))
      if (c === 'goto' && p) setPos(p)
    },
    [send],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault()
        cmd('next')
      } else if (e.key === 'ArrowLeft' || e.key === 'Backspace' || e.key === 'PageUp') {
        e.preventDefault()
        cmd('prev')
      } else if (e.key === 'Home') cmd('goto', { scene: 0, step: 0 })
      else if (e.key === 't' || e.key === 'T') timerControls.reset()
      else if (e.key === 'r' || e.key === 'R') cmd('replay')
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [cmd])

  const m = SCENES[pos.scene]
  const nxt = nextPos(pos)
  const nm = SCENES[nxt.scene]
  const sceneBudget = m.end - m.start
  const delta = elapsed - m.start // >0 = behind this scene's target start
  const running = !!(JSON.parse(localStorage.getItem('embernova-timer') || '{}') as { startedAt?: number }).startedAt
  const status = elapsed === 0 ? '' : delta > 20 ? 'behind' : delta < -20 ? 'ahead' : 'on-pace'

  return (
    <div className="pv" dir="ltr">
      <header className="pv-top">
        <div>
          <div className="pv-k">EMBERNOVA · PRESENTER VIEW — NOT FOR PROJECTION</div>
          <h1>
            {pos.scene + 1}. {m.title}
          </h1>
        </div>
        <div className="pv-clock">
          <div className={`pv-time ${status}`}>{fmt(elapsed)}</div>
          <div className="pv-sub">
            target {fmt(m.start)}–{fmt(m.end)} · total {fmt(TOTAL_TARGET)}
            {status && <b> · {status === 'ahead' ? 'ahead of plan' : status === 'behind' ? 'behind plan' : 'on pace'}</b>}
          </div>
          <div className="pv-btns">
            <button onClick={() => (running ? timerControls.pause() : timerControls.start())}>{running ? 'Pause' : 'Start'} timer</button>
            <button onClick={() => timerControls.reset()}>Reset (T)</button>
          </div>
        </div>
      </header>

      <div className="pv-grid">
        <nav className="pv-scenes">
          {SCENES.map((s, i) => (
            <button key={s.id} className={i === pos.scene ? 'cur' : ''} onClick={() => cmd('goto', { scene: i, step: 0 })}>
              <span>{i + 1}</span>
              <em>{s.title}</em>
              <small>
                {s.speaker.replace('Speaker ', 'S')} · {fmt(s.start)}
              </small>
            </button>
          ))}
        </nav>

        <main className="pv-main">
          <div className="pv-meta">
            <span className="pv-tag">{m.speaker} (suggested)</span>
            <span className="pv-tag">
              scene budget {fmt(sceneBudget)} · step {pos.step + 1} of {m.steps}
            </span>
          </div>

          <div className="pv-cues">
            {m.cueLabels.map((c, i) => (
              <button key={i} className={`cue ${i === pos.step ? 'cur' : i < pos.step ? 'done' : ''}`} onClick={() => cmd('goto', { scene: pos.scene, step: i })}>
                <b>{i + 1}</b> {c}
              </button>
            ))}
          </div>

          <div className="pv-script" dir="rtl" lang="ar">
            {m.script.map((l, i) =>
              l.startsWith('▶') ? (
                <div key={i} className="cue-line" dir="ltr">
                  {l}
                </div>
              ) : l.startsWith('(') ? (
                <div key={i} className="dir-line">
                  {l}
                </div>
              ) : (
                <p key={i}>{l}</p>
              ),
            )}
          </div>

          {m.note && (
            <div className="pv-note" dir="rtl" lang="ar">
              <b>ملاحظة:</b> {m.note}
            </div>
          )}
          {m.id === 'demo' && (
            <div className="pv-demo" dir="ltr">
              <div className="pv-k">DEMO PROMPT</div>
              <div className="pv-prompt">{DEMO_PROMPT}</div>
              <div className="pv-btns">
                <button onClick={() => void navigator.clipboard.writeText(DEMO_PROMPT)}>Copy prompt</button>
                <a href={REAL_APP} target="_blank" rel="noopener noreferrer">
                  Open real EmberNova ↗
                </a>
                <a href={REAL_REPLAY} target="_blank" rel="noopener noreferrer">
                  Recorded session ↗
                </a>
              </div>
            </div>
          )}
        </main>

        <aside className="pv-side">
          <div className="pv-k">CONTROL</div>
          <div className="pv-big">
            <button onClick={() => cmd('prev')}>◀ Back</button>
            <button className="go" onClick={() => cmd('next')}>
              Next ▶
            </button>
          </div>
          <div className="pv-k">UP NEXT</div>
          <div className="pv-next">
            {nxt.scene === pos.scene ? (
              <>
                <b>
                  Step {nxt.step + 1}
                </b>
                <span>{nm.cueLabels[nxt.step]}</span>
              </>
            ) : pos.scene === SCENES.length - 1 && pos.step === m.steps - 1 ? (
              <span>End of presentation.</span>
            ) : (
              <>
                <b>
                  Scene {nxt.scene + 1} — {nm.title}
                </b>
                <span>{nm.cueLabels[0]}</span>
              </>
            )}
          </div>
          <div className="pv-k">SHORTCUTS (STAGE WINDOW)</div>
          <ul className="pv-keys">
            <li><kbd>→</kbd> <kbd>Space</kbd> next</li>
            <li><kbd>←</kbd> <kbd>Backspace</kbd> back</li>
            <li><kbd>1</kbd>–<kbd>9</kbd> jump to scene</li>
            <li><kbd>Home</kbd> <kbd>End</kbd> first / last</li>
            <li><kbd>F</kbd> fullscreen · <kbd>Esc</kbd> exit</li>
            <li><kbd>D</kbd> show/hide on-stage controls</li>
            <li><kbd>P</kbd> pause motion · <kbd>R</kbd> replay scene</li>
            <li><kbd>M</kbd> sound · <kbd>N</kbd> this window</li>
            <li><kbd>O</kbd> open real app · <kbd>C</kbd> copy question (demo)</li>
          </ul>
          <a className="pv-link" href="#script" target="_blank" rel="noopener noreferrer">
            Printable script ↗
          </a>
        </aside>
      </div>
    </div>
  )
}

export function ScriptPage() {
  return (
    <div className="sp">
      <header>
        <h1>EmberNova — Speaker Script</h1>
        <p>
          Target {fmt(TOTAL_TARGET)} · Egyptian Arabic delivery · Lines marked ▶ are advance cues (→ / Space). Speaker split is a suggestion. <button className="noprint" onClick={() => window.print()}>Print</button>
        </p>
      </header>
      {SCENES.map((s, i) => (
        <section key={s.id}>
          <h2>
            <span>{i + 1}</span> {s.title} <small>{fmt(s.start)}–{fmt(s.end)} · {s.speaker}</small>
          </h2>
          <ol className="sp-cues">
            {s.cueLabels.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ol>
          <div dir="rtl" lang="ar" className="sp-ar">
            {s.script.map((l, j) =>
              l.startsWith('▶') ? (
                <div key={j} className="cue-line" dir="ltr">
                  {l}
                </div>
              ) : (
                <p key={j}>{l}</p>
              ),
            )}
          </div>
          {s.note && (
            <p dir="rtl" lang="ar" className="sp-note">
              <b>ملاحظة:</b> {s.note}
            </p>
          )}
        </section>
      ))}
    </div>
  )
}
