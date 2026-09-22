import { Color, Mesh, Program, Renderer, Triangle, Vec2, Vec3 } from 'ogl'
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

  // The panel edits these uniform objects directly.
  const program = new Program(gl, {
    vertex,
    fragment: palette + fragmentSource,
    uniforms: {
      uResolution: { value: new Vec2() },
      uMouse: { value: mouse },
      uCells: { value: 12 },
      uFalloff: { value: 4 },
      uTint: { value: new Vec3(0.22, 0.22, 1) },
      uGrid: { value: 0 },
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

  const settings = { grid: false, tint: '#3838ff' }

  const panel = createPanel(root)

  panel.pane.addBinding(program.uniforms.uFalloff, 'value', {
    label: 'falloff',
    min: 1,
    max: 20,
    step: 0.1,
  })

  panel.pane.addBinding(settings, 'grid').on('change', (event) => {
    // Send 0.0 or 1.0 as a float instead of a bool uniform.
    program.uniforms.uGrid.value = event.value ? 1 : 0
  })

  panel.pane.addBinding(program.uniforms.uCells, 'value', {
    label: 'cells',
    min: 2,
    max: 60,
    step: 1,
  })

  panel.pane.addBinding(settings, 'tint').on('change', (event) => {
    const color = new Color(event.value)
    program.uniforms.uTint.value.set(color[0], color[1], color[2])
  })

  let frame = 0

  const render = () => {
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
