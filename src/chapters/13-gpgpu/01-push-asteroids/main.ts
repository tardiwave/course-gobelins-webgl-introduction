import {
  GLTFLoader,
  Mesh,
  Orbit,
  Program,
  Raycast,
  RenderTarget,
  Texture,
  Transform,
  Triangle,
  Vec2,
  Vec3,
} from 'ogl'
import { mountCanvas } from '../../../core/canvas.ts'
import { SpaceScene } from '../../../scenes/SpaceScene.ts'
import { Stars } from '../../../objects/Stars.ts'
import { createPanel } from '../../../utils/panel.ts'
import { createThumbnails } from '../../../utils/thumbnails.ts'
import { Pointer } from '../../../core/Pointer.ts'
import palette from '../../../shaders/chunks/palette.glsl?raw'
import precision from '../../../shaders/chunks/precision.glsl?raw'
import noise from '../../../shaders/chunks/noise.glsl?raw'
import drift from '../../../shaders/chunks/drift.glsl?raw'
import screenVertex from '../../../shaders/chunks/screen.glsl?raw'
import thumbnails from '../../../shaders/chunks/thumbnails.glsl?raw'
import resetSource from './reset.glsl?raw'
import simulationSource from './simulation.glsl?raw'
import debugSource from './debug.glsl?raw'
import vertexSource from './vertex.glsl?raw'
import fragmentSource from './fragment.glsl?raw'

// One texel per asteroid, so the count is a square on purpose.
const SIZE = 49
const COUNT = SIZE * SIZE

