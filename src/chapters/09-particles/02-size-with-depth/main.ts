import { mountCanvas } from '../../../core/canvas.ts'
import { PointsScene } from './PointsScene.ts'

export function start(root: HTMLElement) {
  const { renderer, gl, camera, loop } = mountCanvas(root)

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
