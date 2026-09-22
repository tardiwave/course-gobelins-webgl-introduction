import { Mesh, Orbit, Program, RenderTarget, Triangle, Vec2 } from 'ogl'
import { mountCanvas } from '../../../core/canvas.ts'
import { createThumbnails } from '../../../utils/thumbnails.ts'
import { AsteroidsScene } from '../../../scenes/AsteroidsScene.ts'
import palette from '../../../shaders/chunks/palette.glsl?raw'
import screenVertex from '../../../shaders/chunks/screen.glsl?raw'
import thumbnailsChunk from '../../../shaders/chunks/thumbnails.glsl?raw'
import brightSource from './bright.glsl?raw'
import blurSource from './blur.glsl?raw'
import compositeSource from './composite.glsl?raw'

export function start(root: HTMLElement) {
  const { renderer, gl, camera, viewport, loop } = mountCanvas(root)

  camera.position.set(0, 1.2, 4.5)
  camera.lookAt([0, 0, 0])

  const scene = new AsteroidsScene(gl)

  // Click a thumbnail to blow it up, click again to come back.
  const thumbnails = createThumbnails(gl.canvas as HTMLCanvasElement, 3)

  // A shader can't read the texture it writes to, so each pass needs its own target.
  const render = new RenderTarget(gl, { width: 1, height: 1 })
  const bright = new RenderTarget(gl, { width: 1, height: 1 })
  const first = new RenderTarget(gl, { width: 1, height: 1 })
  const second = new RenderTarget(gl, { width: 1, height: 1 })

  const geometry = new Triangle(gl)

  const threshold = new Mesh(gl, {
    geometry,
    program: new Program(gl, {
      vertex: screenVertex,
      fragment: palette + brightSource,
      uniforms: { tScene: { value: render.texture }, uThreshold: { value: 0.45 } },
    }),
  })

  const blur = new Mesh(gl, {
    geometry,
    program: new Program(gl, {
      vertex: screenVertex,
      fragment: palette + blurSource,
      uniforms: { tScene: { value: bright.texture }, uDirection: { value: new Vec2() } },
    }),
  })

  const composite = new Mesh(gl, {
    geometry,
    program: new Program(gl, {
      vertex: screenVertex,
      fragment: palette + thumbnailsChunk + compositeSource,
      uniforms: {
        tScene: { value: render.texture },
        tBright: { value: bright.texture },
        tBloom: { value: second.texture },
        uAmount: { value: 1.35 },
        uGrain: { value: 0.35 },
        uTime: { value: 0 },
        uZoom: thumbnails.zoom,
      },
    }),
  })

  const orbit = new Orbit(camera, { element: gl.canvas })

  const stop = loop(({ time }) => {
    const width = viewport.pixelWidth
    const height = viewport.pixelHeight

    render.setSize(width, height)

    // The glow is blurred anyway: half resolution is a quarter of the pixels.
    const halfWidth = Math.max(Math.round(width / 2), 1)
    const halfHeight = Math.max(Math.round(height / 2), 1)
    bright.setSize(halfWidth, halfHeight)
    first.setSize(halfWidth, halfHeight)
    second.setSize(halfWidth, halfHeight)

    scene.update(time)
    orbit.update()

    // 1. the scene lands in a texture instead of on the screen
    renderer.render({ scene, camera, target: render })

    // 2. everything brighter than the threshold is pulled out of it
    threshold.program.uniforms.tScene.value = render.texture
    renderer.render({ scene: threshold, target: bright })

    // 3 and 4. blur across, then down: 2 x 9 reads per pixel instead of 81 in 2D
    blur.program.uniforms.tScene.value = bright.texture
    blur.program.uniforms.uDirection.value.set(4.5 / halfWidth, 0)
    renderer.render({ scene: blur, target: first })

    blur.program.uniforms.tScene.value = first.texture
    blur.program.uniforms.uDirection.value.set(0, 4.5 / halfHeight)
    renderer.render({ scene: blur, target: second })

    // 5. one last pass, three effects: aberration, bloom and grain
    composite.program.uniforms.tScene.value = render.texture
    composite.program.uniforms.tBright.value = bright.texture
    composite.program.uniforms.tBloom.value = second.texture
    composite.program.uniforms.uTime.value = time
    renderer.render({ scene: composite })
  })

  return () => {
    thumbnails.dispose()
    orbit.remove()
    scene.dispose()
    stop()
  }
}
