import { GLTFLoader, Mesh, Orbit, Program, Transform } from 'ogl'
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

    // A glTF file is a scene: nodes, meshes, materials, sometimes animation.
    // We take the geometry and leave the rest — the material is ours to write,
    // which is the whole point of the course.
    // The pack holds ten different rocks. One is enough for now.
    const geometry = gltf.meshes[0].primitives[0].geometry

    rock = new Mesh(gl, {
      geometry,
      program: new Program(gl, { vertex, fragment: palette + fragmentSource }),
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
