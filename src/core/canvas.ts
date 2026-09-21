import { Camera, Renderer } from 'ogl'
import { Clock } from './Clock.ts'
import { Viewport } from './Viewport.ts'

/**
 * Everything a class-based step needs: a canvas, a camera, a viewport that
 * keeps them in step with the page, and a clock.
 *
 * The chapters before this one write all of it out by hand — the plumbing IS
 * the lesson there. From here it is shared, like everything else.
 */
export function mountCanvas(root: HTMLElement) {
  const renderer = new Renderer({ dpr: Math.min(devicePixelRatio, 2), webgl: 1 })
  const gl = renderer.gl
  root.append(gl.canvas)

  // Same dark as DARK in the palette, so 3D steps sit on it too.
  gl.clearColor(0.055, 0.059, 0.067, 1)

  const camera = new Camera(gl, { fov: 45, near: 0.1, far: 100 })
  camera.position.z = 3.4

  const viewport = new Viewport(root, renderer, camera)
  const clock = new Clock()

  let request = 0

  return {
    renderer,
    gl,
    camera,
    viewport,
    clock,

    /** Starts the render loop. Returns the step's cleanup function. */
    loop(tick: (clock: Clock) => void) {
      const frame = (now: number) => {
        clock.update(now)
        tick(clock)

        request = requestAnimationFrame(frame)
      }

      request = requestAnimationFrame(frame)

      return () => {
        cancelAnimationFrame(request)
        viewport.dispose()
        gl.canvas.remove()
        // Removing the canvas does not free its GPU context: the browser keeps
        // it until garbage collection, and only allows about sixteen at once.
        gl.getExtension('WEBGL_lose_context')?.loseContext()
      }
    },
  }
}
