import { Orbit } from 'ogl'
import { mountCanvas } from '../../../core/canvas.ts'
import { SkyScene } from '../../../scenes/SkyScene.ts'

export function start(root: HTMLElement) {
  const { renderer, gl, camera, loop } = mountCanvas(root)

  camera.position.set(0, 1.2, 4.5)
  camera.lookAt([0, 0, 0])

  const scene = new SkyScene(gl)

  // The one line this step is about. It has been sitting at 0 since the belt
  // was written — see src/shaders/belt.frag.glsl.
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
