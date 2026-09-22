import { GLTFLoader, Mesh, Orbit, Program, Transform, Vec3 } from 'ogl'
import { mountCanvas } from '../../../core/canvas.ts'
import palette from '../../../shaders/chunks/palette.glsl?raw'
import vertex from './vertex.glsl?raw'
import fragmentSource from './fragment.glsl?raw'

const COUNT = 2400

export function start(root: HTMLElement) {
  const { renderer, gl, camera, loop } = mountCanvas(root)

  camera.position.set(0, 1.2, 4.5)
  camera.lookAt([0, 0, 0])

  const scene = new Transform()
  const elapsed = { value: 0 }

  const offset = new Float32Array(COUNT * 3)
  const random = new Float32Array(COUNT)

  for (let i = 0; i < COUNT; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 1.55 + Math.random() * 0.9

    offset.set(
      [Math.cos(angle) * radius, (Math.random() - 0.5) * 0.14, Math.sin(angle) * radius],
      i * 3,
    )
    random[i] = Math.random()
  }

  let disposed = false

  GLTFLoader.load(gl, '/models/asteroids.glb').then((gltf) => {
    if (disposed) return

    // Instancing multiplies the triangle count, so pick the lightest rock of the pack.
    const geometry = gltf.meshes[1].primitives[0].geometry
    geometry.addAttribute('offset', { instanced: 1, size: 3, data: offset })
    geometry.addAttribute('random', { instanced: 1, size: 1, data: random })

    const rocks = new Mesh(gl, {
      geometry,
      program: new Program(gl, {
        vertex,
        fragment: palette + fragmentSource,
        uniforms: {
          tMap: { value: gltf.materials[0].baseColorTexture.texture },
          uLight: { value: new Vec3(1, 0.6, 0.4).normalize() },
          uTime: elapsed,
        },
      }),
    })
    rocks.frustumCulled = false
    rocks.setParent(scene)
  })

  const orbit = new Orbit(camera, { element: gl.canvas })

  const stop = loop(({ time }) => {
    elapsed.value = time

    orbit.update()
    renderer.render({ scene, camera })
  })

  return () => {
    disposed = true
    orbit.remove()
    stop()
  }
}
