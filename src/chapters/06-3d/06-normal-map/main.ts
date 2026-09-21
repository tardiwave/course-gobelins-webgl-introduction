import { Camera, Mesh, Orbit, Program, Renderer, Sphere, Vec3 } from 'ogl'
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

  const camera = new Camera(gl, { fov: 45, near: 0.1, far: 100 })
  camera.position.z = 3.4

  const resize = () => {
    renderer.setSize(root.clientWidth, root.clientHeight)
    camera.perspective({ aspect: root.clientWidth / root.clientHeight })
  }

  const observer = new ResizeObserver(resize)
  observer.observe(root)

  const light = { value: new Vec3(1, 0.4, 0.6) }

  const planet = new Mesh(gl, {
    geometry: new Sphere(gl, { radius: 1, widthSegments: 48 }),
    program: new Program(gl, {
      vertex,
      fragment: palette + fragmentSource,
      uniforms: {
        tMap: { value: loadTexture(gl, '/textures/earth.png') },
        tNormal: { value: loadTexture(gl, '/textures/earth-normal.png') },
        uLight: light,
        uStrength: { value: 0.55 },
      },
    }),
  })

  const orbit = new Orbit(camera, { element: gl.canvas })

  const panel = createPanel(root)
  panel.pane.addBinding(planet.program.uniforms.uStrength, 'value', {
    label: 'strength',
    min: 0,
    max: 2,
    step: 0.01,
  })

  let frame = 0
  const origin = performance.now()

  const render = (now: number) => {
    const time = (now - origin) / 1000

    light.value.set(Math.cos(time * 0.4), 0.4, Math.sin(time * 0.4)).normalize()

    planet.rotation.y = time * 0.1
    planet.rotation.z = 0.41

    orbit.update()
    renderer.render({ scene: planet, camera })
    frame = requestAnimationFrame(render)
  }

  frame = requestAnimationFrame(render)

  return () => {
    panel.dispose()
    orbit.remove()
    cancelAnimationFrame(frame)
    observer.disconnect()
    gl.canvas.remove()
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}
