import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Cross',

  insight: `## Combiner des formes, c'est de l'arithmétique

Dès lors qu'une forme n'est qu'un nombre entre 0 et 1 :

\`\`\`glsl
float unionAB        = max(a, b);
float intersectionAB = min(a, b);
float aWithoutB      = a * (1.0 - b);
\`\`\`

Il n'y a pas d'API de formes dans GLSL, pas de chemins, pas de booléens
géométriques. Tout se fait avec ces trois lignes, et c'est suffisant.

## Ce qui est réutilisé

La croix, c'est la bande de l'étape Band écrite deux fois, une par axe, puis
\`max\`. Rien de neuf : c'est le premier exemple du fait qu'en shader on ne
construit presque jamais une forme de zéro, on en assemble deux.

C'est le même \`max\` qui traçait déjà les lignes de la grille, et c'est \`min\`
qui deviendra la base du raymarching, au dernier chapitre.`,

  resources: [
    { label: "The Book of Shaders — Shapes", url: "https://thebookofshaders.com/07/" },
  ],
}

export default step
