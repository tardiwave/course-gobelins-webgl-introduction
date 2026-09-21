import { Camera, Mesh, Orbit, Program, Renderer, Sphere, Transform, Vec3 } from 'ogl'
import { loadTexture } from '../../../utils/texture.ts'
import { createPanel } from '../../../utils/panel.ts'
import palette from '../../../shaders/chunks/palette.glsl?raw'
import vertex from './vertex.glsl?raw'
import fragmentSource from './fragment.glsl?raw'
import cloudsSource from './clouds.frag.glsl?raw'
import haloSource from './halo.frag.glsl?raw'

const HALO_SCALE = 1.25

export function start(root: HTMLElement) {
  const renderer = new Renderer({ dpr: Math.min(devicePixelRatio, 2), webgl: 1 })
  const gl = renderer.gl
  root.append(gl.canvas)

  // The same dark as DARK in the palette.
  gl.clearColor(0.055, 0.059, 0.067, 1)

  const camera = new Camera(gl, { fov: 45, near: 0.1, far: 100 })
  camera.position.z = 3.4

  const resize = () => {
    renderer.setSize(root.clientWidth, root.clientHeight)
    camera.perspective({ aspect: root.clientWidth / root.clientHeight })
  }

  const observer = new ResizeObserver(resize)
  observer.observe(root)

  const scene = new Transform()
  const geometry = new Sphere(gl, { radius: 1, widthSegments: 48 })
  const light = { value: new Vec3(1, 0.4, 0.6) }
  const elapsed = { value: 0 }

  const planet = new Mesh(gl, {
    geometry,
    program: new Program(gl, {
      vertex,
      fragment: palette + fragmentSource,
      uniforms: {
        tMap: { value: loadTexture(gl, '/textures/earth.png') },
        tNormal: { value: loadTexture(gl, '/textures/earth-normal.png') },
        uLight: light,
        uStrength: { value: 0.55 },
        uRim: { value: 3 },
      },
    }),
  })
  planet.setParent(scene)

  // The same sphere, barely larger, drawn with transparency.
  const clouds = new Mesh(gl, {
    geometry,
    program: new Program(gl, {
      vertex,
      fragment: palette + cloudsSource,
      uniforms: {
        tClouds: { value: loadTexture(gl, '/textures/clouds.png') },
        tNoise: { value: loadTexture(gl, '/textures/noise.jpg', true) },
        uLight: light,
        uTime: elapsed,
        uWarp: { value: 0.012 },
      },
      transparent: true,
      depthWrite: false,
    }),
  })
  clouds.scale.set(1.012)
  clouds.setParent(scene)

  const halo = new Mesh(gl, {
    geometry,
    program: new Program(gl, {
      vertex,
      fragment: palette + haloSource,
      uniforms: { uLight: light, uScale: { value: HALO_SCALE }, uFalloff: { value: 6.5 } },
      transparent: true,
      cullFace: gl.FRONT,
      depthWrite: false,
    }),
  })
  halo.scale.set(HALO_SCALE)
  halo.setParent(scene)

  const orbit = new Orbit(camera, { element: gl.canvas })

  const panel = createPanel(root)
  panel.pane.addBinding(clouds.program.uniforms.uWarp, 'value', {
    label: 'warp',
    min: 0,
    max: 0.06,
    step: 0.001,
  })

  let frame = 0
  const origin = performance.now()

  const render = (now: number) => {
    const time = (now - origin) / 1000

    elapsed.value = time
    light.value.set(Math.cos(time * 0.25), 0.4, Math.sin(time * 0.25)).normalize()

    planet.rotation.y = time * 0.08
    planet.rotation.z = 0.41

    // Clouds drift a little faster than the ground below them.
    clouds.rotation.y = time * 0.11
    clouds.rotation.z = 0.41

    orbit.update()
    renderer.render({ scene, camera })
    frame = requestAnimationFrame(render)
  }

  frame = requestAnimationFrame(render)

  return () => {
    panel.dispose()
    orbit.remove()
    cancelAnimationFrame(frame)
    observer.disconnect()
    gl.canvas.remove()
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}
