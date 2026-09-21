import { Mesh, Orbit, Program, RenderTarget, Triangle } from 'ogl'
import { mountCanvas } from '../../../core/canvas.ts'
import { createPanel } from '../../../utils/panel.ts'
import { AsteroidsScene } from '../../../scenes/AsteroidsScene.ts'
import palette from '../../../shaders/chunks/palette.glsl?raw'
import screenVertex from '../../../shaders/chunks/screen.glsl?raw'
import fragmentSource from './fragment.glsl?raw'

export function start(root: HTMLElement) {
  const { renderer, gl, camera, viewport, loop } = mountCanvas(root)

  camera.position.set(0, 1.2, 4.5)
  camera.lookAt([0, 0, 0])

  const scene = new AsteroidsScene(gl)

  // A render target is a texture the GPU is allowed to draw into.
  const target = new RenderTarget(gl, { width: 1, height: 1 })

  // The fullscreen triangle of the first chapter, this time showing a texture
  // that WebGL made itself.
  const screen = new Mesh(gl, {
    geometry: new Triangle(gl),
    program: new Program(gl, {
      vertex: screenVertex,
      fragment: palette + fragmentSource,
      uniforms: {
        tScene: { value: target.texture },
        uTime: { value: 0 },
        uAmount: { value: 0.35 },
      },
    }),
  })

  const orbit = new Orbit(camera, { element: gl.canvas })

  const panel = createPanel(root)
  panel.pane.addBinding(screen.program.uniforms.uAmount, 'value', {
    label: 'grain',
    min: 0,
    max: 1,
    step: 0.01,
  })

  const stop = loop(({ time }) => {
    // The target has to follow the canvas, in real pixels.
    target.setSize(viewport.pixelWidth, viewport.pixelHeight)

    screen.program.uniforms.uTime.value = time

    scene.update(time)
    orbit.update()

    // 1. the scene goes into the texture instead of to the screen
    renderer.render({ scene, camera, target })

    // 2. the texture is painted back onto the screen, reworked on the way
    renderer.render({ scene: screen })
  })

  return () => {
    panel.dispose()
    orbit.remove()
    scene.dispose()
    stop()
  }
}
