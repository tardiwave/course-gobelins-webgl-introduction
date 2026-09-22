export interface Scene {
  /** Called once per frame, before the render. */
  update(time: number): void

  /** Called when the step is left. Release anything still on the GPU. */
  dispose(): void
}
