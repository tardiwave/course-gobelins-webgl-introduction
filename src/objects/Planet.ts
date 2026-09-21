import { Mesh, Program, Sphere, Transform, Vec3, type OGLRenderingContext } from 'ogl'
import { loadTexture } from '../utils/texture.ts'
import palette from '../shaders/chunks/palette.glsl?raw'
import vertex from '../shaders/planet/vertex.glsl?raw'
import surface from '../shaders/planet/ground.glsl?raw'
import cloudsFragment from '../shaders/planet/clouds.glsl?raw'
import haloFragment from '../shaders/planet/halo.glsl?raw'

const HALO_SCALE = 1.25

/**
 * The planet exactly as the 3D chapter left it: normal-mapped ground, animated
 * clouds, lit halo — three spheres sharing one geometry and one light.
 *
 * It is a Transform, so it drops into any scene with setParent, and it knows
 * how to move itself. Shaders come from the files next to this one.
 */
export class Planet extends Transform {
  /** The direction the light comes from, shared by the three shaders. */
  light = { value: new Vec3(1, 0.4, 0.6) }

  private elapsed = { value: 0 }
  private geometry: Sphere
  private ground: Mesh
  private clouds: Mesh
  private halo: Mesh

  constructor(gl: OGLRenderingContext) {
    super()

    this.geometry = new Sphere(gl, { radius: 1, widthSegments: 48 })

    this.ground = new Mesh(gl, {
      geometry: this.geometry,
      program: new Program(gl, {
        vertex,
        fragment: palette + surface,
        uniforms: {
          tMap: { value: loadTexture(gl, '/textures/earth.png') },
          tNormal: { value: loadTexture(gl, '/textures/earth-normal.png') },
          uLight: this.light,
        },
      }),
    })
    this.ground.setParent(this)

    this.clouds = new Mesh(gl, {
      geometry: this.geometry,
      program: new Program(gl, {
        vertex,
        fragment: palette + cloudsFragment,
        uniforms: {
          tClouds: { value: loadTexture(gl, '/textures/clouds.png') },
        tNoise: { value: loadTexture(gl, '/textures/noise.jpg', true) },
          uLight: this.light,
          uTime: this.elapsed,
        },
        transparent: true,
        depthWrite: false,
      }),
    })
    this.clouds.scale.set(1.012)
    this.clouds.setParent(this)

    this.halo = new Mesh(gl, {
      geometry: this.geometry,
      program: new Program(gl, {
        vertex,
        fragment: palette + haloFragment,
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
    this.elapsed.value = time
    this.light.value.set(Math.cos(time * 0.25), 0.4, Math.sin(time * 0.25)).normalize()

    this.ground.rotation.y = time * 0.08
    this.ground.rotation.z = 0.41

    this.clouds.rotation.y = time * 0.11
    this.clouds.rotation.z = 0.41
  }

  dispose() {
    // One geometry shared by three meshes, so it is freed once.
    this.geometry.remove()
    this.ground.program.remove()
    this.clouds.program.remove()
    this.halo.program.remove()
  }
}
