import { Geometry, type OGLRenderingContext } from 'ogl'

export class BeltGeometry extends Geometry {
  constructor(gl: OGLRenderingContext, count = 4000) {
    const position = new Float32Array(count * 3)
    const random = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 1.6 + Math.random() * 0.7

      position.set(
        [Math.cos(angle) * radius, (Math.random() - 0.5) * 0.12, Math.sin(angle) * radius],
        i * 3,
      )
      random[i] = Math.random()
    }

    super(gl, {
      position: { size: 3, data: position },
      random: { size: 1, data: random },
    })
  }
}
