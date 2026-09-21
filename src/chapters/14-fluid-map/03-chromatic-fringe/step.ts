import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Chromatic fringe',

  insight: `## Le même calcul, une autre source

\`\`\`glsl
vec2 shift = texture2D(tField, vUv).xy * uStrength;

vec3 color = vec3(
  texture2D(tScene, vUv - shift * (1.0 + uSpread)).r,
  texture2D(tScene, vUv - shift).g,
  texture2D(tScene, vUv - shift * (1.0 - uSpread)).b
);
\`\`\`

Trois lectures à trois distances légèrement différentes, un canal gardé de
chacune. Les maths sont l'aberration du chapitre post-processing. Ce qui change,
c'est **d'où vient le décalage**.

Là-bas c'était \`vUv - 0.5\` : une lentille fixe, maximale dans les coins,
identique à chaque frame. Ici c'est le champ de vitesse, donc la frange
n'existe que là où l'image bouge, et pointe dans la direction où elle bouge.
Une image immobile n'en a aucune.

## Un effet qui sait ce que l'image fait

C'est toute la différence entre un filtre appliqué à une image et un effet
piloté par l'état de la scène, et c'est l'essentiel de ce qui fait lire ça
comme du **mouvement** plutôt que comme un traitement.

Le même principe donne le motion blur : au lieu de séparer les canaux, on
échantillonne plusieurs fois le long du vecteur de vitesse et on moyenne.

## Le réglage

Tirez le curseur de frange de 0 à 0,4 en remuant. Juste en dessous de « je vois
ce que c'est » est en général la bonne réponse.

La vignette du champ est toujours là, en bas à droite, et toujours cliquable.`,

  resources: [
    { label: "Wikipedia — Chromatic aberration", url: "https://en.wikipedia.org/wiki/Chromatic_aberration" },
  ],
}

export default step
