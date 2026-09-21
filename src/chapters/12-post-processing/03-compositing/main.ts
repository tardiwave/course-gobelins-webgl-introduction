import { Mesh, Orbit, Program, RenderTarget, Triangle, Vec2 } from 'ogl'
import { mountCanvas } from '../../../core/canvas.ts'
import { createThumbnails } from '../../../utils/thumbnails.ts'
import { AsteroidsScene } from '../../../scenes/AsteroidsScene.ts'
import palette from '../../../shaders/chunks/palette.glsl?raw'
import screenVertex from '../../../shaders/chunks/screen.glsl?raw'
import thumbnails from '../../../shaders/chunks/thumbnails.glsl?raw'
import brightSource from './bright.glsl?raw'
import blurSource from './blur.glsl?raw'
import compositeSource from './composite.glsl?raw'

export function start(root: HTMLElement) {
  const { renderer, gl, camera, viewport, loop } = mountCanvas(root)

  camera.position.set(0, 1.2, 4.5)
  camera.lookAt([0, 0, 0])

  const scene = new AsteroidsScene(gl)

  // Click a thumbnail to blow it up, click again to come back.
  const strip = createThumbnails(gl.canvas as HTMLCanvasElement, 3)

  // A shader can never read the texture it is writing into, so every link in
  // the chain needs somewhere else to land: the render, what the threshold
  // kept, and two buffers for the two blur passes.
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
      fragment: palette + thumbnails + compositeSource,
      uniforms: {
        tScene: { value: render.texture },
        tBright: { value: bright.texture },
        tBloom: { value: second.texture },
        uAmount: { value: 1.35 },
        uZoom: strip.zoom,
      },
    }),
  })

  const orbit = new Orbit(camera, { element: gl.canvas })

  const stop = loop(({ time }) => {
    const width = viewport.pixelWidth
    const height = viewport.pixelHeight

    render.setSize(width, height)

    // The glow is blurred anyway, so half the pixels are wasted on it. A
    // quarter of the work, and nobody has ever noticed.
    const small = new Vec2(Math.max(Math.round(width / 2), 1), Math.max(Math.round(height / 2), 1))
    bright.setSize(small.x, small.y)
    first.setSize(small.x, small.y)
    second.setSize(small.x, small.y)

    scene.update(time)
    orbit.update()

    // 1. the scene lands in a texture instead of on the screen
    renderer.render({ scene, camera, target: render })

    // 2. everything brighter than the threshold is pulled out of it
    threshold.program.uniforms.tScene.value = render.texture
    renderer.render({ scene: threshold, target: bright })

    // 3 and 4. blurred across, then down. Two 1D passes cost eighteen reads
    //    per pixel where one 2D pass of the same width would cost eighty-one.
    blur.program.uniforms.tScene.value = bright.texture
    blur.program.uniforms.uDirection.value.set(4.5 / small.x, 0)
    renderer.render({ scene: blur, target: first })

    blur.program.uniforms.tScene.value = first.texture
    blur.program.uniforms.uDirection.value.set(0, 4.5 / small.y)
    renderer.render({ scene: blur, target: second })

    // 5. the last pass reads the render AND both intermediate textures, and
    //    goes to the screen
    composite.program.uniforms.tScene.value = render.texture
    composite.program.uniforms.tBright.value = bright.texture
    composite.program.uniforms.tBloom.value = second.texture
    renderer.render({ scene: composite })
  })

  return () => {
    strip.dispose()
    orbit.remove()
    scene.dispose()
    stop()
  }
}