export function start(root: HTMLElement) {
  const { renderer, gl, camera, viewport, loop } = mountCanvas(root)

  camera.position.set(0, 1.2, 4.5)
  camera.lookAt([0, 0, 0])

  // WebGL1 stores 8-bit colours unless you ask for more. Positions need the
  // full float: one extension to hold them, one to let a shader write them.
  if (!gl.getExtension('OES_texture_float') || !gl.getExtension('WEBGL_color_buffer_float')) {
    throw new Error('This step needs floating point render targets.')
  }

  // Click the thumbnail to blow the state texture up, click again to go back.
  const strip = createThumbnails(gl.canvas as HTMLCanvasElement, 1)

  const scene = new SpaceScene(gl)
  const stars = new Stars(gl)
  stars.setParent(scene)

  // Where every rock belongs, four numbers at a time. A texture is an array
  // the GPU can read at any index.
  const resting = new Float32Array(COUNT * 4)
  const offset = new Float32Array(COUNT * 3)
  const random = new Float32Array(COUNT)
  const dataUv = new Float32Array(COUNT * 2)

  for (let i = 0; i < COUNT; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 1.55 + Math.random() * 0.9
    const x = Math.cos(angle) * radius
    const y = (Math.random() - 0.5) * 0.14
    const z = Math.sin(angle) * radius

    offset.set([x, y, z], i * 3)
    random[i] = Math.random()
    resting.set([x, y, z, random[i]], i * 4)

    // Which texel is mine. The half lands the read in the middle of the texel
    // instead of on the seam between two.
    dataUv.set([((i % SIZE) + 0.5) / SIZE, (Math.floor(i / SIZE) + 0.5) / SIZE], i * 2)
  }

  const format = {
    width: SIZE,
    height: SIZE,
    type: gl.FLOAT,
    format: gl.RGBA,
    internalFormat: gl.RGBA,
    // NEAREST, always. Blending two asteroids' positions would be meaningless:
    // these texels are records, not pixels.
    minFilter: gl.NEAREST,
    magFilter: gl.NEAREST,
  }

  const rest = new Texture(gl, {
    ...format,
    image: resting,
    generateMipmaps: false,
    flipY: false,
  })

  // Two targets, used in turn: a shader cannot read the texture it is writing
  // into, and here the new state is a function of the old one.
  let current = new RenderTarget(gl, { ...format, depth: false })
  let next = new RenderTarget(gl, { ...format, depth: false })

  const screen = new Triangle(gl)

  const reset = new Mesh(gl, {
    geometry: screen,
    program: new Program(gl, { vertex: screenVertex, fragment: resetSource }),
  })

  renderer.render({ scene: reset, target: current })
  renderer.render({ scene: reset, target: next })
  reset.program.remove()

  const simulation = new Mesh(gl, {
    geometry: screen,
    program: new Program(gl, {
      vertex: screenVertex,
      fragment: precision + noise + drift + simulationSource,
      uniforms: {
        tRest: { value: rest },
        tState: { value: current.texture },
        uMouse: { value: new Vec3(0, 100, 0) },
        uTime: { value: 0 },
        uDelta: { value: 0 },
        uPush: { value: 8 },
        uRadius: { value: 7 },
      },
    }),
  })

  const view = new Mesh(gl, {
    geometry: screen,
    program: new Program(gl, {
      vertex: screenVertex,
      fragment: palette + thumbnails + debugSource,
      uniforms: {
        tState: { value: current.texture },
        uResolution: { value: new Vec2() },
        uZoom: strip.zoom,
      },
      transparent: true,
      depthTest: false,
    }),
  })

  const rocks = new Transform()
  rocks.setParent(scene)

  let mesh: Mesh | undefined
  let disposed = false

  GLTFLoader.load(gl, '/models/asteroids.glb').then((gltf) => {
    if (disposed) return

    const geometry = gltf.meshes[1].primitives[0].geometry
    geometry.addAttribute('offset', { instanced: 1, size: 3, data: offset })
    geometry.addAttribute('random', { instanced: 1, size: 1, data: random })
    geometry.addAttribute('dataUv', { instanced: 1, size: 2, data: dataUv })

    mesh = new Mesh(gl, {
      geometry,
      program: new Program(gl, {
        vertex: noise + drift + vertexSource,
        fragment: palette + fragmentSource,
        uniforms: {
          tMap: { value: gltf.materials[0].baseColorTexture.texture },
          tState: { value: current.texture },
          uLight: scene.planet.light,
          uFog: { value: 1 },
          uTime: { value: 0 },
        },
      }),
    })
    mesh.frustumCulled = false
    mesh.setParent(rocks)
  })

  // The cursor is a point on the screen and the belt is a ring in space, so
  // one has to become the other: cast a ray through the cursor, then see where
  // it crosses the flat plane the belt lies in.
  const pointer = new Pointer()
  const raycast = new Raycast()
  const belt = { origin: new Vec3(0, 0, 0), normal: new Vec3(0, 1, 0) }
  const point = simulation.program.uniforms.uMouse.value as Vec3

  const canvas = gl.canvas as HTMLCanvasElement
  pointer.attach(canvas)

  const orbit = new Orbit(camera, { element: canvas })

  const panel = createPanel(root)
  panel.pane.addBinding(simulation.program.uniforms.uPush, 'value', {
    label: 'push',
    min: 0,
    max: 25,
    step: 0.1,
  })
  panel.pane.addBinding(simulation.program.uniforms.uRadius, 'value', {
    label: 'radius',
    min: 1,
    max: 30,
    step: 0.1,
  })

  const stop = loop(({ time, delta }) => {
    raycast.castMouse(camera, pointer.clip)
    const hit = raycast.intersectPlane(belt)

    // No hit (cursor off the canvas, or the ray points away from the plane):
    // parked far above the belt, where the push is zero.
    if (pointer.inside && hit) point.copy(hit)
    else point.set(0, 100, 0)

    simulation.program.uniforms.uTime.value = time
    simulation.program.uniforms.uDelta.value = delta
    simulation.program.uniforms.tState.value = current.texture

    // Read current, write next, then swap.
    renderer.render({ scene: simulation, target: next })
    const previous = current
    current = next
    next = previous

    if (mesh) {
      mesh.program.uniforms.tState.value = current.texture
      mesh.program.uniforms.uTime.value = time
    }

    scene.update(time)
    stars.update(time)
    orbit.update()

    renderer.render({ scene, camera })

    // Drawn over the scene rather than instead of it, so you can watch the
    // memory and the render at the same time.
    view.program.uniforms.tState.value = current.texture
    view.program.uniforms.uResolution.value.set(viewport.width, viewport.height)
    renderer.render({ scene: view, clear: false })
  })

  return () => {
    disposed = true
    pointer.dispose()
    panel.dispose()
    strip.dispose()
    orbit.remove()
    scene.dispose()
    stars.dispose()
    mesh?.program.remove()
    stop()
  }
}
