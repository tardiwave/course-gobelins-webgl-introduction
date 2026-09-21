import { Mesh, Program, Renderer, Triangle, Vec2 } from 'ogl'
import { loadTexture } from '../../../utils/texture.ts'
import palette from '../../../shaders/chunks/palette.glsl?raw'
import uvHelpers from '../../../shaders/chunks/uv.glsl?raw'
import vertex from '../../../shaders/chunks/screen.glsl?raw'
import fragmentSource from './fragment.glsl?raw'

export function start(root: HTMLElement) {
  const renderer = new Renderer({ dpr: Math.min(devicePixelRatio, 2), webgl: 1 })
  const gl = renderer.gl
  root.append(gl.canvas)

  gl.clearColor(0.055, 0.059, 0.067, 1)

  const resize = () => renderer.setSize(root.clientWidth, root.clientHeight)

  const observer = new ResizeObserver(resize)
  observer.observe(root)

  const target = new Vec2(0.5, 0.5) // where the cursor really is
  const current = new Vec2(0.5, 0.5) // where the scan has got to

  const program = new Program(gl, {
    vertex,
    fragment: palette + uvHelpers + fragmentSource,
    uniforms: {
      tMap: { value: loadTexture(gl, '/textures/earth.png') },
      uResolution: { value: new Vec2() },
      // The shader cannot ask how big an image is, so we tell it.
      uTextureSize: { value: new Vec2(2048, 1024) },
      uMouse: { value: current },
    },
  })

  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })

  const onPointerMove = (event: PointerEvent) => {
    const bounds = root.getBoundingClientRect()
    target.set(
      (event.clientX - bounds.left) / bounds.width,
      1 - (event.clientY - bounds.top) / bounds.height,
    )
  }

  root.addEventListener('pointermove', onPointerMove)

  let frame = 0
  const render = () => {
    // current += (target - current) * 0.06
    // A sixteenth of the remaining gap per frame. The scan never quite
    // arrives, which is exactly what makes it feel like it has weight.
    current.x += (target.x - current.x) * 0.06
    current.y += (target.y - current.y) * 0.06

    program.uniforms.uResolution.value.set(renderer.width, renderer.height)
    renderer.render({ scene: mesh })
    frame = requestAnimationFrame(render)
  }

  frame = requestAnimationFrame(render)

  return () => {
    root.removeEventListener('pointermove', onPointerMove)
    cancelAnimationFrame(frame)
    observer.disconnect()
    gl.canvas.remove()
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}
