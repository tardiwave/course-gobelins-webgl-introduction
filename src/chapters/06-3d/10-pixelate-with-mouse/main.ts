import { Camera, Mesh, Orbit, Program, Raycast, Renderer, Sphere, Vec2, Vec3 } from 'ogl'
import { loadTexture } from '../../../utils/texture.ts'
import palette from '../../../shaders/chunks/palette.glsl?raw'
import vertex from './vertex.glsl?raw'
import fragmentSource from './fragment.glsl?raw'

export function start(root: HTMLElement) {
  const renderer = new Renderer({ dpr: Math.min(devicePixelRatio, 2), webgl: 1 })
  const gl = renderer.gl
  root.append(gl.canvas)

  // The same dark as DARK in the palette.
  gl.clearColor(0.055, 0.059, 0.067, 1)

  const camera = new Camera(gl, { fov: 45, near: 0.1, far: 100 })
  camera.position.z = 3.4

  const resize = () => {
    renderer.setSize(root.clientWidth, root.clientHeight)
    camera.perspective({ aspect: root.clientWidth / root.clientHeight })
  }

  const observer = new ResizeObserver(resize)
  observer.observe(root)

  // The cursor in clip space, -1 to 1 on both axes: what a ray needs.
  const pointer = new Vec2(0, 0)

  // Where the cursor lands ON the sphere, in the sphere's own space.
  // Starts over land, so the effect is visible before the cursor moves.
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

  const render = (now: number) => {
    const time = (now - origin) / 1000

    mesh.rotation.y = time * 0.15
    mesh.rotation.z = 0.41

    orbit.update()

    raycast.castMouse(camera, pointer)

    // Triangle-accurate, and it hands back the hit in the mesh's own space —
    // which is exactly the space the shader compares against.
    // hit is only set once something has actually been hit, hence the check.
    const [hit] = raycast.intersectMeshes([mesh])
    if (hit?.hit?.localPoint) target.copy(hit.hit.localPoint).normalize()

    // Damped, as always.
    point.x += (target.x - point.x) * 0.12
    point.y += (target.y - point.y) * 0.12
    point.z += (target.z - point.z) * 0.12

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
