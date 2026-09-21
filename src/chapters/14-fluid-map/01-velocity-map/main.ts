import { Mesh, Program, Triangle } from 'ogl'
import { mountCanvas } from '../../../core/canvas.ts'
import { Fluid } from '../../../objects/Fluid.ts'
import { Pointer } from '../../../core/Pointer.ts'
import { createPanel } from '../../../utils/panel.ts'
import palette from '../../../shaders/chunks/palette.glsl?raw'
import screenVertex from '../../../shaders/chunks/screen.glsl?raw'
import fragmentSource from './fragment.glsl?raw'

export function start(root: HTMLElement) {
  const { renderer, gl, viewport, loop } = mountCanvas(root)

  // The whole simulation is in src/objects/Fluid.ts — worth opening.
  const fluid = new Fluid(renderer)
  const pointer = new Pointer()
  pointer.attach(gl.canvas as HTMLCanvasElement)

  const mesh = new Mesh(gl, {
    geometry: new Triangle(gl),
    program: new Program(gl, {
      vertex: screenVertex,
      fragment: palette + fragmentSource,
      uniforms: { tField: { value: fluid.texture } },
    }),
  })

  const panel = createPanel(root)
  panel.pane.addBinding(fluid.strength, 'value', {
    label: 'push',
    min: 0,
    max: 40,
    step: 0.5,
  })
  panel.pane.addBinding(fluid.decay, 'value', {
    label: 'decay',
    min: 0.2,
    max: 6,
    step: 0.05,
  })

  const stop = loop(({ delta }) => {
    pointer.update(delta)
    fluid.update(pointer, delta, viewport.aspect)

    // The field swaps its two targets every frame, so the texture to read is
    // never the same object twice in a row.
    mesh.program.uniforms.tField.value = fluid.texture

    renderer.render({ scene: mesh })
  })

  return () => {
    panel.dispose()
    pointer.dispose()
    fluid.dispose()
    stop()
  }
}
