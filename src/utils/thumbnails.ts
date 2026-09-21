// Must match core/thumbnails.glsl, which draws the boxes.
const SIZE = 0.16
const GAP = 0.015
const BOTTOM = 0.025

/**
 * Click handling for the debug thumbnails: click one to blow it up, click
 * again to go back. `zoom.value` is the slot on show, or -1 for none.
 */
export function createThumbnails(element: HTMLElement, count: number) {
  const zoom = { value: -1 }

  let downX = 0
  let downY = 0

  const slotAt = (event: PointerEvent) => {
    const bounds = element.getBoundingClientRect()
    const u = (event.clientX - bounds.left) / bounds.width
    // Texture coordinates start at the bottom, the page starts at the top.
    const v = 1 - (event.clientY - bounds.top) / bounds.height

    if (v < BOTTOM || v > BOTTOM + SIZE) return -1

    const offset = u - (0.98 - (count * SIZE + (count - 1) * GAP))
    if (offset < 0) return -1

    const slot = Math.floor(offset / (SIZE + GAP))
    if (slot >= count || offset - slot * (SIZE + GAP) > SIZE) return -1

    return slot
  }

  const onDown = (event: PointerEvent) => {
    downX = event.clientX
    downY = event.clientY
  }

  const onUp = (event: PointerEvent) => {
    // A drag is an orbit, not a click.
    if (Math.abs(event.clientX - downX) > 4 || Math.abs(event.clientY - downY) > 4) return

    if (zoom.value >= 0) {
      zoom.value = -1
      return
    }

    const slot = slotAt(event)
    if (slot >= 0) zoom.value = slot
  }

  const onMove = (event: PointerEvent) => {
    element.style.cursor = zoom.value >= 0 || slotAt(event) >= 0 ? 'pointer' : ''
  }

  element.addEventListener('pointerdown', onDown)
  element.addEventListener('pointerup', onUp)
  element.addEventListener('pointermove', onMove)

  return {
    zoom,
    dispose() {
      element.removeEventListener('pointerdown', onDown)
      element.removeEventListener('pointerup', onUp)
      element.removeEventListener('pointermove', onMove)
      element.style.cursor = ''
    },
  }
}
