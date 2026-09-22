import { Transform, type OGLRenderingContext } from 'ogl'
import type { Scene } from '../../../core/Scene.ts'
import { Points } from './Points.ts'

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
