import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Belt around the planet',
  required: true,

  insight: `## Le retour sur le chapitre précédent

Deux fichiers, et aucun des deux n'est long. \`BeltScene\` étend la scène planète
et ajoute un objet ; \`main.ts\` la monte.

\`\`\`ts
export class BeltScene extends SpaceScene {
  belt: Belt

  constructor(gl: OGLRenderingContext) {
    super(gl)
    this.belt = new Belt(gl)
    this.belt.setParent(this)
  }

  update(time: number) {
    super.update(time)
    this.belt.update(time)
  }
}
\`\`\`

C'est exactement à ça que servait le chapitre organisation : ajouter un objet à
une scène ne demande plus de toucher à ce qui existait.

## La forme vient du JavaScript

Rien de nouveau dans le shader de la ceinture. L'anneau existe parce que les
positions ont été générées ainsi :

\`\`\`ts
const angle = Math.random() * Math.PI * 2
const radius = 1.6 + Math.random() * 0.7

position.set([
  Math.cos(angle) * radius,
  (Math.random() - 0.5) * 0.12,
  Math.sin(angle) * radius,
], i * 3)
\`\`\`

Choisir un angle et un rayon au lieu de trois nombres indépendants suffit à
transformer un nuage en anneau. C'est le partage à retenir : **le JavaScript
décide la disposition une fois, le shader décide le comportement à chaque
frame**.

## Une division qui fait tout

\`\`\`glsl
float angle = uTime * (0.5 / radius);
\`\`\`

Les particules intérieures tournent plus vite que les extérieures, comme dans
un vrai anneau. Sans cette division, la ceinture tourne d'un bloc et ressemble
à un disque solide. Une seule opération sépare les deux lectures.

C'est presque la vraie physique : la
[troisième loi de Kepler](https://fr.wikipedia.org/wiki/Lois_de_Kepler) donne
une vitesse angulaire en r^-3/2 plutôt qu'en 1/r. Sur un anneau aussi étroit,
l'œil ne fait pas la différence.`,

  resources: [
    { label: "WebGL Fundamentals — Scene graph", url: "https://webglfundamentals.org/webgl/lessons/webgl-scene-graph.html" },
  ],
}

export default step
