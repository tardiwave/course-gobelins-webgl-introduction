import { Transform, type OGLRenderingContext } from 'ogl'
import type { Clock } from '../core/Clock.ts'
import type { Pointer } from '../core/Pointer.ts'
import type { Scene } from '../core/Scene.ts'
import { Planet } from '../objects/Planet.ts'
import { Ring } from '../objects/Ring.ts'
import { damp } from '../utils/maths.ts'

export class SpaceScene extends Transform implements Scene {
  private pointer: Pointer
  private planet: Planet
  private ring: Ring

  constructor(gl: OGLRenderingContext, pointer: Pointer) {
    super()

    this.pointer = pointer

    this.planet = new Planet(gl)
    this.planet.setParent(this)

    this.ring = new Ring(gl, 1.5)
    this.ring.rotation.z = 0.41
    this.ring.setParent(this)
  }

  update(clock: Clock) {
    this.planet.update(clock.time)

    this.rotation.x = damp(this.rotation.x, -this.pointer.clip.y * 0.35, 3, clock.delta)
    this.rotation.y = damp(this.rotation.y, this.pointer.clip.x * 0.6, 3, clock.delta)
  }

  dispose() {
    // The pointer is owned by the caller, so it is not disposed here.
    this.planet.dispose()
    this.ring.dispose()
  }
}
