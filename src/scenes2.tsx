import { useState } from 'react'
import { Caption, Mark, Ocean, Photo, R, Stars, useStep } from './fx'
import { EmberField } from './Ember3D'
import { A, Lyr } from './scenes1'
import { DEMO_PROMPT, REAL_APP, REAL_REPLAY } from './notes'

/* ───────────── SCENE 6 — LIVE RESEARCH DEMONSTRATION ───────────── */
type Focus = { img: string; cx: number; cy: number; sw: number }
type DemoStep = {
  name: string
  what: string
  tag: string
  prov: 'rec' | 'app'
  focus: Focus
}
const DEMO: DemoStep[] = [
  { name: 'NASA Research Search', what: 'The agent searches NASA investigations and report pages for the question.', tag: 'search investigations · search documents · list datasets', prov: 'rec', focus: { img: 'd1-agent', cx: 1040, cy: 380, sw: 900 } },
  { name: 'Agent Tool Execution', what: 'It chooses deterministic, read-only tools and runs them — each call is logged with timing.', tag: 'check applicability envelope · query measurements · make chart', prov: 'rec', focus: { img: 'd1-agent', cx: 1090, cy: 470, sw: 1060 } },
  { name: 'Python Analysis', what: 'Optional Analysis Lab: model-written Python in an isolated container — inputs, code and outputs inspectable.', tag: 'hosted Python · hash-verified inputs · networking disabled', prov: 'rec', focus: { img: 'd5-python', cx: 1100, cy: 540, sw: 1700 } },
  { name: 'Cross-Experiment Comparison', what: 'Compare groups of measured tests — with a pass / warn / fail validity checklist that names confounders.', tag: 'FLEX groups · oxygen · pressure · fuel', prov: 'app', focus: { img: 'd7-compare', cx: 900, cy: 470, sw: 1200 } },
  { name: 'Interactive Charts', what: 'Charts are built by backend code from NASA tables. Click any point to open its source row.', tag: 'burning-rate constant vs. oxygen · methanol / n-heptane', prov: 'rec', focus: { img: 'd3-chart', cx: 1090, cy: 400, sw: 900 } },
  { name: 'NASA Citations', what: 'Every claim carries numbered citations that resolve to that turn’s evidence ledger.', tag: 'Measured · Published · Derived — each cited', prov: 'rec', focus: { img: 'd2-evidence', cx: 1090, cy: 450, sw: 1000 } },
  { name: 'Validation & Uncertainty', what: 'States what the evidence does not show: no partial-gravity combustion data; overlap is not safety.', tag: 'applicability envelope · limits of the evidence', prov: 'rec', focus: { img: 'd4-envelope', cx: 1090, cy: 520, sw: 1000 } },
  { name: 'Evidence-Gap Map', what: 'Every measured test placed by fuel class, oxygen and pressure. Empty cells are research gaps — outlined: the lunar-habitat reference cell.', tag: 'lunar habitat reference cell: 0 measured source records', prov: 'app', focus: { img: 'd6-gapmap', cx: 960, cy: 500, sw: 1400 } },
  { name: 'Research Artifacts & Exports', what: 'Results ship with their files — structured JSON and CSV — plus the code and source references.', tag: 'result.json · fuel_medians.csv', prov: 'rec', focus: { img: 'd8-export', cx: 760, cy: 520, sw: 1000 } },
]
export const DEMO_IMAGES = ["d1-agent", "d5-python", "d7-compare", "d3-chart", "d2-evidence", "d4-envelope", "d6-gapmap", "d8-export"]
const FW = 1240
const FH = 698

function focusTransform(f: Focus | null) {
  if (!f) return `scale(${FW / 1920})`
  const sw = Math.min(1920, f.sw)
  const sh = (sw * 9) / 16
  const x0 = Math.max(0, Math.min(1920 - sw, f.cx - sw / 2))
  const y0 = Math.max(0, Math.min(1080 - sh, f.cy - sh / 2))
  return `scale(${FW / sw}) translate(${-x0}px, ${-y0}px)`
}

