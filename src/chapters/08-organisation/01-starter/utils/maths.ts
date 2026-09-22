export function lerp(from: number, to: number, t: number) {
  return from + (to - from) * t
}

// Moves `current` toward `target` with the same feel at any frame rate. `delta` is in seconds.
export function damp(current: number, target: number, speed: number, delta: number) {
  return lerp(current, target, 1 - Math.exp(-speed * delta))
}
