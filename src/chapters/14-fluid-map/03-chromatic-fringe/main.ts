import { Mesh, Orbit, Program, RenderTarget, Triangle, Vec2 } from 'ogl'
import { mountCanvas } from '../../../core/canvas.ts'
import { AsteroidsScene } from '../../../scenes/AsteroidsScene.ts'
import { Fluid } from '../../../objects/Fluid.ts'
import { Pointer } from '../../../core/Pointer.ts'
import { createPanel } from '../../../utils/panel.ts'
import { createThumbnails } from '../../../utils/thumbnails.ts'
import palette from '../../../shaders/chunks/palette.glsl?raw'
import screenVertex from '../../../shaders/chunks/screen.glsl?raw'
import thumbnails from '../../../shaders/chunks/thumbnails.glsl?raw'
import fragmentSource from './fragment.glsl?raw'
import fieldSource from './field.glsl?raw'

export function start(root: HTMLElement) {
  const { renderer, gl, camera, viewport, loop } = mountCanvas(root)

  camera.position.set(0, 1.2, 4.5)
  camera.lookAt([0, 0, 0])

  // Click the thumbnail to blow the field up, click again to go back.
  const strip = createThumbnails(gl.canvas as HTMLCanvasElement, 1)

  const scene = new AsteroidsScene(gl)

  const fluid = new Fluid(renderer)
  const pointer = new Pointer()
  pointer.attach(gl.canvas as HTMLCanvasElement)

  const render = new RenderTarget(gl, { width: 1, height: 1 })
  const geometry = new Triangle(gl)

  const distort = new Mesh(gl, {
    geometry,
    program: new Program(gl, {
      vertex: screenVertex,
      fragment: palette + fragmentSource,
      uniforms: {
        tScene: { value: render.texture },
        tField: { value: fluid.texture },
        uStrength: { value: 0.11 },
        uSpread: { value: 0.09 },
      },
    }),
  })

  // The same view as the first step, drawn over the corner of the frame so you
  // can see the numbers and what they do at the same time.
  const view = new Mesh(gl, {
    geometry,
    program: new Program(gl, {
      vertex: screenVertex,
      fragment: palette + thumbnails + fieldSource,
      uniforms: {
        tField: { value: fluid.texture },
        uResolution: { value: new Vec2() },
        uZoom: strip.zoom,
      },
      transparent: true,
      depthTest: false,
    }),
  })

  const orbit = new Orbit(camera, { element: gl.canvas })

  const panel = createPanel(root)
  panel.pane.addBinding(distort.program.uniforms.uStrength, 'value', {
    label: 'distortion',
    min: 0,
    max: 0.3,
    step: 0.005,
  })
  panel.pane.addBinding(distort.program.uniforms.uSpread, 'value', {
    label: 'fringe',
    min: 0,
    max: 0.4,
    step: 0.01,
  })

  const stop = loop(({ time, delta }) => {
    render.setSize(viewport.pixelWidth, viewport.pixelHeight)

    pointer.update(delta)
    fluid.update(pointer, delta, viewport.aspect)

    scene.update(time)
    orbit.update()

    renderer.render({ scene, camera, target: render })

    distort.program.uniforms.tScene.value = render.texture
    distort.program.uniforms.tField.value = fluid.texture
    renderer.render({ scene: distort })

    view.program.uniforms.tField.value = fluid.texture
    view.program.uniforms.uResolution.value.set(viewport.width, viewport.height)
    renderer.render({ scene: view, clear: false })
  })

  return () => {
    panel.dispose()
    strip.dispose()
    pointer.dispose()
    orbit.remove()
    fluid.dispose()
    scene.dispose()
    stop()
  }
}
