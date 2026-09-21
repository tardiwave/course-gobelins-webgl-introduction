import { Camera, Mesh, Orbit, Program, Renderer, Sphere } from 'ogl'
import palette from '../../../shaders/chunks/palette.glsl?raw'
import vertex from './vertex.glsl?raw'
import fragmentSource from './fragment.glsl?raw'

// The same sphere as the previous step, now with a camera you can move.
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

  const mesh = new Mesh(gl, {
    geometry: new Sphere(gl, { radius: 1, widthSegments: 48 }),
    program: new Program(gl, { vertex, fragment: palette + fragmentSource }),
  })

  // Orbit reads the pointer on the canvas and rewrites the camera position.
  const orbit = new Orbit(camera, { element: gl.canvas })

  let frame = 0
  const render = () => {
    orbit.update()
    renderer.render({ scene: mesh, camera })
    frame = requestAnimationFrame(render)
  }

  frame = requestAnimationFrame(render)

  return () => {
    // Always give back the listeners a step added.
    orbit.remove()
    cancelAnimationFrame(frame)
    observer.disconnect()
    gl.canvas.remove()
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}
