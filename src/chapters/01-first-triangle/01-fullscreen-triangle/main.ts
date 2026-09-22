import { Mesh, Program, Renderer, Triangle } from 'ogl'
import vertex from './vertex.glsl?raw'
import fragment from './fragment.glsl?raw'

export function start(root: HTMLElement) {
  // A renderer owns the canvas and the WebGL context.
  const renderer = new Renderer({ dpr: Math.min(devicePixelRatio, 2), webgl: 1 })
  const gl = renderer.gl
  root.append(gl.canvas)

  gl.clearColor(0.055, 0.059, 0.067, 1)

  // Big enough to cover the screen, so its corners are never visible.
  const geometry = new Triangle(gl)

  // A program is a pair of shaders; a mesh is a geometry drawn with one.
  const program = new Program(gl, { vertex, fragment })
  const mesh = new Mesh(gl, { geometry, program })

  const resize = () => renderer.setSize(root.clientWidth, root.clientHeight)

  const observer = new ResizeObserver(resize)
  observer.observe(root)

  let frame = 0

  const render = () => {
    renderer.render({ scene: mesh })
    frame = requestAnimationFrame(render)
  }

  frame = requestAnimationFrame(render)

  // Without this cleanup the loop keeps rendering to a detached canvas.
  return () => {
    cancelAnimationFrame(frame)
    observer.disconnect()
    gl.canvas.remove()
    // Removing the canvas does not free the WebGL context, and browsers allow about 16.
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}
