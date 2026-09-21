import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Displacement map',

  insight: `Le bruit fabrique une planète ; une image fabrique **cette** planète. Le relief
vient de \`earth-height.png\`, dans la même projection que la carte de couleurs,
donc les montagnes tombent exactement sur les continents.

## Lire une texture dans un vertex shader

\`\`\`glsl
vec3 displaced = n + n * height(uv) * uAmplitude;
\`\`\`

L'appel derrière \`height()\` est celui que vous connaissez : \`texture2D\`. Ce qui
est nouveau, c'est l'endroit. Un vertex shader peut échantillonner une texture,
et ça transforme n'importe quelle image en géométrie.

**Ce que la spec ne garantit pas** : le nombre d'unités de texture accessibles
depuis un vertex shader peut légalement valoir **zéro**. Sur quelques vieilles
puces mobiles c'est le cas, et votre planète reste une sphère lisse sans aucune
erreur.

\`\`\`ts
gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS)
\`\`\`

## Trois sources, une seule signature

Le sélecteur du panneau change ce que \`height(vec2)\` renvoie, et rien d'autre :

\`\`\`glsl
// une vraie carte d'altitude
smoothstep(0.03, 0.2, raw) * raw;

// n'importe quelle image, répétée
texture2D(tNoise, coords * 2.0).r * 0.8;

// aucune image du tout
max(fbm(sphereAt(coords) * 1.6), 0.0) * 1.6;
\`\`\`

C'est la leçon : la géométrie ne sait pas d'où vient le nombre. Une carte
d'altitude, une texture de bruit, une fonction — même signature, même code en
aval.

La version procédurale passe par \`sphereAt()\`, qui retrouve le point de la
sphère correspondant à une UV. Évaluer du bruit 2D directement sur une carte
équirectangulaire déchirerait la couture ; le faire en 3D referme le globe sur
lui-même.

## La plage

Couper la mer avec un simple \`max(h - seuil, 0.0)\` laisse une falaise d'**un
texel de large** tout le long des côtes. Le \`smoothstep\` fait monter la
première tranche de terre progressivement.

## La normale se calcule par pixel

Le vertex shader déplace la surface, mais c'est le fragment shader qui
reconstruit la normale, à partir de la pente de la même fonction :

\`\`\`glsl
float slopeU = height(vUv + vec2(texel.x, 0.0))
             - height(vUv - vec2(texel.x, 0.0));
\`\`\`

Par sommet, ça donnait des facettes et de longues zébrures noires le long des
Rocheuses : une normale interpolée sur un triangle ne peut pas décrire un
relief plus fin que ce triangle. Par pixel, l'ombrage devient lisse et cesse de
dépendre du maillage — 256 segments suffisent.

Deux garde-fous complètent ça. Le curseur **shading**, séparé de **relief** :
la géométrie peut être discrète pendant que l'ombrage ne l'est pas. Et un
plafond sur l'inclinaison, pour qu'une falaise ne bascule jamais la normale
au-delà de l'horizon.

## La correction équirectangulaire

C'est le point que tout le monde rate. L'image est étirée sur la sphère : un
pas en \`u\` couvre tout un parallèle à l'équateur et presque rien aux pôles.

\`\`\`glsl
float parallel = max(sqrt(1.0 - vLocal.y * vLocal.y), 0.08);
\`\`\`

Diviser les deux pentes par l'arc qu'elles couvrent réellement garde l'ombrage
cohérent des tropiques aux calottes. Sans ça, les pôles se dissolvent en bruit.

## Ce qui plafonne encore le relief

La géométrie, pas la texture. La carte fait 2048 texels de large ; à 256
segments le maillage n'en échantillonne qu'un sur huit. Monter les segments
continue d'améliorer la silhouette jusqu'à 2048 — mais depuis que l'ombrage
est calculé par pixel, ce qui reste à gagner ne se voit plus à taille réelle.`,

  resources: [
    { label: "MDN — getParameter", url: "https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter" },
    { label: "Wikipedia — Equirectangular projection", url: "https://en.wikipedia.org/wiki/Equirectangular_projection" },
  ],
}

export default step
