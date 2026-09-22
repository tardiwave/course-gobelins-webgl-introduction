import { Mesh, Program, Sphere, TextureLoader, Transform, Vec3, type OGLRenderingContext } from 'ogl'
import palette from '../shaders/chunks/palette.glsl?raw'
import vertex from '../shaders/planet/vertex.glsl?raw'
import ground from '../shaders/planet/ground.glsl?raw'
import clouds from '../shaders/planet/clouds.glsl?raw'
import halo from '../shaders/planet/halo.glsl?raw'

const HALO_SCALE = 1.25

export class Planet extends Transform {
  // The same object in three programs: changing .value updates all of them.
  light = { value: new Vec3(1, 0.4, 0.6) }

  private time = { value: 0 }
  private geometry: Sphere
  private ground: Mesh
  private clouds: Mesh
  private halo: Mesh

  constructor(gl: OGLRenderingContext) {
    super()

    const texture = (src: string, tile = false) =>
      TextureLoader.load(gl, {
        src,
        generateMipmaps: false,
        minFilter: gl.LINEAR,
        wrapS: gl.REPEAT,
        wrapT: tile ? gl.REPEAT : gl.CLAMP_TO_EDGE,
      })

    this.geometry = new Sphere(gl, { radius: 1, widthSegments: 48 })

    this.ground = new Mesh(gl, {
      geometry: this.geometry,
      program: new Program(gl, {
        vertex,
        fragment: palette + ground,
        uniforms: {
          tMap: { value: texture('/textures/earth.png') },
          tNormal: { value: texture('/textures/earth-normal.png') },
          uLight: this.light,
        },
      }),
    })
    this.ground.rotation.z = 0.41
    this.ground.setParent(this)

    this.clouds = new Mesh(gl, {
      geometry: this.geometry,
      program: new Program(gl, {
        vertex,
        fragment: palette + clouds,
        uniforms: {
          tClouds: { value: texture('/textures/clouds.png') },
          tNoise: { value: texture('/textures/noise.jpg', true) },
          uLight: this.light,
          uTime: this.time,
        },
        transparent: true,
        depthWrite: false,
      }),
    })
    this.clouds.scale.set(1.012)
    this.clouds.rotation.z = 0.41
    this.clouds.setParent(this)

    this.halo = new Mesh(gl, {
      geometry: this.geometry,
      program: new Program(gl, {
        vertex,
        fragment: palette + halo,
        uniforms: { uLight: this.light, uScale: { value: HALO_SCALE } },
        transparent: true,
        cullFace: gl.FRONT,
        depthWrite: false,
      }),
    })
    this.halo.scale.set(HALO_SCALE)
    this.halo.setParent(this)
  }

  update(time: number) {
    this.time.value = time
    this.light.value.set(Math.cos(time * 0.25), 0.4, Math.sin(time * 0.25)).normalize()

    this.ground.rotation.y = time * 0.08
    this.clouds.rotation.y = time * 0.11
  }

  dispose() {
    // Shared by the three meshes, so freed once.
    this.geometry.remove()
    this.ground.program.remove()
    this.clouds.program.remove()
    this.halo.program.remove()
  }
}
