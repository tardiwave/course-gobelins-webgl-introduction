/**
 * The time a scene runs on. One object, updated once per frame, so everything
 * that moves reads the same numbers.
 */
export class Clock {
  /** Seconds since the step opened. */
  time = 0

  /** Seconds since the previous frame. Multiply speeds by it. */
  delta = 0

  private origin = performance.now()
  private previous = this.origin

  update(now: number) {
    this.time = (now - this.origin) / 1000

    // Capped: a tab left in the background comes back with a delta of several
    // seconds, and anything integrating it would take one enormous step.
    this.delta = Math.min((now - this.previous) / 1000, 1 / 30)
    this.previous = now
  }
}
