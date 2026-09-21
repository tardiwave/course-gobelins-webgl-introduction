import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Velocity map',

  insight: `Bougez le curseur. Ce que vous regardez n'est pas un effet : ce sont **deux
nombres par texel**, une flèche, coloriée pour que vous puissiez la voir. Les
étapes suivantes donneront ces flèches au rendu.

C'est la boucle de rétroaction du chapitre précédent braquée sur l'écran plutôt
que sur une liste de rochers. \`src/objects/Fluid.ts\` vaut la peine d'être ouvert :
il n'y a presque rien dedans.

## L'advection, en une ligne

\`\`\`glsl
vec2 velocity = texture2D(tField, vUv).xy;

vec2 field = texture2D(
  tField, vUv - velocity * uDelta
).xy;
\`\`\`

C'est ce qui fait un fluide plutôt qu'une tache qui s'efface.

Un fragment shader ne peut écrire que sur **son propre pixel**. Rien ne peut
donc être poussé ailleurs. À la place, chaque texel regarde **en arrière** le
long de la vitesse et demande ce qui était là un instant plus tôt. Chaque pixel
tire ; aucun ne pousse.

Une fois cette inversion comprise, vous la reconnaîtrez partout en simulation
GPU. Elle porte un nom, l'advection semi-lagrangienne, et vient de
[ce chapitre de GPU Gems](https://developer.nvidia.com/gpugems/gpugems/part-vi-beyond-triangles/chapter-38-fast-fluid-dynamics-simulation-gpu).

## LINEAR n'est pas décoratif

Regarder en arrière le long d'une vitesse tombe **entre** les texels. En
\`NEAREST\`, le champ avance par blocs visibles. Ça demande une extension de plus,
\`OES_texture_float_linear\` : le filtrage linéaire des textures flottantes n'est
pas garanti en WebGL 1, même quand les textures flottantes le sont.

## L'oubli

\`\`\`glsl
field *= exp(-uDelta * uDecay);
\`\`\`

Descendez le curseur \`decay\` au minimum et remuez : le champ met plusieurs
secondes à oublier, et l'écran reste brassé longtemps. Cette décroissance est
ce qui sépare ça d'un gâchis permanent. L'\`exp(-k·dt)\` est la forme correcte, indépendante du
frame rate ; un \`* 0.98\` par frame ne l'est pas.

## Un peu de flou à chaque frame

L'advection a un défaut qu'on ne devine pas : relire entre les texels, frame
après frame, **resserre** les bords du champ au lieu de les adoucir, jusqu'à ce
qu'ils ne fassent plus qu'un texel. Repassez au même endroit et la déformation
se découpe en blocs.

La simulation mélange donc chaque texel avec ses quatre voisins, à 18 %. C'est
la **viscosité** au sens physique : ce qui empêche un fluide d'avoir des arêtes
vives.

## Ce que ce n'est pas

Un solveur de fluide. Il n'y a pas d'étape de **pression**, rien qui impose que
ce qui entre dans une région en ressorte. C'est cette étape manquante qui fait
qu'un vrai fluide s'enroule sur lui-même et que celui-ci ne le fait jamais.

C'est une carte de flux — et pour déformer une image, une carte de flux suffit
presque toujours.`,

  resources: [
    { label: "GPU Gems — Fast Fluid Dynamics Simulation on the GPU", url: "https://developer.nvidia.com/gpugems/gpugems/part-vi-beyond-triangles/chapter-38-fast-fluid-dynamics-simulation-gpu" },
    { label: "MDN — OES_texture_float_linear", url: "https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_float_linear" },
  ],
}

export default step
