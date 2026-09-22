import { Geometry, Mesh, Program, type OGLRenderingContext } from 'ogl'
import palette from '../../../shaders/chunks/palette.glsl?raw'
import vertex from './vertex.glsl?raw'
import fragmentSource from './fragment.glsl?raw'

export class Points extends Mesh {
  constructor(gl: OGLRenderingContext, count = 2000) {
    const position = new Float32Array(count * 3)
    // Any attribute buffer is per-particle data: size, colour, speed, delay.
    const random = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      position.set([Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1], i * 3)
      random[i] = Math.random()
    }

    super(gl, {
      mode: gl.POINTS,
      geometry: new Geometry(gl, {
        position: { size: 3, data: position },
        random: { size: 1, data: random },
      }),
      program: new Program(gl, {
        vertex,
        fragment: palette + fragmentSource,
        // gl_PointSize is in framebuffer pixels: without the pixel ratio, retina halves it.
        uniforms: { uPixelRatio: { value: gl.renderer.dpr } },
      }),
    })
  }

  update(time: number) {
    this.rotation.y = time * 0.15
  }

  dispose() {
    this.geometry.remove()
    this.program.remove()
  }
}
