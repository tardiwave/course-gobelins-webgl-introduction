import { SpaceScene } from '../../../scenes/SpaceScene.ts'
import { Cubes } from './Cubes.ts'
import type { OGLRenderingContext } from 'ogl'

export class CubesScene extends SpaceScene {
  cubes: Cubes

  constructor(gl: OGLRenderingContext) {
    super(gl)

    this.cubes = new Cubes(gl)
    this.cubes.setParent(this)
  }

  update(time: number) {
    super.update(time)
    this.cubes.update(time)
  }

  dispose() {
    super.dispose()
    this.cubes.dispose()
  }
}
