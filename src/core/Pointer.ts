import { Vec2 } from 'ogl'

/**
 * The cursor, in the three forms a scene ever needs: texture coordinates,
 * clip coordinates, and a speed.
 */
export class Pointer {
  /** 0 to 1 across the element, y up like a texture. */
  uv = new Vec2(0.5, 0.5)

  /** -1 to 1 with y up, which is what a raycast wants. */
  clip = new Vec2()

  /** uv per second, measured between frames rather than between events. */
  velocity = new Vec2()

  /** False while the cursor is outside, so effects can park themselves. */
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
    // Distance covered since the last frame, over the time it took. Reading a
    // speed from one pointer event instead would give a different number on
    // every machine.
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

    // The first event has no previous position, so it would read as one
    // enormous jump.
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
