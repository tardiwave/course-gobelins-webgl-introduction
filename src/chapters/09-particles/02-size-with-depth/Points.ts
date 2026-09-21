import { Geometry, Mesh, Program, type OGLRenderingContext } from 'ogl'
import palette from '../../../shaders/chunks/palette.glsl?raw'
import vertex from './vertex.glsl?raw'
import fragment from './fragment.glsl?raw'

/**
 * A cloud of points. It owns its buffer, its shader and its movement, so the
 * step only has to build it and call update.
 */
export class Points extends Mesh {
  constructor(gl: OGLRenderingContext, count = 2000) {
    // A particle is a vertex. Nothing more: three numbers in a buffer.
    const position = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      position.set([Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1], i * 3)
    }

    super(gl, {
      // Without this the GPU would join those vertices into triangles.
      mode: gl.POINTS,
      geometry: new Geometry(gl, { position: { size: 3, data: position } }),
      program: new Program(gl, {
        vertex,
        fragment: palette + fragment,
        // gl_PointSize counts framebuffer pixels, so a retina screen needs
        // this or the particles come out half size.
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
