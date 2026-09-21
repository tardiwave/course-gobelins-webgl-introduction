import { Transform, type OGLRenderingContext } from 'ogl'
import type { Scene } from '../../../core/Scene.ts'
import { Points } from './Points.ts'

/**
 * A scene with one object in it. Small, but it already has the shape every
 * scene in this course has: build in the constructor, move in update, give
 * back in dispose.
 */
export class PointsScene extends Transform implements Scene {
  points: Points

  constructor(gl: OGLRenderingContext) {
    super()

    this.points = new Points(gl)
    this.points.setParent(this)
  }

  update(time: number) {
    this.points.update(time)
  }

  dispose() {
    this.points.dispose()
  }
}
