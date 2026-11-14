// Fully synthesized, optional sound design (no audio files, nothing autoplays).
// Everything routes through one master gain with a hard ceiling so it can never mask live speech.

export type Mood = 'silence' | 'ocean' | 'space' | 'dread' | 'warm'

const CEILING = 0.22 // max master gain at 100% volume

class Sound {
  private ctx: AudioContext | null = null
  private master!: GainNode
  private beds: Record<string, GainNode> = {}
  private noise!: AudioBuffer
  enabled = false
  volume = 0.5
  mood: Mood = 'silence'

  private ensure() {
    if (this.ctx) return
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return
    const ctx = new AC()
    this.ctx = ctx
    this.master = ctx.createGain()
    this.master.gain.value = 0
    this.master.connect(ctx.destination)

    // shared noise buffer (6 s, brown-ish)
    const len = ctx.sampleRate * 6
    this.noise = ctx.createBuffer(1, len, ctx.sampleRate)
    const d = this.noise.getChannelData(0)
    let last = 0
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1
      last = (last + 0.02 * w) / 1.02
      d[i] = last * 3.5
    }
    const mkNoise = () => {
      const s = ctx.createBufferSource()
      s.buffer = this.noise
      s.loop = true
      s.start()
      return s
    }
    const mkBed = (name: string) => {
      const g = ctx.createGain()
      g.gain.value = 0
      g.connect(this.master)
      this.beds[name] = g
      return g
    }
    const lfo = (freq: number, depth: number, target: AudioParam) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.frequency.value = freq
      g.gain.value = depth
      o.connect(g)
      g.connect(target)
      o.start()
    }

    // OCEAN: low-passed swell + slow breathing
    {
      const bed = mkBed('ocean')
      const f = ctx.createBiquadFilter()
      f.type = 'lowpass'
      f.frequency.value = 520
      const swell = ctx.createGain()
      swell.gain.value = 0.7
      lfo(0.09, 0.35, swell.gain)
      mkNoise().connect(f)
      f.connect(swell)
      swell.connect(bed)
    }
    // SPACE: sub drone + faint air
    {
      const bed = mkBed('space')
      for (const [fr, ga] of [[55, 0.5], [82.6, 0.22], [110.4, 0.1]] as const) {
        const o = ctx.createOscillator()
        o.type = 'sine'
        o.frequency.value = fr
        const g = ctx.createGain()
        g.gain.value = ga
        lfo(0.05 + fr / 4000, ga * 0.4, g.gain)
        o.connect(g)
        g.connect(bed)
        o.start()
      }
      const hp = ctx.createBiquadFilter()
      hp.type = 'highpass'
      hp.frequency.value = 2400
      const air = ctx.createGain()
      air.gain.value = 0.015
      mkNoise().connect(hp)
      hp.connect(air)
      air.connect(bed)
    }
    // DREAD: tense low cluster
    {
      const bed = mkBed('dread')
      for (const fr of [41.2, 43.7, 61.7]) {
        const o = ctx.createOscillator()
        o.type = 'sawtooth'
        o.frequency.value = fr
        const f = ctx.createBiquadFilter()
        f.type = 'lowpass'
        f.frequency.value = 160
        const g = ctx.createGain()
        g.gain.value = 0.16
        lfo(0.07, 0.06, g.gain)
        o.connect(f)
        f.connect(g)
        g.connect(bed)
        o.start()
      }
    }
    // WARM: open fifth pad for the reveal / ending
    {
      const bed = mkBed('warm')
      for (const fr of [110, 164.8, 220, 329.6]) {
        const o = ctx.createOscillator()
        o.type = 'triangle'
        o.frequency.value = fr
        const g = ctx.createGain()
        g.gain.value = 0.07
        lfo(0.06 + fr / 8000, 0.03, g.gain)
        o.connect(g)
        g.connect(bed)
        o.start()
      }
    }
  }

  private applyMaster() {
    if (!this.ctx) return
    const t = this.ctx.currentTime
    this.master.gain.cancelScheduledValues(t)
    this.master.gain.setTargetAtTime(this.enabled ? this.volume * CEILING : 0, t, 0.25)
  }

  async setEnabled(on: boolean) {
    this.enabled = on
    if (on) {
      this.ensure()
      if (this.ctx && this.ctx.state === 'suspended') await this.ctx.resume()
      this.setMood(this.mood, true)
    }
    this.applyMaster()
  }

  setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v))
    this.applyMaster()
  }

  setMood(m: Mood, force = false) {
    if (m === this.mood && !force) return
    this.mood = m
    if (!this.ctx) return
    const t = this.ctx.currentTime
    const level: Record<string, number> = { ocean: 0.9, space: 0.8, dread: 0.8, warm: 0.8 }
    for (const [name, g] of Object.entries(this.beds)) {
      g.gain.cancelScheduledValues(t)
      g.gain.setTargetAtTime(name === m ? level[name] : 0, t, 1.6)
    }
  }

  // one-shots -------------------------------------------------------
  private on() {
    return this.ctx && this.enabled && this.ctx.state === 'running'
  }
  thud() {
    if (!this.on()) return
    const ctx = this.ctx!
    const t = ctx.currentTime
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.frequency.setValueAtTime(70, t)
    o.frequency.exponentialRampToValueAtTime(28, t + 1.2)
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.9, t + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.8)
    o.connect(g)
    g.connect(this.master)
    o.start(t)
    o.stop(t + 2)
  }
  swell(seconds = 3) {
    if (!this.on()) return
    const ctx = this.ctx!
    const t = ctx.currentTime
    const s = ctx.createBufferSource()
    s.buffer = this.noise
    const f = ctx.createBiquadFilter()
    f.type = 'bandpass'
    f.Q.value = 1.2
    f.frequency.setValueAtTime(180, t)
    f.frequency.exponentialRampToValueAtTime(2600, t + seconds)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.5, t + seconds * 0.9)
    g.gain.exponentialRampToValueAtTime(0.0001, t + seconds + 0.6)
    s.connect(f)
    f.connect(g)
    g.connect(this.master)
    s.start(t)
    s.stop(t + seconds + 0.7)
  }
  chime(freq = 659.25) {
    if (!this.on()) return
    const ctx = this.ctx!
    const t = ctx.currentTime
    for (const [mul, a] of [[1, 0.5], [2.003, 0.18], [3.01, 0.08]] as const) {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.frequency.value = freq * mul
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(a, t + 0.03)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 3.4)
      o.connect(g)
      g.connect(this.master)
      o.start(t)
      o.stop(t + 3.5)
    }
  }
  tick() {
    if (!this.on()) return
    const ctx = this.ctx!
    const t = ctx.currentTime
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.frequency.value = 1500
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.06, t + 0.005)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09)
    o.connect(g)
    g.connect(this.master)
    o.start(t)
    o.stop(t + 0.12)
  }
}

