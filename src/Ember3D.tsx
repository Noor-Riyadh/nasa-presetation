import { useContext, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { PausedCtx } from './fx'

// A single ember (phase 0→1) swells into a swirling nova: warm core, blue outer arms.
// WebGL is used only here, where growth + orbit actually carries the story. Falls back to CSS glow.

const vert = /* glsl */ `
uniform float uTime; uniform float uPhase; uniform float uFlash; uniform float uPx;
attribute vec4 aSeed;
varying float vR; varying float vA;
void main(){
  float s = aSeed.x;                       // 0..1 identity
  float visible = step(s, mix(0.03, 1.0, pow(uPhase, 0.8)));
  float R = (0.12 + pow(aSeed.y, 0.7) * 3.4) * mix(0.18, 1.0, smoothstep(0.0, 1.0, uPhase)) + uFlash * aSeed.y * 1.6;
  float spin = uTime * (0.5 / (0.35 + R)) + aSeed.z * 6.2831;
  vec3 p = vec3(cos(spin) * R, sin(spin) * R * 0.34, sin(spin * 0.5 + aSeed.w * 6.2831) * R * 0.18);
  // slow tilt so the disc reads as three-dimensional
  float tilt = -0.42; float ct = cos(tilt), st = sin(tilt);
  p = vec3(p.x * ct - p.y * st, p.x * st + p.y * ct, p.z);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float size = (1.2 + aSeed.w * 3.2) * mix(0.8, 1.4, uPhase) * uPx;
  gl_PointSize = size * (6.0 / -mv.z);
  vR = R / 3.5; vA = visible * (0.35 + 0.65 * aSeed.w);
}`

const frag = /* glsl */ `
uniform float uPhase;
varying float vR; varying float vA;
void main(){
  vec2 c = gl_PointCoord - 0.5; float d = length(c);
  float a = smoothstep(0.5, 0.0, d); a *= a;
  vec3 hot = vec3(1.0, 0.72, 0.38); vec3 mid = vec3(1.0, 0.36, 0.12); vec3 cold = vec3(0.30, 0.62, 1.0);
  vec3 col = mix(hot, mid, smoothstep(0.0, 0.25, vR));
  col = mix(col, cold, smoothstep(0.22, 0.85, vR) * smoothstep(0.35, 1.0, uPhase));
  gl_FragColor = vec4(col * 1.5, a * vA);
}`

const coreFrag = /* glsl */ `
uniform float uPhase; uniform float uFlash; uniform float uTime;
varying vec2 vUv;
void main(){
  vec2 c = vUv - 0.5; float d = length(c) * 2.0;
  float size = mix(0.055, 0.5, smoothstep(0.0, 1.0, uPhase));
  float core = exp(-pow(d / size, 2.0) * 1.8);
  float halo = exp(-d * mix(7.0, 2.6, uPhase)) * mix(0.15, 0.55, uPhase);
  float flick = 0.92 + 0.08 * sin(uTime * 9.0) * (1.0 - uPhase * 0.7);
  vec3 col = vec3(1.0, 0.82, 0.55) * core * flick + vec3(1.0, 0.38, 0.12) * halo + vec3(0.25, 0.55, 1.0) * halo * uPhase * 0.7;
  col += vec3(1.0, 0.9, 0.7) * uFlash * exp(-d * 2.5);
  float a = clamp(core + halo + uFlash * exp(-d * 2.5), 0.0, 1.0);
  gl_FragColor = vec4(col, a);
}`

export function webglOk() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

export function EmberField({ phase }: { phase: number }) {
  const host = useRef<HTMLDivElement>(null)
  const phaseRef = useRef(phase)
  const pausedRef = useRef(false)
  const paused = useContext(PausedCtx)
  const [fallback, setFallback] = useState(false)
  phaseRef.current = phase
  pausedRef.current = paused

  useEffect(() => {
    const el = host.current
    if (!el) return
    if (!webglOk()) {
      setFallback(true)
      return
    }
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    } catch {
      setFallback(true)
      return
    }
    const W = 1920
    const H = 1080
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setSize(W, H, false)
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.className = 'fx-canvas'
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 50)
    camera.position.set(0, 0, 6)

    const N = 5200
    const seed = new Float32Array(N * 4)
    for (let i = 0; i < N; i++) {
      seed[i * 4] = i / N
      seed[i * 4 + 1] = Math.random()
      seed[i * 4 + 2] = Math.random()
      seed[i * 4 + 3] = Math.random()
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3))
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 4))
    const uni = {
      uTime: { value: 0 },
      uPhase: { value: 0 },
      uFlash: { value: 0 },
      uPx: { value: renderer.getPixelRatio() * 2.2 },
    }
    const pm = new THREE.ShaderMaterial({
      uniforms: uni,
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const pts = new THREE.Points(geo, pm)
    pts.frustumCulled = false
    scene.add(pts)

    const cm = new THREE.ShaderMaterial({
      uniforms: uni,
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: coreFrag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const core = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), cm)
    scene.add(core)

    let ph = 0
    let prev = 0
    let raf = 0
    let last = performance.now()
    let t = 0
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const target = phaseRef.current
      ph += (target - ph) * Math.min(1, dt * 1.15)
      if (!pausedRef.current && !reduce) t += dt
      if (target > 0.9 && prev <= 0.9) uni.uFlash.value = 1 // flash at the moment of ignition
      prev = target
      uni.uFlash.value *= Math.pow(0.04, dt)
      uni.uPhase.value = ph
      uni.uTime.value = t
      camera.position.x = Math.sin(t * 0.12) * 0.35
      camera.position.y = Math.cos(t * 0.1) * 0.15
      camera.lookAt(0, 0, 0)
      renderer.render(scene, camera)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      geo.dispose()
      pm.dispose()
      cm.dispose()
      core.geometry.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
    }
  }, [])

  return (
    <div ref={host} className="ember-host">
      {fallback && (
        <div
          className="ember-fallback"
          style={{ ['--p' as string]: phase }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}
