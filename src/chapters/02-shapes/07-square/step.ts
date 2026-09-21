import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Square',

  insight: `## abs replie le plan

\`\`\`glsl
vec2 uv = vUv * 2.0 - 1.0;
vec2 distance = abs(uv) - 0.35;
\`\`\`

\`abs\` renvoie la valeur absolue composante par composante, donc les quatre
quadrants se superposent. Vous ne raisonnez plus que sur un coin au lieu de
quatre, et la symétrie est gratuite.

La plupart du code de formes 2D repose sur cette astuce. Elle est la première
ligne de presque toutes les
[fonctions de distance d'Inigo Quilez](https://iquilezles.org/articles/distfunctions2d/).

## Deux axes à la fois

Un pixel est dans le carré seulement s'il y est sur les deux axes. \`max\` teste
exactement ça : il suffit que l'une des deux distances soit positive pour que
le pixel soit dehors.

C'est le même \`max\` que pour l'union de deux formes à l'étape précédente, sauf
qu'il s'applique ici aux deux composantes d'un même vecteur plutôt qu'à deux
formes.`,

  resources: [
    { label: "The Book of Shaders — Shapes", url: "https://thebookofshaders.com/07/" },
  ],
}

export default step
