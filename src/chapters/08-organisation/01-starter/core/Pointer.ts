import { Vec2 } from 'ogl'

export class Pointer {
  /** 0 to 1 across the element, y up like a texture. */
  uv = new Vec2(0.5, 0.5)

  /** -1 to 1, y up, centred on the element. */
  clip = new Vec2()

  private element: HTMLElement

  constructor(element: HTMLElement) {
    this.element = element
    element.addEventListener('pointermove', this.onMove)
  }

  dispose() {
    this.element.removeEventListener('pointermove', this.onMove)
  }

  // An arrow function keeps `this` and the same reference for removeEventListener.
  private onMove = (event: PointerEvent) => {
    const bounds = this.element.getBoundingClientRect()

    const x = (event.clientX - bounds.left) / bounds.width
    const y = 1 - (event.clientY - bounds.top) / bounds.height

    this.uv.set(x, y)
    this.clip.set(x * 2 - 1, y * 2 - 1)
  }
}
