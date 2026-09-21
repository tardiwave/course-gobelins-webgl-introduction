import { SpaceScene } from '../../../scenes/SpaceScene.ts'
import { Belt } from '../../../objects/Belt.ts'
import type { OGLRenderingContext } from 'ogl'

/**
 * The planet scene of the organisation chapter, with a belt added. Extending it rather than
 * rewriting it is the whole reason these are classes.
 */
export class BeltScene extends SpaceScene {
  belt: Belt

  constructor(gl: OGLRenderingContext) {
    super(gl)

    this.belt = new Belt(gl)
    this.belt.setParent(this)
  }

  update(time: number) {
    super.update(time)
    this.belt.update(time)
  }

  dispose() {
    super.dispose()
    this.belt.dispose()
  }
}
