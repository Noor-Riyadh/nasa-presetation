import { Mark, R, Stars } from './fx'

/* Appendix scenes (after the finale): Team, and the awards we are aiming for. */

const TEAM = [
  {
    name: 'Yassin Sheirf',
    role: 'AI Engineer',
    does: ['Designed the autonomous agent workflow', 'Connected the agent to NASA data tools and analysis'],
  },
  {
    name: 'Sally Ashraf',
    role: 'Scientific Researcher',
    does: ['Grounded the project in NASA combustion science', 'Defined how evidence, limits and uncertainty are judged'],
  },
  {
    name: 'Noor Riyadh',
    role: 'Full-Stack Developer',
    does: ['Built the EmberNova web application end to end', 'Built this cinematic presentation experience'],
  },
  {
    name: 'Aya Hesham',
    role: 'Presenter & Storyteller',
    does: ['Presents EmberNova to the judges', 'Shaped the “Disaster to Discovery” story'],
  },
]

const initials = (n: string) =>
  n
    .split(' ')
    .map((w) => w[0])
    .join('')

export function Scene10() {
  return (
    <div className="team">
      <div className="team-bg" />
      <Stars count={160} className="team-stars" />
      <R at={0} v="rise" className="team-head">
        <div className="h-kicker">NASA SPACE APPS 2026 · EMBERNOVA</div>
        <div className="team-title">The Team</div>
      </R>
      <div className="team-row">
        {TEAM.map((m, i) => (
          <R key={m.name} at={1} v="rise" d={i * 0.18} className="member">
            <div className="avatar">{initials(m.name)}</div>
            <div className="mname">{m.name}</div>
            <div className="mrole">{m.role}</div>
            <ul>
              {m.does.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </R>
        ))}
      </div>
      <R at={1} v="fade" d={1.2} className="team-foot">
        <Mark size={44} />
        <span>EmberNova — Autonomous AI Research Agent</span>
      </R>
    </div>
  )
}

const AWARDS = [
  {
    name: 'Best Use of Science',
    def: 'The best and most valid use of science and the scientific method.',
    why: 'Every number traces to a NASA source. Validity checklists name confounders, and the system states what the evidence does not show — association, never extrapolation.',
  },
  {
    name: 'Best Use of Data',
    def: 'Makes space data accessible, or leverages it for a unique application.',
    why: '34 NASA investigations, 93 reports and 1,161 test records in one searchable, comparable workspace — with an evidence-gap map of what has never been measured.',
  },
  {
    name: 'Best Use of Technology',
    def: 'The most innovative use of technology.',
    why: 'An autonomous agent that chooses deterministic tools, runs Python in an isolated container, and has its citations and numbers audited automatically.',
  },
  {
    name: 'Galactic Impact',
    def: 'The most potential to improve life on Earth or in the universe.',
    why: 'Faster access to fire-safety evidence for future crewed missions — better decisions where the nearest help is a planet away.',
  },
  {
    name: 'Best Use of Storytelling',
    def: 'Creatively communicates the potential of open data through storytelling.',
    why: 'Titanic → Apollo → EmberNova: a human story that makes the research problem felt before the solution appears.',
  },
]

export function Scene11() {
  return (
    <div className="awards">
      <div className="team-bg" />
      <R at={0} v="rise" className="aw-head">
        <div className="h-kicker">NASA SPACE APPS · GLOBAL AWARDS</div>
        <div className="team-title sm">Where EmberNova fits</div>
      </R>
      <div className="aw-list">
        {AWARDS.map((a, i) => (
          <R key={a.name} at={1} v="rise" d={i * 0.22} className="aw-row">
            <div className="aw-n">{i + 1}</div>
            <div className="aw-l">
              <div className="aw-name">{a.name}</div>
              <div className="aw-def">{a.def}</div>
            </div>
            <div className="aw-why">{a.why}</div>
          </R>
        ))}
      </div>
      <R at={1} v="fade" d={1.6} className="aw-foot">
        5 of the 10 NASA Space Apps Global Awards · award definitions from spaceappschallenge.org
      </R>
    </div>
  )
}
