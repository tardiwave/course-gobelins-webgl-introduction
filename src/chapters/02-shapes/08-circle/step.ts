import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Circle',

  insight: `## Un cercle, c'est une distance

\`\`\`glsl
float distance = length(uv);
float circle = smoothstep(0.35, 0.345, distance);
\`\`\`

\`length(uv)\` est la distance du pixel au centre. Tout le cercle tient dans ce
seul nombre, comparé à un rayon.

## Les seuils inversés

Regardez l'ordre des arguments : 0.35 puis 0.345, du plus grand au plus petit.
On veut 1 à l'intérieur du cercle et 0 à l'extérieur, or \`distance\` grandit
vers l'extérieur : la rampe doit **descendre**.

Ce que peu de gens savent : la spécification GLSL déclare le résultat
**indéfini** quand le premier seuil est plus grand que le second. En pratique
tous les GPU appliquent la formule telle quelle et la rampe s'inverse, donc
l'idiome est partout — Shadertoy, three.js, et ce cours. La version que la
spec garantit :

\`\`\`glsl
float circle = 1.0 - smoothstep(0.345, 0.35, distance);
\`\`\`

## Disque ou lueur

Comparez avec l'étape Smooth circle : ici le bord existe et se situe exactement
à 0.35. Là-bas il n'y avait pas de bord du tout. Deux façons opposées de faire
un rond, et le choix dépend entièrement de ce que vous voulez que l'œil lise.`,

  resources: [
    { label: "The Book of Shaders — Shapes", url: "https://thebookofshaders.com/07/" },
  ],
}

export default step