export function Scene6() {
  const step = useStep()
  const [copied, setCopied] = useState(false)
  const cur = step > 0 ? DEMO[step - 1] : null
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(DEMO_PROMPT)
    } catch {
      /* clipboard unavailable — ignore */
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <div className="demo">
      <div className="demo-bg" />
      <div className="demo-top">
        <div className="h-kicker">LIVE RESEARCH DEMONSTRATION</div>
        <div className="demo-title">{cur ? cur.name : 'Let EmberNova work.'}</div>
      </div>

      {/* rail */}
      <div className="rail">
        {DEMO.map((d, i) => (
          <div key={d.name} className={`rail-i ${step === i + 1 ? 'act' : step > i + 1 ? 'done' : ''}`}>
            <span className="rn">{i + 1}</span>
            <span className="rt">{d.name}</span>
          </div>
        ))}
      </div>

      {/* step 0: the question + three ways to show it */}
      <R at={0} until={1} v="fade" className="demo-intro">
        <div className="qlabel">RESEARCH QUESTION</div>
        <div className="qtext">“{DEMO_PROMPT}”</div>
        <div className="qrow">
          <a className="btn primary" href={REAL_APP} target="_blank" rel="noopener noreferrer">
            Open the real EmberNova ↗<kbd>O</kbd>
          </a>
          <button className="btn" onClick={copy}>
            {copied ? 'Copied ✓' : 'Copy question'}
            <kbd>C</kbd>
          </button>
          <a className="btn" href={REAL_REPLAY} target="_blank" rel="noopener noreferrer">
            Open recorded session ↗
          </a>
        </div>
        <div className="three-ways">
          <div>
            <b>Live</b>
            <span>The real app, in its own tab. Needs internet. Return here with Alt+Tab — this deck keeps its place.</span>
          </div>
          <div>
            <b>Recorded</b>
            <span>The app’s own recorded sessions replay without any model call.</span>
          </div>
          <div>
            <b>Captured (offline)</b>
            <span>Real screens from that recording, built into this deck — the next steps.</span>
          </div>
        </div>
      </R>

      {/* browser frame with real captures */}
      <div className={`bframe ${step > 0 ? 'on' : ''}`} style={{ width: FW, height: FH + 38 }}>
        <div className="bbar">
          <i />
          <i />
          <i />
          <span>embernova.khedmetak.com</span>
        </div>
        <div className="bview" style={{ width: FW, height: FH }}>
          {DEMO.map((d, i) => (
            <img
              key={d.name}
              src={`demo/${d.focus.img}.jpg`}
              alt={d.name}
              draggable={false}
              className="dimg"
              style={{
                opacity: step === i + 1 ? 1 : 0,
                transform: step === i + 1 ? focusTransform(d.focus) : focusTransform(null),
              }}
            />
          ))}
        </div>
      </div>

      {cur && (
        <div className="demo-cap" key={step}>
          <div className="dc-what">{cur.what}</div>
          <div className="dc-row">
            <span className="pill ok">IMPLEMENTED</span>
            <span className="pill ok">DEMONSTRATED</span>
            <span className="pill src">
              {cur.prov === 'rec' ? 'REAL APP · RECORDED SESSION 2026-11-13' : 'REAL APP · LIVE PAGE CAPTURE (NOT PART OF THE RECORDED RUN)'}
            </span>
            <span className="dc-tag">{cur.tag}</span>
          </div>
        </div>
      )}
      <div className="demo-foot">
        <a href={REAL_APP} target="_blank" rel="noopener noreferrer" className="btn primary sm">
          Open real EmberNova ↗
        </a>
        <span>
          Screens are real captures of the production app. The recorded run asked a related question (lunar-habitat atmosphere, 30–34% O₂ · 520–560 mmHg). Live results may differ.
        </span>
      </div>
    </div>
  )
}

