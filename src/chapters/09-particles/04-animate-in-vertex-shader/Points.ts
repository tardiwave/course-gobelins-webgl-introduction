import { Geometry, Mesh, Program, type OGLRenderingContext } from 'ogl'
import palette from '../../../shaders/chunks/palette.glsl?raw'
import vertex from './vertex.glsl?raw'
import fragment from './fragment.glsl?raw'

export class Points extends Mesh {
  private elapsed: { value: number }

  constructor(gl: OGLRenderingContext, count = 2000) {
    const position = new Float32Array(count * 3)
    const random = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      position.set([Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1], i * 3)
      random[i] = Math.random()
    }

    const elapsed = { value: 0 }

    super(gl, {
      mode: gl.POINTS,
      geometry: new Geometry(gl, {
        position: { size: 3, data: position },
        random: { size: 1, data: random },
      }),
      program: new Program(gl, {
        vertex,
        fragment: palette + fragment,
        uniforms: {
          uPixelRatio: { value: gl.renderer.dpr },
          uTime: elapsed,
        },
      }),
    })

    this.elapsed = elapsed
  }

  update(time: number) {
    // One number sent per frame. That is the entire cost on the CPU side —
    // the position buffer is never touched again after it is uploaded.
    this.elapsed.value = time
  }

  dispose() {
    this.geometry.remove()
    this.program.remove()
  }
}
