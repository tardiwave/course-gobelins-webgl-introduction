import type { Camera, Renderer } from 'ogl'

export class Viewport {
  width = 0
  height = 0

  private element: HTMLElement
  private renderer: Renderer
  private camera: Camera
  private observer: ResizeObserver

  constructor(element: HTMLElement, renderer: Renderer, camera: Camera) {
    this.element = element
    this.renderer = renderer
    this.camera = camera

    this.observer = new ResizeObserver(() => this.resize())
    this.observer.observe(element)

    this.resize()
  }

  resize() {
    this.width = this.element.clientWidth
    this.height = this.element.clientHeight

    this.renderer.setSize(this.width, this.height)
    this.camera.perspective({ aspect: this.width / this.height })
  }

  dispose() {
    this.observer.disconnect()
  }
}
