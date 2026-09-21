export type Resource = {
  label: string
  url: string
}

/**
 * Everything the sidebar and the notes panel need to know about a step.
 * It lives in step.ts next to the code, so main.ts stays pure WebGL.
 */
export type Step = {
  /** Shown in the sidebar. */
  title: string
  /** Steps left out are optional: nothing later in the course depends on them. */
  required?: boolean
  /** Shown in the right panel — the why, and the traps. Backticks become code. */
  insight?: string
  resources?: Resource[]
}
