import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Instanced cubes',

  insight: `## Quand un point ne suffit plus

Un point est un carré de pixels face à l'écran. Il ne peut pas tourner, il ne
peut pas être éclairé, il n'a pas d'épaisseur. L'instanciation est le cran
au-dessus.

\`\`\`ts
const geometry = new Box(gl)

geometry.addAttribute('offset', {
  instanced: 1, size: 3, data: offset,
})
geometry.addAttribute('random', {
  instanced: 1, size: 1, data: random,
})
\`\`\`

\`instanced: 1\` veut dire « avance d'une entrée par **instance**, pas par
sommet ». Le cube est envoyé une fois, les quatre mille décalages une fois, et
le GPU dessine tout en un seul appel. Ajouter mille copies coûte quatre mille
flottants, pas mille appels de dessin.

En WebGL 1 c'est l'extension
[ANGLE_instanced_arrays](https://developer.mozilla.org/en-US/docs/Web/API/ANGLE_instanced_arrays) ;
OGL la demande pour vous.

## Le compromis

Vous gagnez de la vraie géométrie : des faces, des normales, donc de la
lumière. Vous payez douze triangles par particule au lieu d'un carré. L'échange
ne vaut le coup que si la forme compte vraiment.

## Le piège du frustum culling

Les limites d'un mesh instancié décrivent **un seul** cube à l'origine, parce
que c'est la seule géométrie que le moteur connaît. Elles ne disent rien de
l'endroit où sont les copies.

\`\`\`ts
mesh.frustumCulled = false
\`\`\`

Sans cette ligne, toute la ceinture disparaît dès que l'origine sort de
l'écran. Le symptôme — un objet qui s'évanouit d'un coup quand on tourne la
caméra — est déroutant la première fois, et il revient dès qu'on fait de
l'instanciation ou un déplacement dans le vertex shader.

## Si vous vouliez des plans plutôt que des cubes

Le cas le plus courant de l'instanciation n'est pas le cube mais le **quad face
caméra** : une étincelle, une feuille, un flocon. Et le billboarding tient en
deux lignes, sans matrice à inverser :

\`\`\`glsl
vec4 viewPosition = modelViewMatrix
                  * vec4(offset, 1.0);

viewPosition.xy += position.xy * size;
\`\`\`

Placez d'abord l'instance là où elle va dans l'espace **caméra**, puis ajoutez
les coins du quad. L'espace caméra a l'écran pour plan XY, donc le quad nous
fait face quoi que fasse la caméra.

C'est ce qu'il faut employer dès qu'un point ne suffit plus : un sprite de
point ne peut ni tourner (\`gl_PointCoord\` est verrouillé sur les axes de
l'écran), ni être étiré, ni dépasser \`ALIASED_POINT_SIZE_RANGE\` — 64 pixels
chez certains pilotes.`,

  resources: [
    { label: "WebGL Fundamentals — Instanced drawing", url: "https://webglfundamentals.org/webgl/lessons/webgl-instanced-drawing.html" },
  ],
}

export default step