/* ───────────── SCENE 7 — UNDER THE HOOD ───────────── */
const GROUPS = [
  { at: 2, title: 'NASA research search & data', tools: ['search_investigations', 'search_documents', 'get_document_page', 'list_datasets', 'query_measurements'] },
  { at: 3, title: 'Python & numerical analysis', tools: ['make_chart', 'Analysis Lab · isolated hosted Python'] },
  { at: 3, title: 'Cross-experiment comparison', tools: ['compare_runs', 'suppression_overview', 'find_media'] },
  { at: 4, title: 'Scientific validation', tools: ['check_applicability_envelope', 'assess_evidence', 'map_evidence_coverage'] },
]
const GY = 238
const GH = 160
const GG = 22

export function Scene7() {
  const step = useStep()
  const cy = GY + (GH * 4 + GG * 3) / 2
  return (
    <div className="arch">
      <div className="arch-head">
        <div className="h-kicker">UNDER THE HOOD</div>
        <div className="arch-title">
          The model chooses the tools. <em>The data provides the numbers.</em>
        </div>
      </div>

      <svg className="wires" viewBox="0 0 1920 1080" width="1920" height="1080">
        <path className={`wire ${step >= 1 ? 'on' : ''}`} d={`M 296 ${cy} L 372 ${cy}`} />
        {GROUPS.map((g, i) => {
          const gy = GY + i * (GH + GG) + GH / 2
          return (
            <g key={g.title}>
              <path className={`wire ${step >= g.at ? 'on' : ''}`} d={`M 640 ${cy} C 700 ${cy}, 690 ${gy}, 744 ${gy}`} />
              <path className={`wire ${step >= 5 ? 'on' : ''}`} d={`M 1190 ${gy} C 1230 ${gy}, 1220 ${cy}, 1270 ${cy}`} />
            </g>
          )
        })}
        <path className={`wire ${step >= 5 ? 'on' : ''}`} d={`M 1530 ${cy} L 1604 ${cy}`} />
        <path className={`wire loop ${step >= 6 ? 'on' : ''}`} d={`M 1730 ${GY + 4 * GH + 3 * GG + 10} C 1730 1010, 180 1010, 180 ${GY + 4 * GH + 3 * GG + 10} L 180 ${cy + 56}`} />
      </svg>

      <R at={0} v="rise" className="node q" style={{ top: cy - 70, left: 56, width: 240 }}>
        <div className="nl">USER</div>
        <div className="nt">Research question</div>
      </R>

      <R at={1} v="zoom" className="agent" style={{ top: cy - 140, left: 372 }}>
        <div className="a-ring" />
        <div className="a-in">
          <Mark size={52} />
          <div className="nt">Autonomous Agent</div>
          <div className="as">plans · picks tools · explains</div>
          <span className="si">SI</span>
        </div>
      </R>

      {GROUPS.map((g, i) => (
        <R key={g.title} at={g.at} v="rise" className="node grp" style={{ top: GY + i * (GH + GG), left: 744, width: 446, height: GH }}>
          <div className="nl">TOOLS</div>
          <div className="nt">{g.title}</div>
          <div className="tools">
            {g.tools.map((t) => (
              <code key={t}>{t}</code>
            ))}
          </div>
        </R>
      ))}

      <R at={5} v="rise" className="node ledger" style={{ top: cy - 110, left: 1270, width: 260, height: 220 }}>
        <div className="nl">EVIDENCE</div>
        <div className="nt">Evidence ledger</div>
        <div className="ns">Every passage and measured row gets an ID. Citations must resolve here — or are removed.</div>
      </R>
      <R at={5} v="rise" d={0.3} className="node out" style={{ top: cy - 110, left: 1604, width: 270, height: 220 }}>
        <div className="nl">OUTPUT</div>
        <div className="nt">Validated answer</div>
        <div className="ns">Cited answer · charts · evidence-gap map · exports</div>
      </R>
      <R at={6} v="fade" className="loop-label">
        MULTI-TURN RESEARCH SESSIONS — ASK DEEPER, BUILD ON PRIOR RESULTS
      </R>
      <R at={0} v="fade" d={1}>
        <Caption>TOOL NAMES AND ARCHITECTURE AS DESCRIBED ON EMBERNOVA’S “HOW IT WORKS” PAGE · HIGH-LEVEL, NOT AN INFRASTRUCTURE DIAGRAM</Caption>
      </R>
    </div>
  )
}

