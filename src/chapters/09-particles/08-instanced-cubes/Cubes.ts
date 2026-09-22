import { Box, Geometry, Mesh, Program, Vec3, type OGLRenderingContext } from 'ogl'
import palette from '../../../shaders/chunks/palette.glsl?raw'
import vertex from './vertex.glsl?raw'
import fragmentSource from './fragment.glsl?raw'

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

    const geometry = new Box(gl, { width: 0.02, height: 0.02, depth: 0.02 }) as Geometry

    // instanced: 1 advances the attribute once per instance, not once per vertex.
    geometry.addAttribute('offset', { instanced: 1, size: 3, data: offset })
    geometry.addAttribute('random', { instanced: 1, size: 1, data: random })

    const elapsed = { value: 0 }

    super(gl, {
      geometry,
      program: new Program(gl, {
        vertex,
        fragment: palette + fragmentSource,
        uniforms: { uTime: elapsed, uLight: { value: new Vec3(1, 0.6, 0.4).normalize() } },
      }),
    })

    this.elapsed = elapsed

    // The bounds cover one cube at the origin, not the copies, so culling would be wrong.
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
