import { Mesh, Program, Renderer, Triangle, Vec2 } from 'ogl'
import { loadTexture } from '../../utils/texture.ts'
import palette from '../../shaders/chunks/palette.glsl?raw'
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
      tNoise: { value: loadTexture(gl, '/textures/noise.jpg', true) },
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
    root.removeEventListener('pointermove', onPointerMove)
    gl.canvas.remove()
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}
