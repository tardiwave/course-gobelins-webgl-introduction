export class Clock {
  /** Seconds since the step opened. */
  time = 0

  /** Seconds since the previous frame. Multiply speeds by it. */
  delta = 0

  private origin = performance.now()
  private previous = this.origin

  update(now: number) {
    this.time = (now - this.origin) / 1000

    // Capped: a background tab comes back with several seconds of delta.
    this.delta = Math.min((now - this.previous) / 1000, 1 / 30)
    this.previous = now
  }
}
