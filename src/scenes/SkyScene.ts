import { SpaceScene } from './SpaceScene.ts'
import { Belt } from '../objects/Belt.ts'
import { Stars } from '../objects/Stars.ts'
import type { OGLRenderingContext } from 'ogl'

/**
 * SpaceScene plus a belt and a distant sky. Extending it rather than rewriting
 * it is the whole reason these are classes.
 */
export class SkyScene extends SpaceScene {
  belt: Belt
  stars: Stars

  constructor(gl: OGLRenderingContext) {
    super(gl)

    this.belt = new Belt(gl)
    this.stars = new Stars(gl)

    this.belt.setParent(this)
    this.stars.setParent(this)
  }

  update(time: number) {
    super.update(time)
    this.belt.update(time)
    this.stars.update(time)
  }

  dispose() {
    super.dispose()
    this.belt.dispose()
    this.stars.dispose()
  }
}
