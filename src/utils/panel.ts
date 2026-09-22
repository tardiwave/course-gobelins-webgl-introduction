import { Pane } from 'tweakpane'

// Call dispose() on teardown, or the panel outlives the step.
export function createPanel(root: HTMLElement, title = 'Controls') {
  const container = document.createElement('div')
  container.className = 'tweakpane'
  root.append(container)

  const pane = new Pane({ container, title })

  return {
    pane,
    dispose() {
      pane.dispose()
      container.remove()
    },
  }
}
