import { Mesh, Program, Renderer, Triangle, Vec2 } from 'ogl'
import palette from '../../../shaders/chunks/palette.glsl?raw'
import vertex from './vertex.glsl?raw'
import fragmentSource from './fragment.glsl?raw'

export function start(root: HTMLElement) {
  const renderer = new Renderer({ dpr: Math.min(devicePixelRatio, 2), webgl: 1 })
  const gl = renderer.gl
  root.append(gl.canvas)

  // The same dark as DARK in the palette.
  gl.clearColor(0.055, 0.059, 0.067, 1)

  const program = new Program(gl, {
    vertex,
    // GLSL has no #include, so the shared files are pasted in front.
    fragment: palette + fragmentSource,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new Vec2() },
    },
  })

  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })

  const resize = () => {
    renderer.setSize(root.clientWidth, root.clientHeight)
    program.uniforms.uResolution.value.set(renderer.width, renderer.height)
  }

  const observer = new ResizeObserver(resize)
  observer.observe(root)

  let frame = 0
  const origin = performance.now()

  const render = (now: number) => {
    program.uniforms.uTime.value = (now - origin) / 1000

    renderer.render({ scene: mesh })
    frame = requestAnimationFrame(render)
  }

  frame = requestAnimationFrame(render)

  return () => {
    cancelAnimationFrame(frame)
    observer.disconnect()
    gl.canvas.remove()
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}
