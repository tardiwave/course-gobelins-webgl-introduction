import { GLTFLoader, Mesh, Program, Transform, Vec3, type OGLRenderingContext } from 'ogl'
import palette from '../shaders/chunks/palette.glsl?raw'
import noise from '../shaders/chunks/noise.glsl?raw'
import drift from '../shaders/chunks/drift.glsl?raw'
import vertex from '../shaders/asteroids/vertex.glsl?raw'
import fragment from '../shaders/asteroids/fragment.glsl?raw'

// Model credits: see public/models/CREDITS.md.
export class Asteroids extends Transform {
  light = { value: new Vec3(1, 0.4, 0.6) }

  // 0 disables the depth fog.
  fog = { value: 0 }

  private elapsed = { value: 0 }
  private rocks?: Mesh
  private disposed = false

  constructor(gl: OGLRenderingContext, count = 2400) {
    super()

    const offset = new Float32Array(count * 3)
    const random = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 1.55 + Math.random() * 0.9

      offset.set(
        [Math.cos(angle) * radius, (Math.random() - 0.5) * 0.14, Math.sin(angle) * radius],
        i * 3,
      )
      random[i] = Math.random()
    }

    GLTFLoader.load(gl, '/models/asteroids.glb').then((gltf) => {
      if (this.disposed) return

      // The lightest of the ten rocks, since it is drawn thousands of times.
    const geometry = gltf.meshes[1].primitives[0].geometry
      geometry.addAttribute('offset', { instanced: 1, size: 3, data: offset })
      geometry.addAttribute('random', { instanced: 1, size: 1, data: random })

      this.rocks = new Mesh(gl, {
        geometry,
        program: new Program(gl, {
          // GLSL has no #include: the chunks are concatenated in front of the shader.
          vertex: noise + drift + vertex,
          fragment: palette + fragment,
          uniforms: {
            tMap: { value: gltf.materials[0].baseColorTexture.texture },
            uLight: this.light,
            uFog: this.fog,
            uTime: this.elapsed,
          },
        }),
      })
      this.rocks.frustumCulled = false
      this.rocks.setParent(this)
    })
  }

  update(time: number) {
    this.elapsed.value = time
  }

  dispose() {
    this.disposed = true
    this.rocks?.geometry.remove()
    this.rocks?.program.remove()
  }
}
