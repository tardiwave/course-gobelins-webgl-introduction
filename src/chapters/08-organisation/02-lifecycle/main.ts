import { Orbit } from 'ogl'
import { mountCanvas } from '../../../core/canvas.ts'
import { SpaceScene } from '../../../scenes/SpaceScene.ts'

const REBUILD_EVERY = 4

export function start(root: HTMLElement) {
  const { renderer, gl, camera, loop } = mountCanvas(root)

  camera.position.set(0, 1.2, 4.5)
  camera.lookAt([0, 0, 0])

  let scene = new SpaceScene(gl)
  let built = 0

  const label = document.createElement('p')
  label.className = 'caption'
  label.style.left = 'auto'
  label.style.right = '16px'
  root.append(label)

  const orbit = new Orbit(camera, { element: gl.canvas })

  const stop = loop(({ time }) => {
    // Every few seconds the whole scene is thrown away and built again.
    // If dispose() were lying, this would leak a little more each time.
    if (time > (built + 1) * REBUILD_EVERY) {
      scene.dispose()
      scene = new SpaceScene(gl)
      built++
    }

    label.textContent = `rebuilt ${built} time${built === 1 ? '' : 's'}`

    scene.update(time)
    orbit.update()
    renderer.render({ scene, camera })
  })

  return () => {
    orbit.remove()
    scene.dispose()
    label.remove()
    stop()
  }
}
