import { Mesh, Program, Triangle, Vec2 } from 'ogl'
import { mountCanvas } from '../../../core/canvas.ts'
import { createPanel } from '../../../utils/panel.ts'
import { damp } from '../../../utils/maths.ts'
import palette from '../../../shaders/chunks/palette.glsl?raw'
import screenVertex from '../../../shaders/chunks/screen.glsl?raw'
import fragmentSource from './fragment.glsl?raw'

export function start(root: HTMLElement) {
  const { renderer, gl, viewport, loop } = mountCanvas(root)

  // No Camera to hand to Orbit: the orbit is two angles sent as a uniform.
  const orbit = new Vec2(0, 0.15)
  const target = new Vec2(0, 0.15)

  let dragging = false
  let lastX = 0
  let lastY = 0

  const program = new Program(gl, {
    vertex: screenVertex,
    fragment: palette + fragmentSource,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new Vec2() },
      uOrbit: { value: orbit },
      uBlend: { value: 0.45 },
    },
  })

  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })

  // The canvas, not the root, so dragging the debug panel does not orbit.
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

  const stop = loop(({ time, delta }) => {
    orbit.x = damp(orbit.x, target.x, 6.3, delta)
    orbit.y = damp(orbit.y, target.y, 6.3, delta)

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
