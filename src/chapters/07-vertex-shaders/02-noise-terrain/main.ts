import { Camera, Mesh, Orbit, Program, Renderer, Sphere, Vec3 } from 'ogl'
import { createPanel } from '../../../utils/panel.ts'
import palette from '../../../shaders/chunks/palette.glsl?raw'
import precision from '../../../shaders/chunks/precision.glsl?raw'
import noise from '../../../shaders/chunks/noise.glsl?raw'
import vertexSource from './vertex.glsl?raw'
import heightSource from './height.glsl?raw'
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
    // The noise library goes in front of BOTH shaders: one moves the surface,
    // the other colours it, and they have to agree.
    vertex: noise + heightSource + vertexSource,
    fragment: precision + noise + palette + heightSource + fragmentSource,
    uniforms: {
      uLight: { value: new Vec3(1, 0.4, 0.6).normalize() },
      uTime: { value: 0 },
      uAmplitude: { value: 0.06 },
    },
  })

  const mesh = new Mesh(gl, {
    geometry: new Sphere(gl, { radius: 1, widthSegments: 128 }),
    program,
  })

  const orbit = new Orbit(camera, { element: gl.canvas })

  const panel = createPanel(root)
  panel.pane.addBinding(program.uniforms.uAmplitude, 'value', {
    label: 'relief',
    min: 0,
    max: 0.35,
    step: 0.005,
  })

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
    panel.dispose()
    orbit.remove()
    cancelAnimationFrame(frame)
    observer.disconnect()
    gl.canvas.remove()
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}
