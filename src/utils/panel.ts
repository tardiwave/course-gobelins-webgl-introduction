import { Pane } from 'tweakpane'

/**
 * A Tweakpane panel floating over the canvas.
 * Call dispose() when the step is torn down, or the panel outlives the page.
 */
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
