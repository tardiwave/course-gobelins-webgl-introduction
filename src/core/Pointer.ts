import { Vec2 } from 'ogl'

export class Pointer {
  /** 0 to 1 across the element, y up like a texture. */
  uv = new Vec2(0.5, 0.5)

  /** -1 to 1, y up, as a raycast expects. */
  clip = new Vec2()

  /** uv per second, measured between frames rather than between events. */
  velocity = new Vec2()

  /** False while the cursor is outside the element. */
  inside = false

  private element?: HTMLElement
  private travelled = new Vec2()
  private previous = new Vec2()
  private tracking = false

  attach(element: HTMLElement) {
    this.element = element

    element.addEventListener('pointermove', this.onMove)
    element.addEventListener('pointerleave', this.onLeave)
  }

  update(delta: number) {
    // Measured per frame, not per event, so the speed is the same on every machine.
    const step = Math.max(delta, 1 / 240)
    this.velocity.copy(this.travelled).multiply(1 / step)
    this.travelled.set(0, 0)

    const speed = this.velocity.len()
    if (speed > 4) this.velocity.multiply(4 / speed)
  }

  dispose() {
    this.element?.removeEventListener('pointermove', this.onMove)
    this.element?.removeEventListener('pointerleave', this.onLeave)
  }

  private onMove = (event: PointerEvent) => {
    const bounds = (this.element as HTMLElement).getBoundingClientRect()

    const x = (event.clientX - bounds.left) / bounds.width
    // Texture coordinates start at the bottom, the page starts at the top.
    const y = 1 - (event.clientY - bounds.top) / bounds.height

    // The first event has no previous position, so it would read as a huge jump.
    if (this.tracking) this.travelled.add(new Vec2(x, y)).sub(this.previous)

    this.previous.set(x, y)
    this.uv.set(x, y)
    this.clip.set(x * 2 - 1, y * 2 - 1)

    this.tracking = true
    this.inside = true
  }

  private onLeave = () => {
    this.tracking = false
    this.inside = false
  }
}
