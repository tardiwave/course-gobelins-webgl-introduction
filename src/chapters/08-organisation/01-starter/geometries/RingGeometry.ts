import { Geometry, type OGLRenderingContext } from 'ogl'

export class RingGeometry extends Geometry {
  constructor(gl: OGLRenderingContext, radius = 1, segments = 128) {
    const position = new Float32Array(segments * 3)

    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      position.set([Math.cos(angle) * radius, 0, Math.sin(angle) * radius], i * 3)
    }

    super(gl, {
      position: { size: 3, data: position },
    })
  }
}
