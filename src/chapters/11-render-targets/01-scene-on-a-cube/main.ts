import { Box, Camera, Mesh, Orbit, Program, RenderTarget } from 'ogl'
import { mountCanvas } from '../../../core/canvas.ts'
import { AsteroidsScene } from '../../../scenes/AsteroidsScene.ts'
import palette from '../../../shaders/chunks/palette.glsl?raw'
import vertex from './vertex.glsl?raw'
import fragmentSource from './fragment.glsl?raw'

// Square, to match the cube faces.
const SIZE = 1024

export function start(root: HTMLElement) {
  const { renderer, gl, camera, loop } = mountCanvas(root)

  camera.position.set(0, 1.4, 4.2)
  camera.lookAt([0, 0, 0])

  const scene = new AsteroidsScene(gl)

  // A second camera films the scene into the texture; the one you drag looks at the cube.
  const film = new Camera(gl, { fov: 45, near: 0.1, far: 100, aspect: 1 })
  film.position.set(0, 1.2, 4.5)
  film.lookAt([0, 0, 0])

  // A render target is a texture the GPU is allowed to draw into.
  const target = new RenderTarget(gl, { width: SIZE, height: SIZE })

  const cube = new Mesh(gl, {
    geometry: new Box(gl, { width: 1.6, height: 1.6, depth: 1.6 }),
    program: new Program(gl, {
      vertex,
      fragment: palette + fragmentSource,
      uniforms: { tScene: { value: target.texture } },
    }),
  })

  const orbit = new Orbit(camera, { element: gl.canvas })

  const stop = loop(({ time }) => {
    scene.update(time)

    // 1. the planet, the belt and the sky land in the texture
    renderer.render({ scene, camera: film, target })

    // 2. the texture goes onto a cube, and the cube onto the screen
    cube.rotation.y = time * 0.35
    cube.rotation.x = Math.sin(time * 0.3) * 0.4

    orbit.update()
    renderer.render({ scene: cube, camera })
  })

  return () => {
    orbit.remove()
    scene.dispose()
    stop()
  }
}
