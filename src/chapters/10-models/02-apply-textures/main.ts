import { GLTFLoader, Mesh, Orbit, Program, Transform, Vec3 } from 'ogl'
import { mountCanvas } from '../../../core/canvas.ts'
import palette from '../../../shaders/chunks/palette.glsl?raw'
import vertex from './vertex.glsl?raw'
import fragmentSource from './fragment.glsl?raw'

export function start(root: HTMLElement) {
  const { renderer, gl, camera, loop } = mountCanvas(root)

  camera.position.z = 3

  const scene = new Transform()

  let rock: Mesh | undefined
  let disposed = false

  // Loading is asynchronous and the render loop is not going to wait. It
  // starts drawing an empty scene, and the model joins it when it arrives.
  GLTFLoader.load(gl, '/models/asteroids.glb').then((gltf) => {
    if (disposed) return

    // The pack holds ten different rocks. One is enough for now.
    const geometry = gltf.meshes[0].primitives[0].geometry

    rock = new Mesh(gl, {
      geometry,
      program: new Program(gl, {
        vertex,
        fragment: palette + fragmentSource,
        uniforms: {
          // The colour map travelled inside the .glb, so the loader already
          // has it — no second request, no path to keep in sync.
          tMap: { value: gltf.materials[0].baseColorTexture.texture },
          uLight: { value: new Vec3(1, 0.6, 0.4).normalize() },
        },
      }),
    })
    rock.setParent(scene)
  })

  const orbit = new Orbit(camera, { element: gl.canvas })

  const stop = loop(({ time }) => {
    if (rock) rock.rotation.y = time * 0.3

    orbit.update()
    renderer.render({ scene, camera })
  })

  return () => {
    disposed = true
    orbit.remove()
    stop()
  }
}
