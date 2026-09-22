import { Mesh, Program, RenderTarget, Triangle, Vec2, type Renderer } from 'ogl'
import type { Pointer } from '../core/Pointer.ts'

// Parked where the splat's falloff is zero.
const OFFSCREEN = new Vec2(-1, -1)
import precision from '../shaders/chunks/precision.glsl?raw'
import screenVertex from '../shaders/chunks/screen.glsl?raw'
import fragment from '../shaders/fluid/simulation.glsl?raw'

export class Fluid {
  /** How hard the cursor pushes the field, and how fast it forgets. */
  strength = { value: 12 }
  decay = { value: 1.4 }

  private renderer: Renderer
  private simulation: Mesh
  private current: RenderTarget
  private next: RenderTarget

  private pointer = { value: new Vec2(-1, -1) }
  private velocity = { value: new Vec2() }

  constructor(renderer: Renderer, size = 512) {
    this.renderer = renderer
    const gl = renderer.gl

    // A velocity is signed and can exceed 1, so it needs a float texture.
    // LINEAR because advection samples between texels: NEAREST shows blocks.
    if (
      !gl.getExtension('OES_texture_float') ||
      !gl.getExtension('OES_texture_float_linear') ||
      !gl.getExtension('WEBGL_color_buffer_float')
    ) {
      throw new Error('This chapter needs floating point render targets.')
    }

    const format = {
      width: size,
      height: size,
      type: gl.FLOAT,
      format: gl.RGBA,
      internalFormat: gl.RGBA,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
      depth: false,
    }

    this.current = new RenderTarget(gl, format)
    this.next = new RenderTarget(gl, format)

    const geometry = new Triangle(gl)

    // New render targets hold leftover memory, so this mesh clears them.
    const reset = new Mesh(gl, {
      geometry,
      program: new Program(gl, {
        vertex: screenVertex,
        fragment: precision + 'varying vec2 vUv;\nvoid main() { gl_FragColor = vec4(0.0); }\n',
      }),
    })

    renderer.render({ scene: reset, target: this.current })
    renderer.render({ scene: reset, target: this.next })
    reset.program.remove()

    this.simulation = new Mesh(gl, {
      geometry,
      program: new Program(gl, {
        vertex: screenVertex,
        fragment: precision + fragment,
        uniforms: {
          tField: { value: this.current.texture },
          uMouse: this.pointer,
          uVelocity: this.velocity,
          uAspect: { value: 1 },
          uDelta: { value: 0 },
          uStrength: this.strength,
          uDecay: this.decay,
          uTexel: { value: new Vec2(1 / size, 1 / size) },
        },
      }),
    })
  }

  get texture() {
    return this.current.texture
  }

  update(pointer: Pointer, delta: number, aspect: number) {
    this.pointer.value.copy(pointer.inside ? pointer.uv : OFFSCREEN)
    this.velocity.value.copy(pointer.velocity)

    this.simulation.program.uniforms.uAspect.value = aspect
    this.simulation.program.uniforms.uDelta.value = Math.max(delta, 1 / 240)
    this.simulation.program.uniforms.tField.value = this.current.texture

    this.renderer.render({ scene: this.simulation, target: this.next })

    const previous = this.current
    this.current = this.next
    this.next = previous
  }

  dispose() {
    this.simulation.program.remove()
  }
}
