import { Transform, type OGLRenderingContext } from 'ogl'
import type { Scene } from '../core/Scene.ts'
import { Planet } from '../objects/Planet.ts'

export class SpaceScene extends Transform implements Scene {
  gl: OGLRenderingContext
  planet: Planet

  constructor(gl: OGLRenderingContext) {
    super()

    this.gl = gl
    this.planet = new Planet(gl)

    this.planet.setParent(this)
  }

  update(time: number) {
    this.planet.update(time)
  }

  dispose() {
    this.planet.dispose()
  }
}