/* ───────────── SCENE 8 — THE FUTURE ───────────── */
export function Scene8() {
  return (
    <>
      <Lyr o={[1, 0.0, 0.0]} tr={3.2}>
        <Photo src={A('earth-limb.jpg')} drift="b" />
      </Lyr>
      <Lyr o={[0, 1, 1]} tr={3.2}>
        <Photo src={A('orion-pov.jpg')} drift="c" className="orion" />
        <div className="scrim-r" />
      </Lyr>
      <div className="fut">
        <R at={1} v="rise" className="fl">
          BETTER RESEARCH.
        </R>
        <R at={1} v="rise" d={0.45} className="fl">
          BETTER DECISIONS.
        </R>
        <R at={2} v="rise" className="fl hot">
          SAFER EXPLORATION.
        </R>
        <R at={2} v="fade" d={1.2} className="fscope">
          Not a replacement for scientists or safety testing.
        </R>
      </div>
      <R at={0} v="fade" d={1}>
        <Caption>{'EARTH ORBIT · ISS · NASA   →   ORION AND THE MOON · ARTEMIS II · NASA'}</Caption>
      </R>
    </>
  )
}

/* ───────────── SCENE 9 — FULL CIRCLE ───────────── */
export function Scene9() {
  const step = useStep()
  return (
    <>
      <Lyr o={[1, 0.0]} tr={4.5}>
        <Ocean />
      </Lyr>
      <Lyr o={[0.0, 0.0]} from={0} tr={4}>
        <Stars />
      </Lyr>
      <Lyr o={[0.24, 0.0]} tr={4} className="titanic-wrap ghost">
        <div className="titanic">
          <img src={A('titanic.jpg')} alt="" draggable={false} className="kb kb-a" />
        </div>
      </Lyr>
      <Lyr o={[0, 0.9, 0.55, 0.45, 0.4, 0.35, 0.0]} tr={4}>
        <Photo src={A('earth-limb.jpg')} drift="a" />
      </Lyr>
      <Lyr o={[0, 0.25, 0.8, 0.85, 0.85, 0.85, 0]} tr={3}>
        <div className="scrim-c" />
      </Lyr>
      <R at={1} until={2} v="fade" d={1.5} className="e-kicker">
        LEARNING BEFORE IT IS TOO LATE
      </R>
      <div className="because">
        <R at={2} until={6} v="fade" className="bk">
          BECAUSE IN SPACE…
        </R>
        <R at={3} until={6} v="rise" className="bl">
          THERE IS NO ROOM FOR <b>GUESSING.</b>
        </R>
        <R at={4} until={6} v="rise" className="bl">
          THERE IS NO ROOM FOR <b>IGNORING THE EVIDENCE.</b>
        </R>
        <R at={5} until={6} v="rise" className="bl">
          THERE IS NO ROOM FOR <b>LEARNING TOO LATE.</b>
        </R>
      </div>
      {step >= 6 && (
        <Lyr o={[0.6]} from={0} tr={3} className="end-field">
          <EmberField phase={0.62} />
        </Lyr>
      )}
      <div className="final">
        <R at={6} v="zoom" d={0.3}>
          <Mark size={110} />
        </R>
        <R at={6} v="blur" d={0.7} className="wordmark big">
          EMBER<span>NOVA</span>
        </R>
        <R at={6} v="fade" d={1.6} className="tagline">
          Turning NASA’s research into actionable scientific insight.
        </R>
        <R at={6} v="fade" d={2.6} className="thanks">
          Thank you.
        </R>
      </div>
    </>
  )
}
