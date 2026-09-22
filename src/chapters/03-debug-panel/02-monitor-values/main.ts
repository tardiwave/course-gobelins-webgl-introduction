import { Mesh, Program, Renderer, Triangle, Vec2 } from 'ogl'
import { createPanel } from '../../../utils/panel.ts'
import palette from '../../../shaders/chunks/palette.glsl?raw'
import vertex from './vertex.glsl?raw'
import fragmentSource from './fragment.glsl?raw'

export function start(root: HTMLElement) {
  const renderer = new Renderer({ dpr: Math.min(devicePixelRatio, 2), webgl: 1 })
  const gl = renderer.gl
  root.append(gl.canvas)

  gl.clearColor(0.055, 0.059, 0.067, 1)

  const mouse = new Vec2(0.5, 0.5)

  const program = new Program(gl, {
    vertex,
    fragment: palette + fragmentSource,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new Vec2() },
      uMouse: { value: mouse },
      uFalloff: { value: 4 },
      uLoad: { value: 0 },
    },
  })

  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })

  const resize = () => {
    renderer.setSize(root.clientWidth, root.clientHeight)
    program.uniforms.uResolution.value.set(renderer.width, renderer.height)
  }

  const observer = new ResizeObserver(resize)
  observer.observe(root)

  const onPointerMove = (event: PointerEvent) => {
    const bounds = root.getBoundingClientRect()
    mouse.set(
      (event.clientX - bounds.left) / bounds.width,
      1 - (event.clientY - bounds.top) / bounds.height,
    )
  }

  root.addEventListener('pointermove', onPointerMove)

  // Updated every frame; the read-only bindings below poll them.
  const readouts = { fps: 0, frame: 0 }

  const panel = createPanel(root, 'Debug')

  panel.pane.addBinding(program.uniforms.uLoad, 'value', {
    label: 'extra work',
    min: 0,
    max: 128,
    step: 1,
  })

  panel.pane.addBinding(readouts, 'fps', { readonly: true, interval: 200 })

  panel.pane.addBinding(readouts, 'frame', {
    label: 'frame (ms)',
    readonly: true,
    view: 'graph',
    interval: 32,
    min: 0,
    max: 40,
  })

  let frame = 0
  let frames = 0
  let since = 0

  const origin = performance.now()
  let previous = origin

  const render = (now: number) => {
    const time = (now - origin) / 1000

    readouts.frame = now - previous
    previous = now

    frames++
    if (time - since >= 0.5) {
      readouts.fps = Math.round(frames / (time - since))
      frames = 0
      since = time
    }

    program.uniforms.uTime.value = time

    renderer.render({ scene: mesh })
    frame = requestAnimationFrame(render)
  }

  frame = requestAnimationFrame(render)

  return () => {
    cancelAnimationFrame(frame)
    observer.disconnect()
    panel.dispose()
    root.removeEventListener('pointermove', onPointerMove)
    gl.canvas.remove()
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}
