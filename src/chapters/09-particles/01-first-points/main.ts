import { mountCanvas } from '../../../core/canvas.ts'
import { PointsScene } from './PointsScene.ts'

export function start(root: HTMLElement) {
  const { renderer, gl, camera, loop } = mountCanvas(root)

  // From the organisation chapter on, a step builds a scene and hands it
  // objects.
  const scene = new PointsScene(gl)

  const stop = loop(({ time }) => {
    scene.update(time)
    renderer.render({ scene, camera })
  })

  return () => {
    scene.dispose()
    stop()
  }
}
