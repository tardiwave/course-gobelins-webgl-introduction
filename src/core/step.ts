export type Resource = {
  label: string
  url: string
}

export type Step = {
  /** Shown in the sidebar. */
  title: string
  /** Optional steps: nothing later depends on them. */
  required?: boolean
  /** Shown in the right panel. Backticks become code. */
  insight?: string
  resources?: Resource[]
}
