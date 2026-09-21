import { Mesh, Program, type OGLRenderingContext } from 'ogl'
import { StarsGeometry } from '../geometries/StarsGeometry.ts'
import palette from '../shaders/chunks/palette.glsl?raw'
import vertex from '../shaders/stars/vertex.glsl?raw'
import fragment from '../shaders/stars/fragment.glsl?raw'

/**
 * The distant sky. Each point draws the smooth circle of the drawing chapter
 * inside its own sprite, using gl_PointCoord. It turns very slowly on its own:
 * parallax is most of what tells the eye how far away something is.
 */
export class Stars extends Mesh {
  constructor(gl: OGLRenderingContext, count = 6000) {
    super(gl, {
      mode: gl.POINTS,
      geometry: new StarsGeometry(gl, count),
      program: new Program(gl, {
        vertex,
        fragment: palette + fragment,
        uniforms: { uPixelRatio: { value: gl.renderer.dpr } },
        transparent: true,
        depthWrite: false,
      }),
    })
  }

  update(time: number) {
    this.rotation.y = time * 0.01
  }

  dispose() {
    this.geometry.remove()
    this.program.remove()
  }
}
