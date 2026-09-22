import { Camera, Mesh, Orbit, Program, Raycast, Renderer, Sphere, Vec2, Vec3 } from 'ogl'
import { loadTexture } from '../../../utils/texture.ts'
import { damp } from '../../../utils/maths.ts'
import palette from '../../../shaders/chunks/palette.glsl?raw'
import vertex from './vertex.glsl?raw'
import fragmentSource from './fragment.glsl?raw'

export function start(root: HTMLElement) {
  const renderer = new Renderer({ dpr: Math.min(devicePixelRatio, 2), webgl: 1 })
  const gl = renderer.gl
  root.append(gl.canvas)

  // DARK from the palette.
  gl.clearColor(0.055, 0.059, 0.067, 1)

  const camera = new Camera(gl, { fov: 45, near: 0.1, far: 100 })
  camera.position.z = 3.4

  const resize = () => {
    renderer.setSize(root.clientWidth, root.clientHeight)
    camera.perspective({ aspect: root.clientWidth / root.clientHeight })
  }

  const observer = new ResizeObserver(resize)
  observer.observe(root)

  // Cursor in clip space, -1 to 1 on both axes, as a ray expects.
  const pointer = new Vec2(0, 0)

  // Where the cursor hits the sphere, in the sphere's own space.
  const point = new Vec3(0.3, 0.45, 0.84)
  const target = new Vec3(0.3, 0.45, 0.84)

  const program = new Program(gl, {
    vertex,
    fragment: palette + fragmentSource,
    uniforms: {
      tMap: { value: loadTexture(gl, '/textures/earth.png') },
      uPoint: { value: point },
    },
  })

  const mesh = new Mesh(gl, {
    geometry: new Sphere(gl, { radius: 1, widthSegments: 48 }),
    program,
  })

  // A ray fired from the camera through the cursor, tested against the mesh.
  const raycast = new Raycast()

  const onPointerMove = (event: PointerEvent) => {
    const bounds = root.getBoundingClientRect()
    pointer.set(
      ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      -(((event.clientY - bounds.top) / bounds.height) * 2 - 1),
    )
  }

  root.addEventListener('pointermove', onPointerMove)

  const orbit = new Orbit(camera, { element: gl.canvas })

  let frame = 0
  const origin = performance.now()
  let previous = origin

  const render = (now: number) => {
    const time = (now - origin) / 1000
    const delta = Math.min(Math.max(now - previous, 0), 33) / 1000
    previous = now

    mesh.rotation.y = time * 0.15
    mesh.rotation.z = 0.41

    orbit.update()

    raycast.castMouse(camera, pointer)

    // The hit is in the mesh's own space, like vLocal; undefined until something is hit.
    const [hit] = raycast.intersectMeshes([mesh])
    if (hit?.hit?.localPoint) target.copy(hit.hit.localPoint).normalize()

    point.x = damp(point.x, target.x, 7.7, delta)
    point.y = damp(point.y, target.y, 7.7, delta)
    point.z = damp(point.z, target.z, 7.7, delta)

    renderer.render({ scene: mesh, camera })
    frame = requestAnimationFrame(render)
  }

  frame = requestAnimationFrame(render)

  return () => {
    root.removeEventListener('pointermove', onPointerMove)
    orbit.remove()
    cancelAnimationFrame(frame)
    observer.disconnect()
    gl.canvas.remove()
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}
