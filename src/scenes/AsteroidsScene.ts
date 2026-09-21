import { SpaceScene } from './SpaceScene.ts'
import { Asteroids } from '../objects/Asteroids.ts'
import { Stars } from '../objects/Stars.ts'
import type { OGLRenderingContext } from 'ogl'

/**
 * The scene of the particles chapter, with the belt of points swapped for the loaded
 * model. Nothing else about it changes — that is the benefit of the object
 * having been a class since the organisation chapter.
 *
 * This is the finished scene, and every chapter after this one renders it.
 */
export class AsteroidsScene extends SpaceScene {
  asteroids: Asteroids
  stars: Stars

  constructor(gl: OGLRenderingContext) {
    super(gl)

    this.asteroids = new Asteroids(gl)
    this.stars = new Stars(gl)

    this.asteroids.setParent(this)
    this.stars.setParent(this)

    // The depth fog stays on from here to the end of the course.
    this.asteroids.fog.value = 1
  }

  update(time: number) {
    super.update(time)

    // The rocks are lit by the planet's own light, so they never disagree
    // with it about where the sun is.
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
