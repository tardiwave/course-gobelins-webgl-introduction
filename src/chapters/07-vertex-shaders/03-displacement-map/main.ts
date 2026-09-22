import { Camera, Mesh, Orbit, Program, Renderer, Sphere, Vec2, Vec3 } from 'ogl'
import { loadTexture } from '../../../utils/texture.ts'
import { createPanel } from '../../../utils/panel.ts'
import precision from '../../../shaders/chunks/precision.glsl?raw'
import noise from '../../../shaders/chunks/noise.glsl?raw'
import palette from '../../../shaders/chunks/palette.glsl?raw'
import heightSource from './height.glsl?raw'
import vertexSource from './vertex.glsl?raw'
import fragmentSource from './fragment.glsl?raw'

export function start(root: HTMLElement) {
  const renderer = new Renderer({ dpr: Math.min(devicePixelRatio, 2), webgl: 1 })
  const gl = renderer.gl
  root.append(gl.canvas)

  gl.clearColor(0.055, 0.059, 0.067, 1)

  const camera = new Camera(gl, { fov: 45, near: 0.1, far: 100 })
  camera.position.z = 3.4

  const resize = () => {
    renderer.setSize(root.clientWidth, root.clientHeight)
    camera.perspective({ aspect: root.clientWidth / root.clientHeight })
  }

  const observer = new ResizeObserver(resize)
  observer.observe(root)

  const program = new Program(gl, {
    // GLSL has no #include: height() is concatenated in front of both shaders.
    vertex: noise + heightSource + vertexSource,
    fragment: precision + noise + palette + heightSource + fragmentSource,
    uniforms: {
      tMap: { value: loadTexture(gl, '/textures/earth.png') },
      // Black is sea level, white the Himalaya, same projection as the colour map.
      // Source: NASA Blue Marble, via the three.js textures.
      tHeight: { value: loadTexture(gl, '/textures/earth-height.png') },
      tNoise: { value: loadTexture(gl, '/textures/noise.jpg', true) },
      // A shader cannot query a texture's size, so pass it in.
      uMapSize: { value: new Vec2(2048, 1024) },
      uLight: { value: new Vec3(1, 0.4, 0.6).normalize() },
      uSource: { value: 0 },
      uTime: { value: 0 },
      uAmplitude: { value: 0.045 },
      uRelief: { value: 0.015 },
    },
  })

  const mesh = new Mesh(gl, {
    geometry: new Sphere(gl, { radius: 1, widthSegments: 256 }),
    program,
  })

  const orbit = new Orbit(camera, { element: gl.canvas })

  const settings = { source: 0 }

  const panel = createPanel(root)
  panel.pane
    .addBinding(settings, 'source', {
      options: { 'height map': 0, 'noise texture': 1, fbm: 2 },
    })
    .on('change', (event) => {
      program.uniforms.uSource.value = event.value
    })
  panel.pane.addBinding(program.uniforms.uAmplitude, 'value', {
    label: 'relief',
    min: 0,
    max: 0.15,
    step: 0.001,
  })
  panel.pane.addBinding(program.uniforms.uRelief, 'value', {
    label: 'shading',
    min: 0,
    max: 0.06,
    step: 0.001,
  })

  let frame = 0
  const origin = performance.now()

  const render = (now: number) => {
    const time = (now - origin) / 1000

    program.uniforms.uTime.value = time

    mesh.rotation.y = time * 0.1
    mesh.rotation.z = 0.41

    orbit.update()
    renderer.render({ scene: mesh, camera })
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
