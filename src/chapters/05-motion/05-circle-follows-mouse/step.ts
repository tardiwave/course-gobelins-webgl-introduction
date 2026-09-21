import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Circle follows the mouse',

  insight: `## Deux mondes, deux conventions

Le DOM parle en pixels avec \`y\` vers le bas. Le shader parle en 0 à 1 avec \`y\`
vers le haut. Cette conversion se fait une fois, en JavaScript, pour que le
shader reste simple.

Si votre effet suit le curseur **à l'envers verticalement**, c'est ce \`1 -\` qui
manque. C'est le bug le plus fréquent du cours.

## Corriger le ratio des deux côtés

\`\`\`glsl
vec2 uv = vec2(vUv.x * aspect, vUv.y);
vec2 mouse = vec2(uMouse.x * aspect, uMouse.y);

float circle = smoothstep(
  0.2, 0.195, length(uv - mouse)
);
\`\`\`

Le pixel **et** le curseur passent par la même correction. Si vous n'en
corrigez qu'un, le cercle reste rond mais ne suit plus le curseur ; si vous
n'en corrigez aucun, il suit bien mais devient un œuf. Les deux erreurs se
ressemblent assez pour qu'on cherche longtemps.

La règle : décidez d'un espace de coordonnées, puis convertissez **tout** ce
qui y entre.`,

  resources: [
    { label: "The Book of Shaders — Shapes", url: "https://thebookofshaders.com/07/" },
  ],
}

export default step
