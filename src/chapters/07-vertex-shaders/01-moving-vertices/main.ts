import { Camera, Mesh, Orbit, Program, Renderer, Sphere, Vec3 } from 'ogl'
import { loadTexture } from '../../../utils/texture.ts'
import palette from '../../../shaders/chunks/palette.glsl?raw'
import vertex from './vertex.glsl?raw'
import fragmentSource from './fragment.glsl?raw'

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

  const program = new Program(gl, {
    vertex,
    fragment: palette + fragmentSource,
    uniforms: {
      tMap: { value: loadTexture(gl, '/textures/earth.png') },
      uLight: { value: new Vec3(1, 0.4, 0.6).normalize() },
      uTime: { value: 0 },
      uAmplitude: { value: 0.08 },
    },
  })

  // A vertex shader can only move vertices that exist: a sphere with too few
  // segments has nothing to bend. Try dropping this to 12.
  const mesh = new Mesh(gl, {
    geometry: new Sphere(gl, { radius: 1, widthSegments: 96 }),
    program,
  })

  const orbit = new Orbit(camera, { element: gl.canvas })

  let frame = 0
  const origin = performance.now()

  const render = (now: number) => {
    const time = (now - origin) / 1000

    program.uniforms.uTime.value = time
    mesh.rotation.y = time * 0.1

    orbit.update()
    renderer.render({ scene: mesh, camera })
    frame = requestAnimationFrame(render)
  }

  frame = requestAnimationFrame(render)

  return () => {
    orbit.remove()
    cancelAnimationFrame(frame)
    observer.disconnect()
    gl.canvas.remove()
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}
