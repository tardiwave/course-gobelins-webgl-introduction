import { Box, Geometry, Mesh, Program, Vec3, type OGLRenderingContext } from 'ogl'
import palette from '../../../shaders/chunks/palette.glsl?raw'
import vertex from './vertex.glsl?raw'
import fragment from './fragment.glsl?raw'

/**
 * The same belt, drawn with real cubes instead of points. One geometry,
 * thousands of copies, a single draw call.
 */
export class Cubes extends Mesh {
  private elapsed: { value: number }

  constructor(gl: OGLRenderingContext, count = 4000) {
    const offset = new Float32Array(count * 3)
    const random = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 1.6 + Math.random() * 0.7

      offset.set(
        [Math.cos(angle) * radius, (Math.random() - 0.5) * 0.12, Math.sin(angle) * radius],
        i * 3,
      )
      random[i] = Math.random()
    }

    // A real cube this time, with its eight vertices and twelve triangles.
    const geometry = new Box(gl, { width: 0.02, height: 0.02, depth: 0.02 }) as Geometry

    // instanced: 1 means "advance by one value per instance, not per vertex".
    // The cube is uploaded once; only these two buffers say where each copy goes.
    geometry.addAttribute('offset', { instanced: 1, size: 3, data: offset })
    geometry.addAttribute('random', { instanced: 1, size: 1, data: random })

    const elapsed = { value: 0 }

    super(gl, {
      geometry,
      program: new Program(gl, {
        vertex,
        fragment: palette + fragment,
        uniforms: { uTime: elapsed, uLight: { value: new Vec3(1, 0.6, 0.4).normalize() } },
      }),
    })

    this.elapsed = elapsed

    // The bounds of an instanced mesh describe one cube at the origin, which
    // says nothing about where the copies are. So: no frustum culling.
    this.frustumCulled = false
  }

  update(time: number) {
    this.elapsed.value = time
  }

  dispose() {
    this.geometry.remove()
    this.program.remove()
  }
}
