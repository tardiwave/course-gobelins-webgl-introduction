import { AxesHelper, Camera, Mesh, Orbit, Program, Renderer, Sphere, Transform, Vec3 } from 'ogl'
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

  camera.position.z = 5

  const scene = new Transform()

  // The light is a direction and nothing else. One object, shared by every
  // shader that needs it, so they can never disagree.
  const light = { value: new Vec3(1, 0.4, 0.6) }

  const planet = new Mesh(gl, {
    geometry: new Sphere(gl, { radius: 1, widthSegments: 48 }),
    program: new Program(gl, {
      vertex,
      fragment: palette + fragmentSource,
      uniforms: {
        tMap: { value: loadTexture(gl, '/textures/earth.png') },
        uLight: light,
        uAmbient: { value: 0.06 },
      },
    }),
  })
  planet.setParent(scene)

  // OGL ships a few debug helpers. This one draws three coloured axes.
  const helper = new AxesHelper(gl, { size: 0.6 })
  helper.setParent(scene)

  const orbit = new Orbit(camera, { element: gl.canvas })

  const settings = { turning: true, angle: 0.6 }
  const panel = createPanel(root)
  panel.pane.addBinding(settings, 'turning')
  panel.pane.addBinding(settings, 'angle', { min: 0, max: 6.28, step: 0.01 })
  panel.pane.addBinding(planet.program.uniforms.uAmbient, 'value', {
    label: 'ambient',
    min: 0,
    max: 0.5,
    step: 0.01,
  })

  let frame = 0
  const origin = performance.now()

  const render = (now: number) => {
    const time = (now - origin) / 1000

    if (settings.turning) settings.angle = (time * 0.4) % 6.28

    light.value.set(Math.cos(settings.angle), 0.4, Math.sin(settings.angle)).normalize()

    // Parked where the light comes from and aimed at the centre, so its blue
    // Z axis lies along the light vector.
    helper.position.copy(light.value).multiply(1.9)
    helper.lookAt([0, 0, 0])

    planet.rotation.y = time * 0.1
    planet.rotation.z = 0.41

    orbit.update()
    renderer.render({ scene, camera })
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
