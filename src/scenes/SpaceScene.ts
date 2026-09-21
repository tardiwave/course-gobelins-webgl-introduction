import { Transform, type OGLRenderingContext } from 'ogl'
import type { Scene } from '../core/Scene.ts'
import { Planet } from '../objects/Planet.ts'

/**
 * The planet of the 3D chapter as a scene: three meshes, one light, one clock.
 * The particles chapter adds a belt and a sky to it.
 */
export class SpaceScene extends Transform implements Scene {
  gl: OGLRenderingContext
  planet: Planet

  constructor(gl: OGLRenderingContext) {
    super()

    this.gl = gl
    this.planet = new Planet(gl)

    // A Transform's children attach to it directly.
    this.planet.setParent(this)
  }

  update(time: number) {
    this.planet.update(time)
  }

  dispose() {
    this.planet.dispose()
  }
}
