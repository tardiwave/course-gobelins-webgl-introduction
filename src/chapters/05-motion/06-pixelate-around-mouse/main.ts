import { Mesh, Program, Renderer, Triangle, Vec2 } from 'ogl'
import { loadTexture } from '../../../utils/texture.ts'
import palette from '../../../shaders/chunks/palette.glsl?raw'
import uv from '../../../shaders/chunks/uv.glsl?raw'
import vertex from './vertex.glsl?raw'
import fragmentSource from './fragment.glsl?raw'

export function start(root: HTMLElement) {
  const renderer = new Renderer({ dpr: Math.min(devicePixelRatio, 2), webgl: 1 })
  const gl = renderer.gl
  root.append(gl.canvas)

  // The same dark as DARK in the palette.
  gl.clearColor(0.055, 0.059, 0.067, 1)

  const mouse = new Vec2(0.5, 0.5)

  const program = new Program(gl, {
    vertex,
    // GLSL has no #include, so the shared files are pasted in front.
    fragment: palette + uv + fragmentSource,
    uniforms: {
      uResolution: { value: new Vec2() },
      uMouse: { value: mouse },
      // The shader cannot ask how big an image is, so we tell it.
      uTextureSize: { value: new Vec2(2048, 1024) },
      tMap: { value: loadTexture(gl, '/textures/earth.png') },
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
      // The DOM's Y goes down, the UVs' Y goes up.
      1 - (event.clientY - bounds.top) / bounds.height,
    )
  }

  root.addEventListener('pointermove', onPointerMove)

  let frame = 0

  const render = (now: number) => {
    void now

    renderer.render({ scene: mesh })
    frame = requestAnimationFrame(render)
  }

  frame = requestAnimationFrame(render)

  return () => {
    cancelAnimationFrame(frame)
    observer.disconnect()
    root.removeEventListener('pointermove', onPointerMove)
    gl.canvas.remove()
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}
