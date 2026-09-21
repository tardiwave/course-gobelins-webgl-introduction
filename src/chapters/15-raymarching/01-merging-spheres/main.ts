import { Mesh, Program, Triangle, Vec2 } from 'ogl'
import { mountCanvas } from '../../../core/canvas.ts'
import { createPanel } from '../../../utils/panel.ts'
import palette from '../../../shaders/chunks/palette.glsl?raw'
import vertex from '../../../shaders/chunks/screen.glsl?raw'
import fragmentSource from './fragment.glsl?raw'

export function start(root: HTMLElement) {
  const { renderer, gl, viewport, loop } = mountCanvas(root)

  // There is no Camera object to hand to Orbit — the scene lives in a shader.
  // So the orbit is two accumulated angles, sent as a uniform.
  const orbit = new Vec2(0, 0.15)
  const target = new Vec2(0, 0.15)

  let dragging = false
  let lastX = 0
  let lastY = 0

  const program = new Program(gl, {
    vertex,
    fragment: palette + fragmentSource,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new Vec2() },
      uOrbit: { value: orbit },
      uBlend: { value: 0.45 },
    },
  })

  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })

  // The canvas, not the root: the debug panel sits on top of it and must not
  // start a drag.
  const canvas = gl.canvas as HTMLCanvasElement

  const onDown = (event: PointerEvent) => {
    dragging = true
    lastX = event.clientX
    lastY = event.clientY
    canvas.setPointerCapture(event.pointerId)
  }

  const onMove = (event: PointerEvent) => {
    if (!dragging) return

    target.x -= (event.clientX - lastX) * 0.006
    target.y += (event.clientY - lastY) * 0.006

    lastX = event.clientX
    lastY = event.clientY
  }

  const onUp = (event: PointerEvent) => {
    dragging = false
    canvas.releasePointerCapture(event.pointerId)
  }

  canvas.addEventListener('pointerdown', onDown)
  canvas.addEventListener('pointermove', onMove)
  canvas.addEventListener('pointerup', onUp)
  canvas.addEventListener('pointercancel', onUp)

  const panel = createPanel(root)
  panel.pane.addBinding(program.uniforms.uBlend, 'value', {
    label: 'blend',
    // 0 would divide by zero in smin.
    min: 0.01,
    max: 1.2,
    step: 0.01,
  })

  const stop = loop(({ time }) => {
    // Damped, like every other input in this course.
    orbit.x += (target.x - orbit.x) * 0.1
    orbit.y += (target.y - orbit.y) * 0.1

    program.uniforms.uTime.value = time
    program.uniforms.uResolution.value.set(viewport.width, viewport.height)

    renderer.render({ scene: mesh })
  })

  return () => {
    panel.dispose()
    canvas.removeEventListener('pointerdown', onDown)
    canvas.removeEventListener('pointermove', onMove)
    canvas.removeEventListener('pointerup', onUp)
    canvas.removeEventListener('pointercancel', onUp)
    stop()
  }
}
