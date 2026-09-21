import { Geometry, type OGLRenderingContext } from 'ogl'

/**
 * Points scattered evenly over a hollow sphere.
 *
 * acos() is what makes it even: two plain randoms for longitude and latitude
 * crowd the poles, because equal steps of latitude cover less and less sphere
 * as you climb.
 */
export class StarsGeometry extends Geometry {
  constructor(gl: OGLRenderingContext, count = 6000) {
    const position = new Float32Array(count * 3)
    const random = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const radius = 25 + Math.random() * 15

      position.set(
        [
          Math.sin(phi) * Math.cos(theta) * radius,
          Math.cos(phi) * radius,
          Math.sin(phi) * Math.sin(theta) * radius,
        ],
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
