import { Geometry, Mesh, Program, type OGLRenderingContext } from 'ogl'
import palette from '../../../shaders/chunks/palette.glsl?raw'
import vertex from './vertex.glsl?raw'
import fragmentSource from './fragment.glsl?raw'

export class Points extends Mesh {
  constructor(gl: OGLRenderingContext, count = 2000) {
    // One particle is one vertex: three floats in a buffer.
    const position = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      position.set([Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1], i * 3)
    }

    super(gl, {
      // Without this the GPU would join those vertices into triangles.
      mode: gl.POINTS,
      geometry: new Geometry(gl, { position: { size: 3, data: position } }),
      program: new Program(gl, { vertex, fragment: palette + fragmentSource }),
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
