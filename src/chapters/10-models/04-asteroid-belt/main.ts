import { Orbit } from 'ogl'
import { mountCanvas } from '../../../core/canvas.ts'
import { AsteroidsScene } from '../../../scenes/AsteroidsScene.ts'

export function start(root: HTMLElement) {
  const { renderer, gl, camera, loop } = mountCanvas(root)

  camera.position.set(0, 1.2, 4.5)
  camera.lookAt([0, 0, 0])

  const scene = new AsteroidsScene(gl)

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
