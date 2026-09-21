import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Halo',

  insight: `Le Fresnel brille sur la surface de la planète elle-même, donc il ne peut
jamais déborder de la silhouette. Une atmosphère est de l'air **au-dessus** du
sol : il lui faut sa propre géométrie. La même sphère, 25 % plus grande,
transparente.

## Trois réglages de rendu, et pourquoi

\`\`\`ts
transparent: true,
cullFace: gl.FRONT,
depthWrite: false,
\`\`\`

\`cullFace: gl.FRONT\` est le plus surprenant. Par défaut le GPU jette les faces
arrière d'une forme, puisqu'on ne les voit pas. Ici c'est l'inverse : on veut la
face **lointaine** de la coque, celle qui est derrière la planète, parce que
c'est l'air qu'on traverse du regard. Inverser la face conservée tient en un
réglage.

\`depthWrite: false\` est l'autre. Une surface transparente qui écrit dans le
depth buffer cache tout ce qui est dessiné après elle, et on se retrouve avec
des trous inexplicables. La règle générale : **les objets transparents lisent la
profondeur mais ne l'écrivent pas**, et il faut les dessiner après les opaques,
du plus loin au plus proche. OGL trie pour vous.

## La décroissance fait l'atmosphère

\`\`\`glsl
float glow = exp(-t * uFalloff);
\`\`\`

L'air se raréfie exponentiellement avec l'altitude, et la lumière qu'il diffuse
aussi. \`exp()\` est donc la courbe honnête — descendez le curseur à 1 et ça
devient un halo plat auquel vous ne croiriez pas.

Le vrai phénomène s'appelle la
[diffusion de Rayleigh](https://fr.wikipedia.org/wiki/Diffusion_Rayleigh), et
c'est aussi pourquoi la teinte tire vers le bleu.

## La ligne à lire deux fois

Le shader **retourne** la normale pour raisonner sur la coque vue de
l'intérieur, mais utilise la normale **d'origine** pour demander si ce morceau
d'air est au soleil. Prenez la retournée là aussi et l'atmosphère s'allume du
côté nuit — un bug parfaitement cohérent et parfaitement faux.`,

  resources: [
    { label: "MDN — cullFace", url: "https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/cullFace" },
    { label: "Wikipedia — Rayleigh scattering", url: "https://en.wikipedia.org/wiki/Rayleigh_scattering" },
  ],
}

export default step
