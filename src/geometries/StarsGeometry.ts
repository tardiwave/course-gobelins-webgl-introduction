import { Geometry, type OGLRenderingContext } from 'ogl'

export class StarsGeometry extends Geometry {
  constructor(gl: OGLRenderingContext, count = 6000) {
    const position = new Float32Array(count * 3)
    const random = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      // acos() spreads points evenly: a plain random latitude would crowd the poles.
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
