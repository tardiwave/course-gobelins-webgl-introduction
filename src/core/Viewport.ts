import type { Camera, Renderer } from 'ogl'

/**
 * The size of the drawing area, and everything that has to follow it: the
 * renderer, the camera's aspect, and anything asking how many pixels wide the
 * canvas is.
 */
export class Viewport {
  width = 0
  height = 0

  private element: HTMLElement
  private renderer: Renderer
  private camera?: Camera
  private observer: ResizeObserver

  constructor(element: HTMLElement, renderer: Renderer, camera?: Camera) {
    this.element = element
    this.renderer = renderer
    this.camera = camera

    this.observer = new ResizeObserver(() => this.resize())
    this.observer.observe(element)

    this.resize()
  }

  get aspect() {
    return this.width / this.height
  }

  /** The canvas size in real pixels, which is what a render target needs. */
  get pixelWidth() {
    return Math.round(this.width * this.renderer.dpr)
  }

  get pixelHeight() {
    return Math.round(this.height * this.renderer.dpr)
  }

  resize() {
    this.width = this.element.clientWidth
    this.height = this.element.clientHeight

    this.renderer.setSize(this.width, this.height)
    this.camera?.perspective({ aspect: this.aspect })
  }

  dispose() {
    this.observer.disconnect()
  }
}
