import { SpaceScene } from './SpaceScene.ts'
import { Asteroids } from '../objects/Asteroids.ts'
import { Stars } from '../objects/Stars.ts'
import type { OGLRenderingContext } from 'ogl'

export class AsteroidsScene extends SpaceScene {
  asteroids: Asteroids
  stars: Stars

  constructor(gl: OGLRenderingContext) {
    super(gl)

    this.asteroids = new Asteroids(gl)
    this.stars = new Stars(gl)

    this.asteroids.setParent(this)
    this.stars.setParent(this)

    this.asteroids.fog.value = 1
  }

  update(time: number) {
    super.update(time)

    // Lit by the planet's own light, so both agree on where the sun is.
    this.asteroids.light.value.copy(this.planet.light.value)
    this.asteroids.update(time)
    this.stars.update(time)
  }

  dispose() {
    super.dispose()
    this.asteroids.dispose()
    this.stars.dispose()
  }
}
