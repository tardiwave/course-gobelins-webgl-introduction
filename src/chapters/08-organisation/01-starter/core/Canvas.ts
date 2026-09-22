import { Camera, Renderer, type Transform } from 'ogl'
import { Clock } from './Clock.ts'
import { Pointer } from './Pointer.ts'
import { Viewport } from './Viewport.ts'
import type { Scene } from './Scene.ts'

export class Canvas {
  renderer: Renderer
  gl: Renderer['gl']
  camera: Camera
  viewport: Viewport
  clock = new Clock()
  pointer: Pointer

  private request = 0

  constructor(root: HTMLElement) {
    this.renderer = new Renderer({ dpr: Math.min(devicePixelRatio, 2), webgl: 1 })
    this.gl = this.renderer.gl
    root.append(this.gl.canvas)

    this.gl.clearColor(0.055, 0.059, 0.067, 1)

    this.camera = new Camera(this.gl, { fov: 45, near: 0.1, far: 100 })
    this.viewport = new Viewport(root, this.renderer, this.camera)
    this.pointer = new Pointer(root)
  }

  start(scene: Transform & Scene) {
    const frame = (now: number) => {
      this.clock.update(now)
      scene.update(this.clock)
      this.renderer.render({ scene, camera: this.camera })

      this.request = requestAnimationFrame(frame)
    }

    this.request = requestAnimationFrame(frame)
  }

  dispose() {
    cancelAnimationFrame(this.request)
    this.pointer.dispose()
    this.viewport.dispose()
    this.gl.canvas.remove()
    // Removing the canvas does not free its context, and a page only gets about sixteen.
    this.gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}
