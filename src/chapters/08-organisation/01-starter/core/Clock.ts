export class Clock {
  /** Seconds since the start. */
  time = 0

  /** Seconds since the previous frame. */
  delta = 0

  private origin = performance.now()
  private previous = this.origin

  update(now: number) {
    this.time = (now - this.origin) / 1000

    // A tab left in the background comes back with a delta of several seconds.
    this.delta = Math.min((now - this.previous) / 1000, 1 / 30)
    this.previous = now
  }
}
