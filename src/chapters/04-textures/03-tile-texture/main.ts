import { Mesh, Program, Renderer, Triangle, Vec2 } from 'ogl'
import { loadTexture } from '../../../utils/texture.ts'
import { createPanel } from '../../../utils/panel.ts'
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
      // true asks for REPEAT on both axes. This noise was authored to tile,
      // so opposite edges already match.
      tMap: { value: loadTexture(gl, '/textures/noise.jpg', true) },
      uResolution: { value: new Vec2() },
      uRepeat: { value: 2 },
      uBorders: { value: 1 },
    },
  })

  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })

  const resize = () => {
    renderer.setSize(root.clientWidth, root.clientHeight)
    program.uniforms.uResolution.value.set(renderer.width, renderer.height)
  }

  const observer = new ResizeObserver(resize)
  observer.observe(root)

  const settings = { borders: true }

  const panel = createPanel(root)

  panel.pane.addBinding(program.uniforms.uRepeat, 'value', {
    label: 'repeat',
    min: 1,
    max: 8,
    step: 1,
  })

  panel.pane.addBinding(settings, 'borders').on('change', () => {
    program.uniforms.uBorders.value = settings.borders ? 1 : 0
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
    gl.canvas.remove()
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}
