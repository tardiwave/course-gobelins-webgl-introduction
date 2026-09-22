import './style.css'
import type { Step } from './core/step.ts'

type Module = { start: (root: HTMLElement) => () => void; title?: string }
type Page = {
  slug: string
  chapter: string
  path: string
  module: Module
  step: Step
}

// A chapter folder holds main.ts (the WebGL) and step.ts (the notes).
// A playground folder has no step.ts: its main.ts exports its own title.
const stepModules = import.meta.glob<Module>('./chapters/*/*/main.ts', { eager: true })
const stepMeta = import.meta.glob<Step>('./chapters/*/*/step.ts', { eager: true, import: 'default' })
const playgroundModules = import.meta.glob<Module>('./playground/*/main.ts', { eager: true })

// Chapters whose name does not survive a plain capitalisation.
const NAMES: Record<string, string> = {
  '06-3d': '3D',
  '12-post-processing': 'Post-processing',
  '13-gpgpu': 'GPGPU',
}

const label = (name: string) => {
  if (NAMES[name]) return NAMES[name]
  const words = name.replace(/^\d+-/, '').replace(/-/g, ' ')
  return words.charAt(0).toUpperCase() + words.slice(1)
}

const bySlug = (a: Page, b: Page) => a.slug.localeCompare(b.slug)

const steps: Page[] = Object.entries(stepModules)
  .map(([path, module]) => {
    const parts = path.split('/')
    return {
      slug: parts.slice(2, -1).join('/'),
      chapter: parts[2],
      path: path.replace('./', 'src/'),
      module,
      step: stepMeta[path.replace('main.ts', 'step.ts')],
    }
  })
  .sort(bySlug)

const sandboxes: Page[] = Object.entries(playgroundModules)
  .map(([path, module]) => {
    const parts = path.split('/')
    return {
      slug: parts.slice(1, -1).join('/'),
      chapter: 'playground',
      path: path.replace('./', 'src/'),
      module,
      step: { title: module.title ?? label(parts[2]), required: true },
    }
  })
  .sort(bySlug)

const pages = [...sandboxes, ...steps]

const chapters = [...new Set(steps.map((page) => page.chapter))]

const sidebar = document.querySelector<HTMLElement>('#sidebar')!
const panel = document.querySelector<HTMLElement>('#panel')!
const app = document.querySelector<HTMLElement>('#app')!
const toggleLeft = document.querySelector<HTMLButtonElement>('#toggle-left')!
const toggleRight = document.querySelector<HTMLButtonElement>('#toggle-right')!

const link = ({ slug, step }: Page) => `
  <a href="#/${slug}" data-slug="${slug}">
    <span>${step.title}</span>
    ${step.required ? '' : '<i>optional</i>'}
  </a>`

sidebar.innerHTML = `
  <p class="brand">WebGL Introduction<br />Gobelins</p>

  <section class="sandbox">
    <h2>Playground</h2>
    <nav>${sandboxes.map(link).join('')}</nav>
  </section>

  <section class="course">
    <h2 class="course-title">Course</h2>
    ${chapters
      .map(
        (chapter, index) => `
          <h2>${String(index + 1).padStart(2, '0')} · ${label(chapter)}</h2>
          <nav>${steps
            .filter((page) => page.chapter === chapter)
            .map(link)
            .join('')}</nav>`,
      )
      .join('')}
  </section>
`

const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;')

// `code`, [label](url) and **bold** inside a paragraph.
const inline = (text: string) =>
  escape(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')

// Tiny Markdown: code fences, ## headings, paragraphs. Split on ``` first to keep blank lines in code.
const article = (text: string) =>
  text
    .trim()
    .split('```')
    .map((part, index) => {
      if (index % 2 === 1) {
        return `<pre><code>${escape(part.replace(/^[a-z]*\n/, '').replace(/\n$/, ''))}</code></pre>`
      }
      return part
        .split(/\n\s*\n/)
        .filter((block) => block.trim())
        .map((block) => {
          const trimmed = block.trim()
          return trimmed.startsWith('## ')
            ? `<h3>${inline(trimmed.slice(3))}</h3>`
            : `<p>${inline(trimmed)}</p>`
        })
        .join('')
    })
    .join('')

let dispose: (() => void) | undefined

// Private windows can refuse localStorage, so every access is guarded.
const remember = (key: string, closed?: boolean) => {
  try {
    if (closed === undefined) return localStorage.getItem(key) === 'closed'
    localStorage.setItem(key, closed ? 'closed' : 'open')
  } catch {
    // No storage: the panels start open.
  }

  return closed ?? false
}

let leftClosed = remember('sidebar')
let rightClosed = remember('panel')
let hasNotes = true

// ?raw hides everything but the canvas. Handy on a projector.
const raw = new URLSearchParams(location.search).has('raw')

document.body.classList.toggle('raw', raw)

const applyPanels = () => {
  document.body.classList.toggle('hide-left', leftClosed)
  document.body.classList.toggle('hide-right', rightClosed || !hasNotes)
  document.body.classList.toggle('no-notes', !hasNotes)
}

function render() {
  const slug = location.hash.replace('#/', '')
  const page = pages.find((item) => item.slug === slug) ?? pages[0]
  const { insight, resources } = page.step

  sidebar.querySelectorAll('a').forEach((item) => {
    item.classList.toggle('active', item.dataset.slug === page.slug)
  })

  panel.innerHTML = `
    ${insight ? `<section><h2>Insight</h2>${article(insight)}</section>` : ''}
    ${
      resources?.length
        ? `<section><h2>Resources</h2>${resources
            .map((item) => `<a href="${item.url}" target="_blank" rel="noreferrer">${item.label} ↗</a>`)
            .join('')}</section>`
        : ''
    }
  `

  hasNotes = Boolean(panel.innerHTML.trim())
  applyPanels()

  dispose?.()
  app.replaceChildren()

  const caption = document.createElement('p')
  caption.className = 'caption'
  caption.textContent = page.path
  app.append(caption)

  dispose = page.module.start(app)
}

toggleLeft.addEventListener('click', () => {
  leftClosed = remember('sidebar', !leftClosed)
  applyPanels()
})

toggleRight.addEventListener('click', () => {
  rightClosed = remember('panel', !rightClosed)
  applyPanels()
})

addEventListener('keydown', (event) => {
  if (event.metaKey || event.ctrlKey || event.altKey) return
  if (event.key === 's') toggleLeft.click()
  if (event.key === 'n') toggleRight.click()
})

addEventListener('hashchange', render)

applyPanels()
render()

if (import.meta.hot) import.meta.hot.dispose(() => dispose?.())
