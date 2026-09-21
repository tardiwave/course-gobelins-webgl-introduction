import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Band',
  required: true,

  insight: `## Une forme est un nombre

C'est le changement de point de vue le plus important du chapitre. On ne
« dessine » rien : pour chaque pixel on calcule un nombre entre 0 et 1 qui dit
à quel point il appartient à la forme, puis on s'en sert pour mélanger deux
couleurs.

\`\`\`glsl
float band = step(0.4, vUv.x) - step(0.6, vUv.x);
vec3 color = mix(DARK, BLUE, band);
\`\`\`

\`step(edge, x)\` vaut 0 avant le seuil et 1 après. En soustraire deux ne laisse
1 qu'entre les deux : c'est une bande. La moitié de ce chapitre est construite
à partir de là.

## Pourquoi c'est crénelé

\`step\` bascule d'un pixel à l'autre, donc le bord est en escalier. Remplacez-le
par \`smoothstep(0.39, 0.41, vUv.x)\` et le bord devient un dégradé.

Attention, 0.02 n'est pas une taille en pixels : c'est 2 % de la largeur, soit
une trentaine de pixels sur un écran de 1 500. Pour un bord doux d'un ou deux
pixels quelle que soit la fenêtre, la largeur doit venir de la résolution —
\`2.0 / uResolution.x\`, que vous saurez écrire deux étapes plus loin.

Il n'y a **pas** d'antialiasing automatique sur ce que vous calculez dans un
fragment shader. Le MSAA du contexte WebGL ne lisse que les bords de la géométrie,
et ici la géométrie est un triangle plein écran : ses bords sont hors cadre.
C'est à vous de rendre vos formes douces.

[The Book of Shaders — Shaping functions](https://thebookofshaders.com/05/)
liste les fonctions qui servent à ça.`,

  resources: [
    { label: "The Book of Shaders — Shaping functions", url: "https://thebookofshaders.com/05/" },
  ],
}

export default step
