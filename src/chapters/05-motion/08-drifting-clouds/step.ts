import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Drifting clouds',

  insight: `Les nuages du chapitre textures, maintenant en mouvement — et le mouvement est
superposé deux fois.

## Le domain warping

\`\`\`glsl
float nx = texture2D(tNoise, uv * 0.5 + uTime * 0.010).r;
float ny = texture2D(tNoise, uv * 0.5 - uTime * 0.013 + 0.37).r;

vec2 offset = (vec2(nx, ny) - 0.5) * drift;

vec4 clouds = texture2D(tClouds, uv + offset + vec2(uTime * 0.004, 0.0));
\`\`\`

Le bruit n'est **jamais dessiné**. Il sert à décider où lire la couche de
nuages. Comme il est lu deux fois, à deux endroits et à deux vitesses
différentes, les deux valeurs divergent légèrement d'un pixel à l'autre, et la
nappe se plie au lieu de glisser d'un bloc.

Le \`+ 0.37\` écarte les deux lectures : sans lui, au lancement, \`nx\` et \`ny\`
liraient le même texel et le décalage ne pourrait aller qu'en diagonale.

Cette technique s'appelle le domain warping, et c'est probablement l'astuce au
meilleur rapport effort/résultat de tout le cours. Elle fait tourner les
flowmaps, les mirages de chaleur, les transitions liquides et les fumées.
[L'article d'Inigo Quilez](https://iquilezles.org/articles/warp/) montre
jusqu'où ça peut aller.

## Le -0.5

Une texture renvoie des valeurs de 0 à 1. Un décalage doit pouvoir aller dans
les deux sens, donc il faut recentrer sur zéro avant de multiplier par
l'amplitude. Oublier ce \`-0.5\` fait dériver toute l'image dans un coin, et
c'est une erreur qu'on refait régulièrement.

## Deux échelles de mouvement

Mettez \`drift\` à 0.0 dans le shader : les nuages continuent de défiler, mais ils cessent de
tourbillonner. C'est la meilleure façon de séparer les deux effets — le
défilement global d'un côté, la déformation locale de l'autre.`,

  resources: [
    { label: "The Book of Shaders — Noise", url: "https://thebookofshaders.com/11/" },
    { label: "Inigo Quilez — Domain warping", url: "https://iquilezles.org/articles/warp/" },
  ],
}

export default step
