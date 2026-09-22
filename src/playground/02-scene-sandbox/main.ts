import { Camera, Mesh, Orbit, Program, Renderer, Sphere, Vec3 } from 'ogl'
import { createPanel } from '../../utils/panel.ts'
import palette from '../../shaders/chunks/palette.glsl?raw'
import vertex from './vertex.glsl?raw'
import fragmentSource from './fragment.glsl?raw'

export const title = 'Scene v1.0'

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
    uniforms: { uLight: { value: new Vec3(1, 0.4, 0.6) } },
  })

  const mesh = new Mesh(gl, {
    geometry: new Sphere(gl, { radius: 1, widthSegments: 64 }),
    program,
  })

  const orbit = new Orbit(camera, { element: gl.canvas })

  const settings = { spin: 0.2 }
  const panel = createPanel(root)
  panel.pane.addBinding(settings, 'spin', { min: 0, max: 2, step: 0.01 })
  panel.pane.addBinding(program.uniforms.uLight, 'value', { label: 'light' })

  let frame = 0
  const origin = performance.now()

  const render = (now: number) => {
    const time = (now - origin) / 1000

    mesh.rotation.y = time * settings.spin

    orbit.update()
    renderer.render({ scene: mesh, camera })
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
