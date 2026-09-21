/**
 * What every scene in this course agrees to do. A scene is also a Transform,
 * so it can be rotated, nested in another, or handed straight to the renderer.
 */
export interface Scene {
  /** Called once per frame, before the render. */
  update(time: number): void

  /** Called when the step is left. Release anything still on the GPU. */
  dispose(): void
}