export const sound = new Sound()

// Sound cues per scene/step. Everything is optional; the deck is complete in silence.
export function audioCue(scene: number, step: number) {
  switch (scene) {
    case 0:
      if (step === 0) sound.setMood('silence')
      if (step === 1) sound.setMood('ocean')
      if (step === 3) { sound.setMood('dread'); sound.thud() }
      break
    case 1:
      if (step === 0) sound.setMood('ocean')
      if (step === 1) sound.setMood('space')
      if (step === 3) sound.swell(2.5)
      break
    case 2:
      sound.setMood('dread')
      if (step < 2) sound.thud()
      break
    case 3:
      sound.setMood('space')
      break
    case 4:
      if (step === 0) sound.setMood('silence')
      if (step === 1) sound.chime(523.25)
      if (step === 2) { sound.swell(2.2); sound.setMood('warm') }
      if (step === 3) sound.chime(659.25)
      break
    case 5:
    case 6:
      sound.setMood('silence')
      if (scene === 5 && step > 0) sound.tick()
      break
    case 7:
      sound.setMood('space')
      break
    case 8:
      sound.setMood('space')
      break
    case 10:
    case 11:
      sound.setMood('space')
      break
    case 9:
      if (step === 0) sound.setMood('ocean')
      if (step === 1) sound.setMood('space')
      if (step >= 2 && step <= 5) { sound.setMood('silence'); sound.thud() }
      if (step === 6) { sound.setMood('warm'); sound.chime(523.25) }
      break
  }
}
