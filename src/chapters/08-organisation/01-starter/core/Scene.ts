import type { Clock } from './Clock.ts'

export interface Scene {
  update(clock: Clock): void
  dispose(): void
}
