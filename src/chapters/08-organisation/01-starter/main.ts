import { Canvas } from './core/Canvas.ts'
import { SpaceScene } from './scenes/SpaceScene.ts'

export function start(root: HTMLElement) {
  const canvas = new Canvas(root)

  canvas.camera.position.set(0, 1.4, 5.6)
  canvas.camera.lookAt([0, 0, 0])

  const scene = new SpaceScene(canvas.gl, canvas.pointer)
  canvas.start(scene)

  return () => {
    scene.dispose()
    canvas.dispose()
  }
}
