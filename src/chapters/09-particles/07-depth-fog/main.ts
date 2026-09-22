import { Orbit } from 'ogl'
import { mountCanvas } from '../../../core/canvas.ts'
import { SkyScene } from '../../../scenes/SkyScene.ts'

export function start(root: HTMLElement) {
  const { renderer, gl, camera, loop } = mountCanvas(root)

  camera.position.set(0, 1.2, 4.5)
  camera.lookAt([0, 0, 0])

  const scene = new SkyScene(gl)

  // The fog itself is in src/shaders/belt/fragment.glsl, off (0) by default.
  scene.belt.fog.value = 1

  const orbit = new Orbit(camera, { element: gl.canvas })

  const stop = loop(({ time }) => {
    scene.update(time)
    orbit.update()
    renderer.render({ scene, camera })
  })

  return () => {
    orbit.remove()
    scene.dispose()
    stop()
  }
}
