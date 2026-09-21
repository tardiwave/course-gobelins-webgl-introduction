import { Mesh, Program, type OGLRenderingContext } from 'ogl'
import { BeltGeometry } from '../geometries/BeltGeometry.ts'
import palette from '../shaders/chunks/palette.glsl?raw'
import vertex from '../shaders/belt/vertex.glsl?raw'
import fragment from '../shaders/belt/fragment.glsl?raw'

/**
 * The ring of particles around the planet. It owns its geometry, its shader
 * and its uniforms, so a scene only ever has to call update().
 */
export class Belt extends Mesh {
  /** 0 hides the fog entirely, 1 fades the far side into the background. */
  fog = { value: 0 }

  private elapsed = { value: 0 }

  constructor(gl: OGLRenderingContext, count = 4000) {
    const elapsed = { value: 0 }
    const fog = { value: 0 }

    super(gl, {
      mode: gl.POINTS,
      geometry: new BeltGeometry(gl, count),
      program: new Program(gl, {
        vertex,
        fragment: palette + fragment,
        uniforms: {
          uPixelRatio: { value: gl.renderer.dpr },
          uTime: elapsed,
          uFog: fog,
        },
      }),
    })

    this.elapsed = elapsed
    this.fog = fog
  }

  update(time: number) {
    this.elapsed.value = time
  }

  dispose() {
    this.geometry.remove()
    this.program.remove()
  }
}
