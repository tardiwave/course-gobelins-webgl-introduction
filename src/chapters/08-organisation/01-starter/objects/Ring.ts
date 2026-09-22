import { Mesh, Program, type OGLRenderingContext } from 'ogl'
import { RingGeometry } from '../geometries/RingGeometry.ts'
import palette from '../shaders/chunks/palette.glsl?raw'
import vertex from '../shaders/ring/vertex.glsl?raw'
import fragment from '../shaders/ring/fragment.glsl?raw'

export class Ring extends Mesh {
  constructor(gl: OGLRenderingContext, radius: number) {
    super(gl, {
      // Joins the last vertex back to the first: a closed line, one pixel wide.
      mode: gl.LINE_LOOP,
      geometry: new RingGeometry(gl, radius),
      program: new Program(gl, {
        vertex,
        fragment: palette + fragment,
        transparent: true,
        depthWrite: false,
      }),
    })
  }

  dispose() {
    this.geometry.remove()
    this.program.remove()
  }
}
